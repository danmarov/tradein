"use client";

import { cn } from "@sglara/cn";
import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

export function Avatar({ src, name, className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Если есть src и нет ошибки - показываем картинку
  if (src && !hasError) {
    return (
      <div
        className={cn(
          "relative inline-block size-6 overflow-hidden rounded-full",
          className,
        )}
      >
        <Image
          src={src}
          alt={name || "Avatar"}
          fill
          className="object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Если есть имя - показываем первую букву
  if (name && name.trim()) {
    const firstLetter = name.trim().charAt(0);
    return (
      <span
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-full bg-amber-50 text-xs font-medium capitalize text-amber-700",
          className,
        )}
      >
        {firstLetter}
      </span>
    );
  }

  // Fallback - пустой кружок
  return (
    <span
      className={cn("inline-block size-6 rounded-full bg-amber-50", className)}
    />
  );
}
