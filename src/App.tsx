/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_SLIDES } from './data/presentationData';
import { SlideData, OutfitTheme, StageEnvironment } from './types';
import { ThreeStageCanvas } from './components/ThreeStageCanvas';
import { NavigationControls } from './components/NavigationControls';
import { SlidePresenterNotes } from './components/SlidePresenterNotes';
import { SlideCustomizerModal } from './components/SlideCustomizerModal';

// Slides
import { IntroHostsSlide } from './components/slides/IntroHostsSlide';
import { SpeechesSlide } from './components/slides/SpeechesSlide';
import { AdminComplianceSlide } from './components/slides/AdminComplianceSlide';
import { PreservationSlide } from './components/slides/PreservationSlide';
import { CommercialSlide } from './components/slides/CommercialSlide';
import { ResearchDevelopmentSlide } from './components/slides/ResearchDevelopmentSlide';
import { HRAdminSlide } from './components/slides/HRAdminSlide';
import { ITSystemsSlide } from './components/slides/ITSystemsSlide';
import { HostFloorFinaleSlide } from './components/slides/HostFloorFinaleSlide';

import { soundFx } from './utils/soundEffects';

export default function App() {
  const [slides, setSlides] = useState<SlideData[]>(INITIAL_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [globalOutfit, setGlobalOutfit] = useState<OutfitTheme>('formal');
  const [currentEnv, setCurrentEnv] = useState<StageEnvironment>('oasis');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');

  // UI state
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      soundFx.playSlideTransition();
    }
  }, [currentSlideIndex, slides.length]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      soundFx.playSlideTransition();
    }
  }, [currentSlideIndex]);

  const selectSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
      soundFx.playSlideTransition();
    }
  }, [slides.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if inside an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goToPrevSlide();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setIsNotesOpen((prev) => !prev);
          break;
        case 's':
        case 'S':
        case 'o':
        case 'O':
          e.preventDefault();
          setIsCustomizerOpen((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  // Transition variants based on transitionEffect
  const getTransitionVariants = (effect: string) => {
    switch (effect) {
      case 'cube-flip':
        return {
          initial: { opacity: 0, rotateY: 45, scale: 0.9 },
          animate: { opacity: 1, rotateY: 0, scale: 1 },
          exit: { opacity: 0, rotateY: -45, scale: 0.9 },
        };
      case 'spotlight-zoom':
        return {
          initial: { opacity: 0, scale: 1.15, filter: 'blur(8px)' },
          animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
        };
      case 'stage-pan':
        return {
          initial: { opacity: 0, x: 80, scale: 0.96 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -80, scale: 0.96 },
        };
      case 'holo-dissolve':
        return {
          initial: { opacity: 0, scale: 0.98, filter: 'brightness(1.5) blur(6px)' },
          animate: { opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)' },
          exit: { opacity: 0, scale: 1.02, filter: 'brightness(0.5) blur(6px)' },
        };
      case 'warp-portal':
      default:
        return {
          initial: { opacity: 0, scale: 0.85, y: 30 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 1.1, y: -30 },
        };
    }
  };

  const variants = getTransitionVariants(currentSlide.transitionEffect);

  return (
    <div className="relative min-h-screen w-full bg-[#050A18] text-slate-100 flex flex-col justify-between overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Geometric Ambient Radial Blue Glows */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #3b82f6 0%, transparent 65%), radial-gradient(circle at 80% 80%, #6366f1 0%, transparent 50%)'
        }}
      />

      {/* 3D Animated Three.js Stage Background Canvas */}
      <ThreeStageCanvas environment={currentEnv} />

      {/* Top Bar Header & Controls */}
      <NavigationControls
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onSelectSlide={selectSlide}
        onPrev={goToPrevSlide}
        onNext={goToNextSlide}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        globalOutfit={globalOutfit}
        customLogoUrl={customLogoUrl}
      />

      {/* MAIN PRESENTATION STAGE AREA */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-8 py-6 pb-28 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            {/* Dynamic Slide Dispatcher according to slide ID */}
            {currentSlide.id === 'intro' && (
              <IntroHostsSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'executive_speeches' && (
              <SpeechesSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'admin_compliance' && (
              <AdminComplianceSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'preservation' && (
              <PreservationSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'commercial' && (
              <CommercialSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'rd' && (
              <ResearchDevelopmentSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'hr_admin' && (
              <HRAdminSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'it_systems' && (
              <ITSystemsSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}

            {currentSlide.id === 'finale' && (
              <HostFloorFinaleSlide
                slide={currentSlide}
                globalOutfit={globalOutfit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Speaker Notes & Teleprompter Drawer */}
      <SlidePresenterNotes
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        currentSlide={currentSlide}
        slideIndex={currentSlideIndex}
        totalSlides={slides.length}
      />

      {/* Slide Customizer & Theme Studio Modal */}
      <SlideCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        slides={slides}
        onUpdateSlides={setSlides}
        globalOutfit={globalOutfit}
        onUpdateGlobalOutfit={setGlobalOutfit}
        currentEnv={currentEnv}
        onUpdateEnv={setCurrentEnv}
        customLogoUrl={customLogoUrl}
        onUpdateLogoUrl={setCustomLogoUrl}
      />
    </div>
  );
}
