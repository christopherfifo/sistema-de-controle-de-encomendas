"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Slide0Abertura from "./components/Slide0Abertura";
import Slide1Problema from "./components/Slide1Problema";
import Slide2Solucao from "./components/Slide2Solucao";
import Slide3Arquitetura from "./components/Slide3Arquitetura";
import Slide4Tech from "./components/Slide4Tech";
import Slide5Fim from "./components/Slide5Fim";

// Fundo customizado com grid
const GridBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

export default function ApresentacaoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const slides = [
    <Slide0Abertura key="capa" />,
    <Slide1Problema key="problema" />,
    <Slide2Solucao key="solucao" />,
    <Slide3Arquitetura key="arquitetura" />,
    <Slide4Tech key="tech" />,
    <Slide5Fim key="end" />
  ];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  }, []);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    setIsMounted(true);
    // Força a tag html para dark mode enquanto estiver nessa página
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-50 overflow-hidden flex flex-col font-sans selection:bg-emerald-500/30 z-[100]">
      <GridBackground />

      {/* Barra de Progresso Superior */}
      <div className="h-1.5 bg-zinc-900 w-full fixed top-0 z-50">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgb(16,185,129)]"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Conteúdo do Slide */}
      <div className="flex-grow relative z-10 flex items-center justify-center">
        {slides[currentSlide]}
      </div>

      {/* Controles Inferiores */}
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
    </div>
  );
}
