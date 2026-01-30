import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { LanguageProvider } from "@/components/LanguageContext";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "WealthSprings Accelerator | Own Your Financial Future",
    description: "Exclusive Masterclass on Financial Intelligence and Wealth Creation with Marcus Banjo.",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link rel="icon" href="/favicon.png" />
            </head>
            <body className={`${inter.variable} ${playfair.variable} font-sans bg-champagne text-stone-900 antialiased`}>
                <ConvexClientProvider>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
