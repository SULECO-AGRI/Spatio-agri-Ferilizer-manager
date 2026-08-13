import { createContext, useContext, useState, ReactNode } from "react";

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

  const open = (m: ModalMode) => {
    setMode(m);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, open, close }}>
      {children}
    </AuthModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
};
