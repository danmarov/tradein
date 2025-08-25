// shared/ui/input/input.tsx
import React, { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      prefix,
      suffix,
      className,
      inputClassName,
      labelClassName,
      errorClassName,
      wrapperClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const hasPrefix = Boolean(prefix);
    const hasSuffix = Boolean(suffix);

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              "mb-2 block text-sm font-medium text-white",
              disabled && "text-gray-500",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div
          className={cn(
            "relative flex items-center overflow-hidden rounded-md border bg-white/5 transition-colors",
            hasError
              ? "border-red-400 focus-within:border-red-400"
              : "focus-within:border-primary border-white/10",
            disabled && "bg-white/2 cursor-not-allowed opacity-50",
            wrapperClassName,
          )}
        >
          {/* Prefix */}
          {hasPrefix && (
            <div className="flex items-center pl-3 text-gray-400">{prefix}</div>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent px-3 py-2 text-white placeholder-gray-400 outline-none",
              hasPrefix && "pl-1",
              hasSuffix && "pr-1",
              disabled && "cursor-not-allowed",
              inputClassName,
            )}
            {...props}
          />

          {/* Suffix */}
          {hasSuffix && (
            <div className="flex items-center pr-3 text-gray-400">{suffix}</div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <p className={cn("mt-1 text-sm text-red-400", errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
