import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

interface AuthModalContextProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextProps | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      open,
      close,
    }),
    [isOpen, open, close],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
};
