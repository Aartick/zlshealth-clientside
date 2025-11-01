"use client"

import { ReactNode, createContext, useContext, useState } from "react";

interface NavbarColorContextType {
    dark: boolean;
    setDark: (v: boolean) => void;
}

const NavbarColorContext = createContext<NavbarColorContextType | undefined>(undefined)

export const NavbarColorProvider = ({ children }: { children: ReactNode }) => {
    const [dark, setDark] = useState(false)
    return (
        <NavbarColorContext.Provider value={{ dark, setDark }}>
            {children}
        </NavbarColorContext.Provider>
    )
}

export const useNavbarColor = () => {
    const ctx = useContext(NavbarColorContext);
    if (!ctx) throw new Error("useNavbarColor must be used within NavbarColorProvider")
    return ctx;
}