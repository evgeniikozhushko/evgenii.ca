// import { NextUIProvider } from "@nextui-org/system";
// import { useNavigate } from "react-router-dom";

// export function Provider({ children }: { children: React.ReactNode }) {
//   const navigate = useNavigate();

//   return <NextUIProvider navigate={navigate}>{children}</NextUIProvider>;
// }

import React, { createContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: "light", // default theme
  toggleTheme: () => {}, // function to toggle the theme
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  // Apply the theme class to the document element
  useEffect(() => {
    // First, remove both light and dark class from the document
    document.documentElement.classList.remove("light", "dark");
    // Then, apply the current theme class
    document.documentElement.classList.add(theme);
    // Store the current theme in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);
  

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);