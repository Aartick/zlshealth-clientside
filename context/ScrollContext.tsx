"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface ScrollContextType {
    isScrolling: boolean;
    setIsScrolling: (value: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
    const [isScrolling, setIsScrolling] = useState(false);
    return (
        <ScrollContext.Provider value={{ isScrolling, setIsScrolling }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) throw new Error("useScroll must be used within ScrollProvider");
    return context;
};
