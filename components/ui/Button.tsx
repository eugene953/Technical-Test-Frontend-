

import React from "react";
import Loader from "./Loader";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#111827",
    color: "#ffffff",
    border: "1.5px solid transparent",
  },
  secondary: {
    backgroundColor: "#ffffff",
    color: "#374151",
    border: "1.5px solid #d1d5db",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#374151",
    border: "1.5px solid transparent",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: "13px", borderRadius: "8px" },
  md: { padding: "9px 16px", fontSize: "13.5px", borderRadius: "10px" },
  lg: { padding: "13px 20px", fontSize: "14.5px", borderRadius: "10px" },
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = "",
  style,
  children,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.55 : 1,
        transition: "background-color 0.15s, box-shadow 0.15s",
        width: fullWidth ? "100%" : undefined,
        letterSpacing: "0.01em",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      className={className}
      {...rest}
    >
      {isLoading && (
        <span style={{ marginRight: "8px" }}>
          <Loader size="sm" color={variant === "primary" ? "white" : "dark"} />
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
