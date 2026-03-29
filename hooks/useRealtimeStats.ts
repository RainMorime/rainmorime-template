import { useState, useEffect, useRef } from 'react';
import type { RealtimeStatsState } from '../types';

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function formatRuntime(uptimeMs: number): string {
  const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
  return (
    `${String(days).padStart(3, '0')}:` +
    `${String(hours).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}`
  );
}

export default function useRealtimeStats(): RealtimeStatsState {
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [runtime, setRuntime] = useState('000:00:00:00');
  const [totalVisits, setTotalVisits] = useState<number | string>(0);
  const [currentVisitors, setCurrentVisitors] = useState(0);

  const runtimeOriginRef = useRef<{ server: number; local: number } | null>(null);

  // SSE connection + runtime stats
  useEffect(() => {
    let runtimeInterval: ReturnType<typeof setInterval> | undefined;
    let es: EventSource | undefined;

    const startRuntimeTick = () => {
      if (runtimeInterval || !runtimeOriginRef.current) return;
      runtimeInterval = setInterval(() => {
        const { server, local } = runtimeOriginRef.current!;
        setRuntime(formatRuntime(server + (Date.now() - local)));
      }, 1000);
    };

    const stopRuntimeTick = () => {
      if (runtimeInterval) {
        clearInterval(runtimeInterval);
        runtimeInterval = undefined;
      }
    };

    async function init() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setTotalVisits(data.visits);
        runtimeOriginRef.current = { server: data.runtime, local: Date.now() };
        if (!document.hidden) startRuntimeTick();
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setTotalVisits('N/A');
        setRuntime('N/A');
      }

      es = new EventSource('/api/sse/stats');
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.onlineCount === 'number') {
            setCurrentVisitors(data.onlineCount);
          }
        } catch {
          // ignore malformed messages
        }
      };
      es.onerror = () => {
        console.warn('SSE connection error, will auto-reconnect.');
      };
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stopRuntimeTick();
      } else {
        if (runtimeOriginRef.current) {
          setRuntime(formatRuntime(
            runtimeOriginRef.current.server + (Date.now() - runtimeOriginRef.current.local)
          ));
        }
        startRuntimeTick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    init();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopRuntimeTick();
      if (es) es.close();
    };
  }, []);

  // Clock update
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const startClock = () => {
      if (intervalId) return;
      setCurrentTime(formatTime(new Date()));
      intervalId = setInterval(() => {
        setCurrentTime(formatTime(new Date()));
      }, 1000);
    };

    const stopClock = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stopClock();
      else startClock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    startClock();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopClock();
    };
  }, []);

  return { currentTime, runtime, totalVisits, currentVisitors };
}
