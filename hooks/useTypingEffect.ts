import { useState, useEffect, useRef } from 'react';
import type { FateTypingState, EnvParamsTypingState, EnvData } from '../types';

/**
 * Fate text typing effect — alternates between English and Chinese text
 */
export function useFateTypingEffect(textVisible: boolean): FateTypingState {
  const [displayedFateText, setDisplayedFateText] = useState('');
  const [isFateTypingActive, setIsFateTypingActive] = useState(false);

  useEffect(() => {
    if (textVisible) {
      const englishText = "Our Destinies Entwine At This Moment";
      const chineseText = "你我命运于此刻纠缠不休，守林人。";
      const typingDelay = 80;
      const deleteDelay = 50;
      const chineseTypingDelay = 150;
      const chineseDeleteDelay = 100;
      const pauseAfterType = 1500;
      const pauseAfterDelete = 500;

      let timeouts = [];
      setIsFateTypingActive(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedFateText(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedFateText(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const sequence = () => {
        typeString(englishText, 0, typingDelay, () => {
          const timeoutId1 = setTimeout(() => {
            deleteString(englishText, deleteDelay, () => {
              const timeoutId2 = setTimeout(() => {
                typeString(chineseText, 0, chineseTypingDelay, () => {
                  const timeoutId3 = setTimeout(() => {
                    deleteString(chineseText, chineseDeleteDelay, () => {
                      const timeoutId4 = setTimeout(() => {
                        sequence();
                      }, pauseAfterDelete);
                      timeouts.push(timeoutId4);
                    });
                  }, pauseAfterType);
                  timeouts.push(timeoutId3);
                });
              }, pauseAfterDelete);
              timeouts.push(timeoutId2);
            });
          }, pauseAfterType);
          timeouts.push(timeoutId1);
        });
      };

      sequence();

      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedFateText('');
        setIsFateTypingActive(false);
        timeouts = [];
      };
    }
  }, [textVisible]);

  return { displayedFateText, isFateTypingActive };
}

/**
 * Environment parameters typing effect — generates and types random env data
 */
export function useEnvParamsTypingEffect(textVisible: boolean): EnvParamsTypingState {
  const [displayedEnvParams, setDisplayedEnvParams] = useState('');
  const [isEnvParamsTyping, setIsEnvParamsTyping] = useState(false);
  const [envData, setEnvData] = useState<EnvData | null>(null);
  const [envDataVersion, setEnvDataVersion] = useState(0);
  const currentTempRef = useRef(55.0);
  const lastGeneratedParamsRef = useRef('');

  useEffect(() => {
    if (textVisible) {
      const typingDelay = 35;
      const envDeleteDelay = 20;

      let timeouts = [];
      setIsEnvParamsTyping(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedEnvParams(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteEnvParamsString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedEnvParams(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteEnvParamsString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const generateNewParams = () => {
        const tempChange = (Math.random() * 3) - 1.5;
        let newTemp = currentTempRef.current + tempChange;
        newTemp = Math.max(44, Math.min(66, newTemp));
        currentTempRef.current = newTemp;
        const tempStr = newTemp.toFixed(1);

        const rad = Math.floor(200 + Math.random() * 300);
        const o2 = (8 + Math.random() * 2).toFixed(1);

        const pollutionLevels = ["SEVERE", "CRITICAL", "UNSTABLE", "HAZARDOUS"];
        const pollution = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];

        const rainStatus = ["IMMINENT", "LIKELY", "UNLIKELY", "CERTAIN"];
        const rain = rainStatus[Math.floor(Math.random() * rainStatus.length)];

        const warnings = [
          "ALERT: TOXIC EXPOSURE RISK",
          "CAUTION: RADIATION STORM",
          "DANGER: ACID ZONES EXPANDING",
          "URGENT: OXYGEN DEPLETION"
        ];
        const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
        const warningLine = Math.random() > 0.5 ? `\n${randomWarning}` : '';

        setEnvData({ temp: newTemp, rad, o2: parseFloat(o2), pollution, acidRain: rain });
        setEnvDataVersion(prev => prev + 1);

        return `TEMP: ${tempStr}°C\nRAD: ${rad}mSv/h\nO2: ${o2}%\nPOLLUTION: ${pollution}\nACID RAIN: ${rain}${warningLine}`;
      };

      const generateAndType = () => {
        const newParams = generateNewParams();
        lastGeneratedParamsRef.current = newParams;
        typeString(newParams, 0, typingDelay, () => {
          const updateTime = 8000 + Math.floor(Math.random() * 7000);
          const restartTimeout = setTimeout(() => {
            startTyping();
          }, updateTime);
          timeouts.push(restartTimeout);
        });
      };

      const startTyping = () => {
        const textToDelete = lastGeneratedParamsRef.current;

        if (textToDelete.length > 0) {
          deleteEnvParamsString(textToDelete, envDeleteDelay, () => {
            generateAndType();
          });
        } else {
          generateAndType();
        }
      };

      const initialDelay = setTimeout(() => {
        startTyping();
      }, 1000);
      timeouts.push(initialDelay);

      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedEnvParams('');
        setIsEnvParamsTyping(false);
        setEnvData(null);
        setEnvDataVersion(0);
        lastGeneratedParamsRef.current = '';
      };
    }
  }, [textVisible]);

  return { displayedEnvParams, isEnvParamsTyping, envData, envDataVersion };
}
