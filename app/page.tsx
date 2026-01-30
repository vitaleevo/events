"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const GatewayPage = () => {
    const socialLinks = [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/mbanjo',
            icon: 'fa-facebook-f',
            color: 'bg-[#1877F2]'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/realmarcusbanjo/',
            icon: 'fa-instagram',
            color: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]'
        },
        {
            name: 'Masterclass Event',
            url: '/masterclass',
            icon: 'fa-calendar-check',
            color: 'bg-gold'
        }
    ];

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-stone-950 to-stone-950 opacity-40"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20 pointer-events-none"></div>

            {/* Floating Coins Background Elements (Hidden on small mobile for performance/clutter) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 0.4,
                    scale: 1,
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-10 md:-top-20 -left-10 md:-left-20 w-[250px] md:w-[400px] h-[250px] md:h-[400px] pointer-events-none blur-sm"
            >
                <Image
                    src="/bitcoin-coins.png"
                    alt="Floating Coins"
                    fill
                    className="object-contain"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 0.3,
                    scale: 1.2,
                    y: [0, 30, 0],
                    rotate: [0, -10, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-20 md:-bottom-40 -right-10 md:-right-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] pointer-events-none blur-md"
            >
                <Image
                    src="/bitcoin-coins.png"
                    alt="Floating Coins"
                    fill
                    className="object-contain"
                />
            </motion.div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-sm md:max-w-md z-10 text-center"
            >
                {/* Profile Section */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="relative w-28 md:w-36 h-28 md:h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gold shadow-[0_0_30px_rgba(197,160,89,0.5)]"
                >
                    <Image
                        src="/marcus-banjo-updated.png"
                        alt="Marcus Banjo"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative w-48 h-12 mx-auto mb-4"
                >
                    <Image
                        src="/wealthsprings-logo.png"
                        alt="WealthSprings Accelerator"
                        fill
                        className="object-contain"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-4xl font-serif italic text-white mb-2 tracking-tight"
                >
                    Marcus Banjo
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gold uppercase tracking-[0.3em] text-[8px] md:text-[10px] font-bold mb-6 md:mb-8"
                >
                    Wealth & Financial Expert
                </motion.p>

                {/* Info Card / Bio snippet */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[2rem] mb-6 md:mb-8 mx-2 md:mx-0 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <p className="text-stone-300 text-sm md:text-base leading-relaxed italic relative z-10">
                        "Empowering individuals to master their finances and build lasting wealth."
                    </p>
                </motion.div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 md:gap-4 px-2 md:px-0">
                    {socialLinks.map((link, idx) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + (idx * 0.1) }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-xl md:rounded-2xl text-white font-bold tracking-wider transition-all shadow-xl border border-white/5 ${link.color}`}
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/15 rounded-lg md:rounded-xl backdrop-blur-md">
                                <i className={`fa-brands ${link.icon} text-xl md:text-2xl`}></i>
                            </div>
                            <span className="flex-1 text-left text-xs md:text-sm uppercase tracking-widest">{link.name}</span>
                            <i className="fa-solid fa-chevron-right opacity-30 text-[10px]"></i>
                        </motion.a>
                    ))}

                    <motion.a
                        href="/assets"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-xl md:rounded-2xl bg-white text-stone-900 font-bold tracking-wider transition-all shadow-xl group border border-transparent"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-stone-100 rounded-lg md:rounded-xl group-hover:bg-gold transition-colors">
                            <i className="fa-solid fa-image text-xl md:text-2xl group-hover:text-white transition-colors"></i>
                        </div>
                        <span className="flex-1 text-left text-xs md:text-sm uppercase tracking-widest">Event Assets (Flyers)</span>
                        <i className="fa-solid fa-chevron-right opacity-30 text-[10px] text-stone-950 font-bold"></i>
                    </motion.a>
                </div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="mt-10 md:mt-16 text-stone-500 text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-medium"
                >
                    © 2026 Marcus Banjo • WealthSprings Accelerator
                </motion.footer>
            </motion.div>
        </div>
    );
};

export default GatewayPage;
