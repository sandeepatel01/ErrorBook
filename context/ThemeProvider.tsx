"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    // Update the document class and store the mode in localStorage
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", mode);
  }, [mode]);

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
