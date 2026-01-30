"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const AssetsPage = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const assets = [
        {
            title: "Main Event Flyer",
            date: "2026-02-14",
            image: "/masterclass-flyer.png",
            type: "Flyer"
        },
    ];

    return (
        <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-gold selection:text-white pb-20 overflow-x-hidden">
            {/* Background Grain/Noise for texture */}
            <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

            {/* Navigation Overlay */}
            <nav className="fixed top-0 left-0 right-0 z-50 py-4 md:py-8 bg-stone-950/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <i className="fa-solid fa-arrow-left text-xs opacity-50 text-white"></i>
                        <div className="relative w-32 md:w-48 h-10">
                            <Image
                                src="/wealthsprings-logo.png"
                                alt="WealthSprings Accelerator"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                    <div className="hidden sm:block text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold">
                        Resources
                    </div>
                </div>
            </nav>

            {/* Header Section */}
            <section className="relative pt-32 md:pt-48 pb-12 md:pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase block mb-6 px-4"
                    >
                        Media Kit • Mobile Optimized
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-6xl font-medium serif italic leading-tight mb-6 md:mb-8"
                    >
                        Event Assets & <span className="text-gold">Resources</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-400 max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed px-4"
                    >
                        Official promotional materials for Marcus Banjo's upcoming financial masterclasses. Tap to preview and download.
                    </motion.p>
                </div>
            </section>

            {/* Assets Grid */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {assets.map((asset, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx + 0.3 }}
                            className="group relative"
                        >
                            <div
                                onClick={() => setSelectedImage(asset.image)}
                                className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-stone-900 mb-4 cursor-zoom-in active:scale-95 transition-transform duration-300"
                            >
                                <Image
                                    src={asset.image}
                                    alt={asset.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-80 transition-opacity"></div>

                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                    <div className="flex-1 pr-4">
                                        <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1 block">{asset.type}</span>
                                        <h3 className="text-lg font-serif italic text-white group-hover:text-gold transition-colors">{asset.title}</h3>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20">
                                        <i className="fa-solid fa-expand text-sm opacity-70"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-stone-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] pl-4">
                                <span>{new Date(asset.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span className="w-1 h-1 bg-stone-700 rounded-full"></span>
                                <span>High Resolution</span>
                            </div>
                        </motion.div>
                    ))}

                    {/* Placeholder for future uploads */}
                    <div className="relative aspect-[3/4] w-full rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-12 text-center group hover:border-gold/20 transition-all opacity-50 hidden sm:flex">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-stone-600 group-hover:text-gold transition-colors">
                            <i className="fa-solid fa-plus text-xl md:text-2xl"></i>
                        </div>
                        <p className="text-stone-500 text-xs font-light">More Coming Soon</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-24 md:mt-40 text-center border-t border-white/5 pt-12 md:pt-20 px-6">
                <p className="text-stone-600 text-[9px] md:text-[10px] uppercase tracking-[0.4em] leading-relaxed">
                    © 2026 Marcus Banjo • WealthSprings Accelerator
                </p>
            </footer>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-4 md:p-10 flex flex-col items-center justify-center"
                    >
                        {/* Close & Download header for mobile */}
                        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 md:p-8">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-gold transition-colors active:scale-95"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>

                            <a
                                href={selectedImage}
                                download
                                className="px-6 py-3 bg-gold text-stone-900 rounded-full font-bold tracking-widest text-[10px] uppercase hover:bg-white transition-all shadow-xl shadow-gold/20 flex items-center gap-2 active:scale-95"
                            >
                                <i className="fa-solid fa-download"></i>
                                Download
                            </a>
                        </div>

                        {/* Image Container */}
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <Image
                                src={selectedImage}
                                alt="Flyer Preview"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        <p className="mt-8 text-stone-500 text-[10px] uppercase tracking-[0.4em] hidden md:block">
                            Tap anywhere outside to close
                        </p>

                        {/* Background Click to Close */}
                        <div
                            className="absolute inset-0 -z-10"
                            onClick={() => setSelectedImage(null)}
                        ></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssetsPage;
