"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  trigger: React.ReactElement<any>;
  title?: string | ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  open?: boolean;
  titleClassName?: string;
  delay?: number; // Новый проп для задержки в миллисекундах
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw] max-h-[95vh]",
};

const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
};

export function Modal({
  children,
  trigger,
  title,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  contentClassName,
  size = "md",
  onOpenChange,
  defaultOpen = false,
  titleClassName = "",
  open,
  delay = 0, // По умолчанию без задержки
}: ModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Используем контролируемое состояние если передан open, иначе внутреннее
  const isOpen = open !== undefined ? open : internalIsOpen;

  // Проверяем, что компонент смонтирован (для SSR)
  useEffect(() => {
    setMounted(true);

    // Если defaultOpen=true и есть delay, применяем задержку
    if (defaultOpen && delay > 0 && open === undefined) {
      delayTimeoutRef.current = setTimeout(() => {
        setInternalIsOpen(true);
        onOpenChange?.(true);
      }, delay);
    } else if (defaultOpen && open === undefined) {
      setInternalIsOpen(true);
    }

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, [defaultOpen, delay, onOpenChange, open]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        setInternalIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange],
  );

  const openModal = useCallback(() => {
    // Очищаем предыдущий timeout если есть
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }

    if (delay > 0) {
      delayTimeoutRef.current = setTimeout(() => {
        handleOpenChange(true);
      }, delay);
    } else {
      handleOpenChange(true);
    }
  }, [handleOpenChange, delay]);

  const closeModal = useCallback(() => {
    // Очищаем timeout при закрытии
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Обработка ESC
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, closeModal]);

  // Управление фокусом и прокруткой
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 300);
    } else {
      document.body.style.overflow = "unset";

      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop) {
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    }
  };

  const triggerWithHandler = React.cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      const originalOnClick = trigger.props.onClick as
        | ((e: React.MouseEvent) => void)
        | undefined;
      originalOnClick?.(e);
      openModal();
    },
  });

  if (!mounted) {
    return triggerWithHandler;
  }

  return (
    <>
      {triggerWithHandler}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4",
                overlayClassName,
              )}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              onClick={handleBackdropClick}
            >
              <div className="absolute inset-0 bg-black/50" />

              <motion.div
                ref={modalRef}
                className={cn(
                  "relative w-full rounded-lg bg-[#16161E] shadow-xl outline-none",
                  sizeClasses[size],
                  className,
                )}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
              >
                {(title || showCloseButton) && (
                  <div
                    className={cn(
                      "flex items-center justify-between p-6 pb-4",
                      titleClassName,
                    )}
                  >
                    {title && (
                      <h2
                        id="modal-title"
                        className="text-lg font-semibold text-white"
                      >
                        {title}
                      </h2>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={closeModal}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                        aria-label="Close modal"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                )}

                <div className={cn("p-6", contentClassName)}>{children}</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

// Компоненты для более удобного использования
export const ModalTrigger = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const ModalContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

export const ModalHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("mb-4", className)}>{children}</div>;

export const ModalFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("mt-6 flex justify-end space-x-2", className)}>
    {children}
  </div>
);

interface UseModalOptions {
  defaultOpen?: boolean;
  delay?: number; // Добавляем delay в хук
}

export function useModal(options: UseModalOptions = {}) {
  const { defaultOpen = false, delay = 0 } = options;
  const [isOpen, setIsOpen] = useState(false);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openModal = useCallback(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }

    if (delay > 0) {
      delayTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, delay);
    } else {
      setIsOpen(true);
    }
  }, [delay]);

  const closeModal = useCallback(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, openModal, closeModal]);

  // Применяем defaultOpen с задержкой при монтировании
  useEffect(() => {
    if (defaultOpen) {
      openModal();
    }

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, [defaultOpen, openModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen: (open: boolean) => {
      if (open) {
        openModal();
      } else {
        closeModal();
      }
    },
  };
}
