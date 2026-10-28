import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Rangatantra",description:"Reservations and ticket issuance for your next show."};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>;}