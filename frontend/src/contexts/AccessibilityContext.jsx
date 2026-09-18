import { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [textSize, setTextSize] = useState(() => localStorage.getItem("skh_text_size") || "normal");

  useEffect(() => {
    localStorage.setItem("skh_text_size", textSize);
    if (textSize === "large") {
      document.documentElement.classList.add("text-size-large");
    } else {
      document.documentElement.classList.remove("text-size-large");
    }
  }, [textSize]);

  return (
    <AccessibilityContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);
