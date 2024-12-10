"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Set initial theme based on user's preference or default to "light"
  const [mode, setMode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const handleThemeChange = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode("dark");
      document.documentElement.classList.add("dark");
    } else {
      setMode("light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  console.log("Mode: ", mode);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

// "use cleint";

// import { createContext, useContext, useEffect, useState } from "react";

// interface ThemeContextType {
//   mode: string;
//   setMode: (mode: string) => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [mode, setMode] = useState();

//   const handleThemeChange = () => {
//     if (mode === "dark") {
//       setMode("light");
//       document.documentElement.classList.add("light");
//     } else {
//       setMode("dark");
//       document.documentElement.classList.add("dark");
//     }
//   };

//   useEffect(() => {
//     handleThemeChange();
//   }, [mode]);

//   return (
//     <ThemeContext.Provider value={{ mode, setMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);

//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }

//   return context;
// }
