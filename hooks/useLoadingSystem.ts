import { useState, useRef, useCallback, useEffect } from 'react';

const LOG_ENTRIES = [
  { threshold: 5, text: "系统初始化中..." },
  { threshold: 11, text: "正在探测硬件_" },
  { threshold: 17, text: "系统编号[INS-001]" },
  { threshold: 23, text: "正在扫描环境参数..." },
  { threshold: 29, text: "检测异常气象现象[ATM-247]" },
  { threshold: 35, text: "建立信号连接..." },
  { threshold: 41, text: "正在连接数据终端[DAT-189]" },
  { threshold: 47, text: "数据库启动..." },
  { threshold: 53, text: "加载区域地图文件[MAP-379]" },
  { threshold: 59, text: "正在索引伊甸计划基因序列..." },
  { threshold: 65, text: "计算生存指数[SRV-682]" },
  { threshold: 71, text: "加载莱茵计划大气模型..." },
  { threshold: 77, text: "校准工业系统..." },
  { threshold: 83, text: "正在检验系统完整性..." },
  { threshold: 89, text: "准备接入主系统[SYS-000]" },
  { threshold: 93, text: "WELCOME, MORIME GUARD." },
  { threshold: 97, text: "欢迎回来，守林人。" },
];

const MIN_DISPLAY_TIME = 1800;

export const useLoadingSystem = (startLogging: boolean = true) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<Array<{ id: number; text: string }>>([]);
  const [showSplitLines, setShowSplitLines] = useState(false);

  // Progress tracking refs (no re-render needed)
  const startTimeRef = useRef(Date.now());
  const processedLogTextsRef = useRef(new Set<string>());
  const welcomeMessageCountsRef = useRef<Record<string, number>>({});
  const logQueueRef = useRef<Array<{ id: number; text: string }>>([]);
  const consumerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ===================== Log queue consumer =====================
  const startLogConsumer = useCallback(() => {
    if (consumerIntervalRef.current !== null) return;
    consumerIntervalRef.current = setInterval(() => {
      if (logQueueRef.current.length === 0) {
        clearInterval(consumerIntervalRef.current!);
        consumerIntervalRef.current = null;
        return;
      }
      const line = logQueueRef.current.shift()!;
      setLogLines(prev => [...prev, line]);
    }, 70);
  }, []);

  useEffect(() => {
    return () => {
      if (consumerIntervalRef.current !== null) {
        clearInterval(consumerIntervalRef.current);
      }
    };
  }, []);

  // ===================== Progress simulation =====================
  const generateLogLine = useCallback((prog: number) => {
    const newLines: Array<{ id: number; text: string }> = [];

    for (const log of LOG_ENTRIES) {
      const isWelcome = log.threshold === 93 || log.threshold === 97;
      const count = welcomeMessageCountsRef.current[log.text] || 0;
      const canProcess = isWelcome ? count < 2 : !processedLogTextsRef.current.has(log.text);

      if (prog >= log.threshold && canProcess) {
        if (isWelcome) {
          newLines.push({ id: Date.now() + Math.random(), text: log.text });
          welcomeMessageCountsRef.current[log.text] = count + 1;
        } else {
          processedLogTextsRef.current.add(log.text);
          const numLines = Math.random() < 0.2
            ? Math.floor(Math.random() * 6) + 3
            : Math.floor(Math.random() * 3) + 2;
          let lastPct = 0;
          for (let i = 1; i <= numLines; i++) {
            let pct: number;
            if (i === numLines) {
              pct = 100;
            } else {
              const minPct = lastPct + 5;
              const maxPct = Math.max(minPct + 5, 100 - (numLines - i) * 5);
              pct = Math.min(99, Math.floor(Math.random() * (maxPct - minPct + 1)) + minPct);
            }
            newLines.push({ id: Date.now() + Math.random() * i, text: `${log.text} ${pct}%` });
            lastPct = pct;
          }
        }
      }
    }

    if (newLines.length > 0) {
      logQueueRef.current.push(...newLines);
      startLogConsumer();
    }
  }, [startLogConsumer]);

  useEffect(() => {
    if (!startLogging) return;
    
    startTimeRef.current = Date.now();
    let drainPollId: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + (Math.random() * 3.0 + 0.5), 100);
        generateLogLine(next);
        if (next >= 100) {
          clearInterval(interval);
          const remaining = Math.max(0, MIN_DISPLAY_TIME - (Date.now() - startTimeRef.current));
          const waitForQueueDrain = () => {
            if (logQueueRef.current.length === 0 && consumerIntervalRef.current === null) {
              setShowSplitLines(true);
            } else {
              drainPollId = setTimeout(waitForQueueDrain, 80);
            }
          };
          setTimeout(waitForQueueDrain, remaining);
          return 100;
        }
        return next;
      });
    }, 80);
    return () => {
      clearInterval(interval);
      if (drainPollId !== null) clearTimeout(drainPollId);
    };
  }, [generateLogLine, startLogging]);

  // ===================== Split lines trigger → exit =====================
  useEffect(() => {
    if (!showSplitLines) return;
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reducedMotion ? 100 : 600;
    const id = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(id);
  }, [showSplitLines]);

  return {
    progress,
    logLines,
    showSplitLines,
    loading
  };
};
