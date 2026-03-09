
import React from "react";

export function StepTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in animate-duration-300">
      {children}
    </div>
  );
}
