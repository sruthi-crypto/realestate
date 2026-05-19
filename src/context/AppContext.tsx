import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/types";
import { defaultProducts, defaultAboutContent } from "@/data/products";

interface AppState {
  products: Product[];
  aboutContent: string;
  isAdmin: boolean;
  selectedArea: string | null;
  selectedCategory: string | null;
  setProducts: (p: Product[]) => void;
  setAboutContent: (c: string) => void;
  setIsAdmin: (v: boolean) => void;
  setSelectedArea: (a: string | null) => void;
  setSelectedCategory: (c: string | null) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProductsState] = useState<Product[]>(() => {
    const stored = localStorage.getItem("re_products");
    return stored ? JSON.parse(stored) : defaultProducts;
  });

  const [aboutContent, setAboutContentState] = useState(() => {
    return localStorage.getItem("re_about") || defaultAboutContent;
  });

  const [isAdmin, setIsAdminState] = useState(() => {
    return localStorage.getItem("re_admin") === "true";
  });

  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const setProducts = (p: Product[]) => {
    setProductsState(p);
    localStorage.setItem("re_products", JSON.stringify(p));
  };

  const setAboutContent = (c: string) => {
    setAboutContentState(c);
    localStorage.setItem("re_about", c);
  };

  const setIsAdmin = (v: boolean) => {
    setIsAdminState(v);
    localStorage.setItem("re_admin", String(v));
  };

  return (
    <AppContext.Provider
      value={{
        products, aboutContent, isAdmin, selectedArea, selectedCategory,
        setProducts, setAboutContent, setIsAdmin, setSelectedArea, setSelectedCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
