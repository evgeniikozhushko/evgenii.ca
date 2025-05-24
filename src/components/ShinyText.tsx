// src/components/ShinyText.tsx
import React from "react";
import "@/styles/ShinyText.css";   // we’ll create this next

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;         // seconds for one shine cycle
  className?: string;     // any extra Tailwind or custom classes
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: ShinyTextProps) {
  // set the CSS animation-duration dynamically
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text ${disabled ? "disabled" : ""} ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </div>
  );
}
