"use client";
import { usePathname } from 'next/navigation';
import { isAuthPage } from "@/lib/utils";
import NavBarWrapper from "./NavBarWrapper";

export default function RootLayoutWrapper({ children }) {
    const pathname = usePathname();
    const showNavBar = !isAuthPage(pathname);

    return (
        <>
            {showNavBar && <NavBarWrapper />}
            {children}
        </>
    );
} 