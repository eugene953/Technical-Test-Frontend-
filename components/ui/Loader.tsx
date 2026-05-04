
import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "dark" | "blue";
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const colorMap = {
  white: "border-white border-t-transparent",
  dark: "border-gray-800 border-t-transparent",
  blue: "border-blue-600 border-t-transparent",
};

const Loader: React.FC<LoaderProps> = ({ size = "md", color = "blue" }) => {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        "inline-block rounded-full border-2 animate-spin",
        sizeMap[size],
        colorMap[color],
      ].join(" ")}
    />
  );
};

export default Loader;
