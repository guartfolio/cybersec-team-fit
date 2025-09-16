import * as React from "react"

type Variant = "default" | "secondary" | "ghost"

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition";
    const styles: Record<Variant, string> = {
      default: "bg-black text-white hover:opacity-90",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "bg-transparent text-slate-800 hover:bg-slate-100"
    };
    return <button ref={ref} className={`${base} ${styles[variant]} ${className}`} {...props} />;
  }
);
Button.displayName = "Button";
