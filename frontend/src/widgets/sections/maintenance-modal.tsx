"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MaintenanceModalProps {
  className?: string;
}

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
};

export function MaintenanceModal({ className }: MaintenanceModalProps) {
  const [mounted, setMounted] = useState(false);
  const isOpen = true; // Всегда открыта

  // Проверяем, что компонент смонтирован (для SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Блокируем прокрутку body
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Cleanup при размонтировании
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Не рендерим портал на сервере
  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Content - только модалка кликабельная */}
          <motion.div
            className={cn(
              "pointer-events-auto relative w-full max-w-md rounded-lg border border-gray-700/50 bg-[#16161E] shadow-xl outline-none",
              className,
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            transition={{
              type: "tween",
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="maintenance-title"
          >
            {/* Header */}
            <div className="flex items-center justify-center p-6 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                  <Settings
                    className="h-5 w-5 animate-spin text-orange-400"
                    style={{
                      animation: "spin 2s linear infinite",
                    }}
                  />
                </div>
                <h2
                  id="maintenance-title"
                  className="text-lg font-semibold text-white"
                >
                  Under Maintenance
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <div className="text-center">
                <p className="mb-4 text-gray-300">
                  This page is currently under maintenance. We&apos;ll be back
                  shortly.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Expected time: soon</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
