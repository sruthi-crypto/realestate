interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ open, onClose, children }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl bg-background rounded-2xl shadow-elevated p-8 animate-scale-in border border-border">
        <style>
          {`
            @media (prefers-reduced-motion: no-preference) {
              .animate-scale-in {
                animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
            }
          `}
        </style>
        {children}
      </div>
    </div>
  );
};

export default Modal;
