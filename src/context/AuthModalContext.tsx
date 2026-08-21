import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

type ModalMode = "signin" | "signup";

interface AuthModalContextProps {
  isOpen: boolean;
  mode: ModalMode;
  open: (mode: ModalMode) => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextProps | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("signin");

  const open = useCallback((m: ModalMode) => {
    setMode(m);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      open,
      close,
    }),
    [isOpen, mode, open, close],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
};
