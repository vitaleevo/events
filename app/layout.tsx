import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "Own Your Financial Future | Dono do Seu Futuro Financeiro",
    description: "Exclusive Masterclass on Financial Intelligence and Wealth Creation. Masterclass Exclusiva sobre Inteligência Financeira e Criação de Riqueza.",
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
            </head>
            <body className={`${inter.variable} ${playfair.variable} font-sans bg-champagne text-stone-900 antialiased`}>
                <ConvexClientProvider>
                    {children}
                </ConvexClientProvider>
            </body>
        </html>
    );
}
