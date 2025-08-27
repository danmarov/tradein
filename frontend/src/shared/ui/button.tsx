// shared/ui/Button/Button.tsx
import { cn } from "@sglara/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ReactNode, ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  // базовые стили
  "inline-flex items-center relative justify-center gap-2 rounded-[4px] px-4 py-2.5 text-sm font-bold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/80",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-foreground hover:bg-foreground/5",
        link: "text-primary underline-offset-4 hover:underline p-0",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  icon,
  children,
  className,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <>
          <span className="opacity-0">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </span>
          <Loader2 className="absolute animate-spin" />
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
