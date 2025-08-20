"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  trigger: React.ReactElement<any>;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  open?: boolean; // Контролируемое состояние
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
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
  open,
}: ModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Используем контролируемое состояние если передан open, иначе внутреннее
  const isOpen = open !== undefined ? open : internalIsOpen;

  // Проверяем, что компонент смонтирован (для SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        setInternalIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange],
  );

  const openModal = () => handleOpenChange(true);
  const closeModal = useCallback(
    () => handleOpenChange(false),
    [handleOpenChange],
  );

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
      // Сохраняем текущий активный элемент
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Блокируем прокрутку body
      document.body.style.overflow = "hidden";

      // Фокус на модалку
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 300); // Длительность анимации
    } else {
      // Восстанавливаем прокрутку
      document.body.style.overflow = "unset";

      // Возвращаем фокус на предыдущий элемент
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    // Cleanup при размонтировании
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Обработка клика по backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop) {
      closeModal();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Trap focus внутри модалки
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

  // Клонируем trigger и добавляем обработчик клика
  const triggerWithHandler = React.cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      // Вызываем оригинальный onClick если есть
      const originalOnClick = trigger.props.onClick as
        | ((e: React.MouseEvent) => void)
        | undefined;
      originalOnClick?.(e);
      openModal();
    },
  });

  // Не рендерим портал на сервере
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
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Modal Content */}
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
                  type: "tween", // Вместо spring
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1], // easeOut
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 pb-4">
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

                {/* Content */}
                <div className={cn("p-6", title && "pt-0", contentClassName)}>
                  {children}
                </div>
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

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen,
  };
}
