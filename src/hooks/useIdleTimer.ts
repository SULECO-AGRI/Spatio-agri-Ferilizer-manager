import { useEffect, useRef, useState, useCallback } from "react";
import { isTokenExpired } from "@/utils/tokenUtils";

export const STORAGE_KEY_LAST_ACTIVITY = "spatioagri_last_active_timestamp";
export const STORAGE_KEY_LOGOUT_EVENT = "spatioagri_logout_broadcast";
const THROTTLE_WRITE_MS = 1000; // Throttle localStorage write to at most once per second

export interface UseIdleTimerOptions {
  /**
   * Total idle duration in milliseconds before automatic logout (default: 30 minutes = 1,800,000ms)
   */
  timeoutMs?: number;
  /**
   * Duration of the warning modal before timeout occurs (default: 2 minutes = 120,000ms)
   */
  warningMs?: number;
  /**
   * Current JWT access token to monitor for absolute expiration
   */
  token?: string | null;
  /**
   * Callback fired when idle duration is reached
   */
  onIdleTimeout: () => void;
  /**
   * Callback fired when absolute token expiry is reached
   */
  onTokenExpired?: () => void;
  /**
   * Async callback executed when user clicks "Stay Logged In" to refresh token
   */
  onStayLoggedIn?: () => Promise<unknown> | unknown;
  /**
   * Whether idle tracking is currently enabled (e.g., only when authenticated)
   */
  enabled?: boolean;
}

export interface UseIdleTimerReturn {
  isWarningActive: boolean;
  remainingWarningSeconds: number;
  stayLoggedIn: () => Promise<void>;
  isRefreshing: boolean;
}

export function useIdleTimer({
  timeoutMs = 30 * 60 * 1000, // 30 minutes
  warningMs = 2 * 60 * 1000,  // 2 minutes warning
  token,
  onIdleTimeout,
  onTokenExpired,
  onStayLoggedIn,
  enabled = true,
}: UseIdleTimerOptions): UseIdleTimerReturn {
  const [isWarningActive, setIsWarningActive] = useState(false);
  const [remainingWarningSeconds, setRemainingWarningSeconds] = useState(
    Math.floor(warningMs / 1000),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lastRecordedActivityRef = useRef<number>(Date.now());
  const lastWriteTimeRef = useRef<number>(0);
  const isLoggingOutRef = useRef<boolean>(false);

  // Sync activity timestamp to localStorage with throttling
  const recordActivityLocally = useCallback(() => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    lastRecordedActivityRef.current = now;

    if (now - lastWriteTimeRef.current >= THROTTLE_WRITE_MS) {
      lastWriteTimeRef.current = now;
      try {
        localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(now));
      } catch {
        // Safe fallback in restricted environments
      }
    }
  }, []);

  // Broadcast logout event across all open browser tabs
  const broadcastLogout = useCallback(() => {
    if (typeof window === "undefined" || isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    try {
      localStorage.setItem(STORAGE_KEY_LOGOUT_EVENT, String(Date.now()));
    } catch {
      // Safe fallback
    }
  }, []);

  // User explicitly clicks "Stay Logged In"
  const handleStayLoggedIn = useCallback(async () => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    lastRecordedActivityRef.current = now;
    lastWriteTimeRef.current = now;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(now));
    } catch {
      // Safe fallback
    }

    setIsWarningActive(false);

    if (onStayLoggedIn) {
      setIsRefreshing(true);
      try {
        await onStayLoggedIn();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onStayLoggedIn]);

  // Periodic heartbeat timer (checks every 1000ms)
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setIsWarningActive(false);
      return;
    }

    // Initialize timestamp if absent
    const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(Date.now()));
    }

    const intervalId = window.setInterval(() => {
      if (isLoggingOutRef.current) return;

      // 1. Check absolute JWT token expiration
      if (token && isTokenExpired(token)) {
        window.clearInterval(intervalId);
        broadcastLogout();
        if (onTokenExpired) {
          onTokenExpired();
        } else {
          onIdleTimeout();
        }
        return;
      }

      // 2. Fetch latest activity timestamp across all tabs
      const rawStored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
      const latestActivity = rawStored
        ? parseInt(rawStored, 10)
        : lastRecordedActivityRef.current;

      const idleDuration = Date.now() - latestActivity;
      const warningThreshold = timeoutMs - warningMs;

      if (idleDuration >= timeoutMs) {
        // Fully idle -> Coordinated logout
        window.clearInterval(intervalId);
        broadcastLogout();
        onIdleTimeout();
      } else if (idleDuration >= warningThreshold) {
        // In warning window -> show warning modal
        setIsWarningActive(true);
        const msRemaining = timeoutMs - idleDuration;
        setRemainingWarningSeconds(Math.max(0, Math.ceil(msRemaining / 1000)));
      } else {
        // Recent activity detected in this or another tab -> keep warning closed
        if (isWarningActive) {
          setIsWarningActive(false);
        }
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [
    enabled,
    timeoutMs,
    warningMs,
    token,
    isWarningActive,
    onIdleTimeout,
    onTokenExpired,
    broadcastLogout,
  ]);

  // Multi-tab sync via the window 'storage' event
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const handleStorageEvent = (event: StorageEvent) => {
      // Activity occurred in another tab -> reset timer and dismiss warning
      if (event.key === STORAGE_KEY_LAST_ACTIVITY && event.newValue) {
        lastRecordedActivityRef.current = parseInt(event.newValue, 10);
        setIsWarningActive(false);
      }

      // Another tab triggered logout -> terminate session locally
      if (event.key === STORAGE_KEY_LOGOUT_EVENT) {
        isLoggingOutRef.current = true;
        onIdleTimeout();
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [enabled, onIdleTimeout]);

  // Laptop wake / tab switch detection (immediate check without waiting for mouse move)
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const handleWakeOrFocus = () => {
      // 1. Immediate token expiration check
      if (token && isTokenExpired(token)) {
        broadcastLogout();
        if (onTokenExpired) {
          onTokenExpired();
        } else {
          onIdleTimeout();
        }
        return;
      }

      // 2. Immediate idle check
      const rawStored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
      if (rawStored) {
        const latestActivity = parseInt(rawStored, 10);
        if (Date.now() - latestActivity >= timeoutMs) {
          broadcastLogout();
          onIdleTimeout();
        }
      }
    };

    document.addEventListener("visibilitychange", handleWakeOrFocus);
    window.addEventListener("focus", handleWakeOrFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleWakeOrFocus);
      window.removeEventListener("focus", handleWakeOrFocus);
    };
  }, [enabled, token, timeoutMs, onIdleTimeout, onTokenExpired, broadcastLogout]);

  // User input activity listeners (passive and throttled)
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const eventNames: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    const listener = () => recordActivityLocally();

    eventNames.forEach((eventName) => {
      window.addEventListener(eventName, listener, { passive: true });
    });

    return () => {
      eventNames.forEach((eventName) => {
        window.removeEventListener(eventName, listener);
      });
    };
  }, [enabled, recordActivityLocally]);

  return {
    isWarningActive,
    remainingWarningSeconds,
    stayLoggedIn: handleStayLoggedIn,
    isRefreshing,
  };
}
