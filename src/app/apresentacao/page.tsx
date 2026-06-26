"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Slide1Capa from './components/Slide1Capa';
import Slide2Problema from './components/Slide2Problema';
import Slide3Solucao from './components/Slide3Solucao';
import Slide4Fluxo from './components/Slide4Fluxo';
import Slide5Perfis from './components/Slide5Perfis';
import Slide6Arquitetura from './components/Slide6Arquitetura';
import Slide7Tech from './components/Slide7Tech';
import Slide8Diferenciais from './components/Slide8Diferenciais';
import Slide9Resultados from './components/Slide9Resultados';
import Slide10Fim from './components/Slide10Fim';
import SlideExtraBanco from "./components/SlideExtraBanco";

 
const GridBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

export default function ApresentacaoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [showBackup, setShowBackup] = useState(false);

  const slides = [
    <Slide1Capa key="1" />,
    <Slide2Problema key="2" />,
    <Slide3Solucao key="3" />,
    <Slide4Fluxo key="4" />,
    <Slide5Perfis key="5" />,
    <Slide6Arquitetura key="6" />,
    <Slide7Tech key="7" />,
    <Slide8Diferenciais key="8" />,
    <Slide9Resultados key="9" />,
    <Slide10Fim key="10" />
  ];

  const handleNext = useCallback(() => {
    if (showBackup) return;
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  }, [slides.length, showBackup]);

  const handlePrev = useCallback(() => {
    if (showBackup) return;
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  }, [showBackup]);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowUp") {
        setShowBackup(true);
      } else if (e.key === "ArrowDown" || e.key === "Escape") {
        setShowBackup(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    setIsMounted(true);
    
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-50 overflow-hidden flex flex-col font-sans selection:bg-emerald-500/30 z-[100]">
      <GridBackground />

      {}
      {!showBackup && (
        <div className="h-1.5 bg-zinc-900 w-full fixed top-0 z-50">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgb(16,185,129)]"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      )}

      {}
      <div className="flex-grow relative z-10 flex items-center justify-center">
        {showBackup ? (
          <SlideExtraBanco onBack={() => setShowBackup(false)} />
        ) : (
          slides[currentSlide]
        )}
      </div>

      {}
      {!showBackup && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-6 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-50">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-3 rounded-full flex items-center gap-4 shadow-2xl">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-white w-10 h-10" onClick={handlePrev} disabled={currentSlide === 0}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <span className="text-base font-mono font-medium tracking-widest text-zinc-400 w-20 text-center">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-white w-10 h-10" onClick={handleNext} disabled={currentSlide === slides.length - 1}>
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
