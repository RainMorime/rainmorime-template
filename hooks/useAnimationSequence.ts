import { useState, useEffect, useCallback } from 'react';
import type { AnimationSequenceState, ColumnPhase } from '../types';

export default function useAnimationSequence(): AnimationSequenceState {
  const [isLoading, setIsLoading] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [linesAnimated, setLinesAnimated] = useState(false);
  const [hudVisible, setHudVisible] = useState(false);
  const [leftPanelAnimated, setLeftPanelAnimated] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [leversVisible, setLeversVisible] = useState(false);
  const [columnPhase, setColumnPhase] = useState<ColumnPhase>('idle');

  // Vertical line pulse animation states
  const [pulsingNormalIndices, setPulsingNormalIndices] = useState(null);
  const [pulsingReverseIndices, setPulsingReverseIndices] = useState(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setMainVisible(true);

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
      setTimeout(() => { setLeftPanelAnimated(true); }, 100);
      setTimeout(() => { setLeversVisible(true); }, 300);
      setTimeout(() => { setLinesAnimated(true); }, 200);
      setTimeout(() => { setHudVisible(true); }, 400);
      setTimeout(() => { setTextVisible(true); }, 500);
      setTimeout(() => { setAnimationsComplete(true); }, 1200);
    } else {
      setTimeout(() => {
        setLeftPanelAnimated(true);
        setTimeout(() => { setLeversVisible(true); }, 800);
      }, 200);
      setTimeout(() => { setLinesAnimated(true); }, 1000);
      setTimeout(() => { setHudVisible(true); }, 2200);
      setTimeout(() => { setTextVisible(true); }, 2500);
      setTimeout(() => { setAnimationsComplete(true); }, 4200);
    }
  };

  // Vertical line pulse animation
  useEffect(() => {
    let pulseIntervalId = null;
    let pulseTimeoutIds = [];

    if (animationsComplete) {
      const staggerDelay = 200;
      const animationDuration = 2000;

      pulseIntervalId = setInterval(() => {
        pulseTimeoutIds.forEach(clearTimeout);
        pulseTimeoutIds = [];
        setPulsingNormalIndices(null);
        setPulsingReverseIndices(null);

        const indices = [];
        while (indices.length < 3) {
          const randomIndex = Math.floor(Math.random() * 6);
          if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
          }
        }

        const timeoutId1 = setTimeout(() => {
          setPulsingNormalIndices([indices[0]]);
          setPulsingReverseIndices(null);
        }, 0);
        pulseTimeoutIds.push(timeoutId1);

        const timeoutId2 = setTimeout(() => {
          setPulsingNormalIndices(prev => (prev ? [...prev, indices[1]] : [indices[1]]));
        }, staggerDelay);
        pulseTimeoutIds.push(timeoutId2);

        const timeoutId3 = setTimeout(() => {
          setPulsingReverseIndices([indices[2]]);
        }, staggerDelay * 2);
        pulseTimeoutIds.push(timeoutId3);

        const resetTimeoutId = setTimeout(() => {
          setPulsingNormalIndices(null);
          setPulsingReverseIndices(null);
          pulseTimeoutIds = [];
        }, staggerDelay * 2 + animationDuration);
        pulseTimeoutIds.push(resetTimeoutId);

      }, 2000 + staggerDelay * 2);
    }

    return () => {
      if (pulseIntervalId) clearInterval(pulseIntervalId);
      pulseTimeoutIds.forEach(clearTimeout);
    };
  }, [animationsComplete]);

  const retractColumns = useCallback((onComplete: () => void) => {
    setAnimationsComplete(false);
    setPulsingNormalIndices(null);
    setPulsingReverseIndices(null);
    setColumnPhase('retracting');

    setTimeout(() => {
      setLinesAnimated(false);
      setColumnPhase('idle');
      onComplete();
    }, 450);
  }, []);

  const expandColumns = useCallback((onComplete?: () => void) => {
    setColumnPhase('expanding');

    setTimeout(() => setLinesAnimated(true), 30);
    setTimeout(() => setHudVisible(true), 250);
    setTimeout(() => setTextVisible(true), 300);
    setTimeout(() => {
      setAnimationsComplete(true);
      setColumnPhase('idle');
      onComplete?.();
    }, 800);
  }, []);

  return {
    isLoading,
    mainVisible,
    linesAnimated,
    hudVisible,
    leftPanelAnimated,
    textVisible,
    animationsComplete,
    leversVisible,
    pulsingNormalIndices,
    pulsingReverseIndices,
    handleLoadingComplete,
    columnPhase,
    retractColumns,
    expandColumns,
  };
}
