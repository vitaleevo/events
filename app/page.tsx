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
            color: 'bg-[#C5A059]' // Gold color
        }
    ];

    return (
        <div className="min-h-screen bg-[#1eac96] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Main Background Image - Financial Chart */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/financial-chart-bg.jpg"
                    alt="Financial Background"
                    fill
                    className="object-cover opacity-30 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-[#1eac96]/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-10 pointer-events-none"></div>

            {/* Floating Stacked Coins Background Elements */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{
                    opacity: 0.6,
                    x: 0,
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-10 -left-10 w-[200px] md:w-[350px] h-[200px] md:h-[350px] pointer-events-none z-0"
            >
                <Image
                    src="/gold-coins-stack.png"
                    alt="Stacked Coins"
                    fill
                    className="object-contain drop-shadow-2xl"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{
                    opacity: 0.5,
                    x: 0,
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-10 -right-10 w-[250px] md:w-[450px] h-[250px] md:h-[450px] pointer-events-none z-0"
            >
                <Image
                    src="/gold-coins-stack.png"
                    alt="Stacked Coins"
                    fill
                    className="object-contain drop-shadow-2xl rotate-12"
                />
            </motion.div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-sm md:max-w-md z-10 text-center bg-white/10 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl"
            >
                {/* Brand Logo - New White Background Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative w-56 h-14 mx-auto mb-8 bg-white/90 p-2 rounded-xl shadow-lg"
                >
                    <Image
                        src="/wealthsprings-logo-white.png"
                        alt="WealthSprings Accelerator"
                        fill
                        className="object-contain p-2"
                    />
                </motion.div>

                {/* Profile Section */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="relative w-28 md:w-36 h-28 md:h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.5)]"
                >
                    <Image
                        src="/marcus-banjo-updated.png"
                        alt="Marcus Banjo"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-3xl font-serif italic text-white mb-2 tracking-tight drop-shadow-md"
                >
                    Marcus Banjo
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/90 uppercase tracking-[0.3em] text-[8px] md:text-[10px] font-bold mb-8"
                >
                    Wealth & Financial Expert
                </motion.p>

                {/* Info Card / Bio snippet */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-black/10 backdrop-blur-sm border border-white/10 p-5 md:p-6 rounded-2xl mb-8 relative group"
                >
                    <p className="text-white text-sm md:text-base leading-relaxed italic relative z-10 font-light">
                        "Empowering individuals to master their finances and build lasting wealth."
                    </p>
                </motion.div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 md:gap-4">
                    {socialLinks.map((link, idx) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + (idx * 0.1) }}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 md:gap-5 p-4 md:p-4 rounded-2xl text-white font-bold tracking-wider transition-all shadow-lg border border-white/20 ${link.color}`}
                        >
                            <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white/20 rounded-xl">
                                <i className={`fa-brands ${link.icon} text-xl`}></i>
                            </div>
                            <span className="flex-1 text-left text-xs md:text-sm uppercase tracking-widest">{link.name}</span>
                            <i className="fa-solid fa-chevron-right opacity-40 text-[10px]"></i>
                        </motion.a>
                    ))}

                    <motion.a
                        href="/assets"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 md:gap-5 p-4 md:p-4 rounded-2xl bg-white text-[#1eac96] font-bold tracking-wider transition-all shadow-xl group"
                    >
                        <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-[#1eac96]/10 rounded-xl group-hover:bg-[#1eac96] transition-colors">
                            <i className="fa-solid fa-image text-xl group-hover:text-white transition-colors"></i>
                        </div>
                        <span className="flex-1 text-left text-xs md:text-sm uppercase tracking-widest">Event Assets (Flyers)</span>
                        <i className="fa-solid fa-chevron-right opacity-40 text-[10px]"></i>
                    </motion.a>
                </div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="mt-10 md:mt-12 text-white/50 text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-medium"
                >
                    © 2026 Marcus Banjo • WealthSprings
                </motion.footer>
            </motion.div>
        </div>
    );
};

export default GatewayPage;
