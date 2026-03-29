import styles from '../../styles/Home.module.scss';
import ActivationLever from '../interactive/ActivationLever';
import type { EnvData } from '../../types';

const POLL_SCORES: Record<string, number> = { SEVERE: 0.5, CRITICAL: 0.7, UNSTABLE: 0.6, HAZARDOUS: 0.9 };
const RAIN_SCORES: Record<string, number> = { UNLIKELY: 0.1, LIKELY: 0.5, IMMINENT: 0.8, CERTAIN: 1.0 };

const GRAY_BASE  = [36, 24, 19, 12, 5];
const GRAY_COLORS = ['#333', '#444', '#666', '#888', '#aaa'];

function computeBlocks(envData: EnvData | null) {
  if (!envData) {
    return [
      { flex: 4, color: 'var(--ark-highlight-green)' },
      ...GRAY_BASE.map((f, i) => ({ flex: f, color: GRAY_COLORS[i] })),
    ];
  }

  const cl = (v: number) => Math.min(1, Math.max(0, v));
  const scores = [
    cl((envData.temp - 44) / 22),
    cl((envData.rad - 200) / 300),
    cl(1 - (envData.o2 - 8) / 2),
    POLL_SCORES[envData.pollution] ?? 0.5,
    RAIN_SCORES[envData.acidRain] ?? 0.3,
  ];

  const overall = scores.reduce((a, b) => a + b, 0) / 5;

  const grays = GRAY_BASE.map((base, i) => ({
    flex: Math.max(2, base + (scores[i] - 0.5) * 16),
    color: GRAY_COLORS[i],
  }));

  return [
    { flex: Math.max(1.5, 4 + (overall - 0.5) * 3), color: 'var(--ark-highlight-green)' },
    ...grays,
  ];
}

export default function LeftPanel({
  leftPanelAnimated,
  mainVisible,
  leversVisible,
  handleActivateTesseract,
  isTesseractActivated,
  handleDischargeLeverPull,
  isDischarging,
  activeSection,
  handleGlobalBackClick,
  navLinks,
  handleLeftNavLinkClick,
  handleFriendsClick,
  powerLevel,
  isFateTypingActive,
  displayedFateText,
  isEnvParamsTyping,
  displayedEnvParams,
  isInverted,
  drawerOpen = false,
  envData = null as EnvData | null,
  envDataVersion = 0,
  isStandalone = false,
}) {
  const blocks = !isInverted ? computeBlocks(envData) : null;

  const showBackAndNav =
    leftPanelAnimated && (
      activeSection === 'content' ||
      activeSection === 'lifeDetail' ||
      activeSection === 'workDetail' ||
      activeSection === 'experienceDetail' ||
      activeSection === 'blog' ||
      activeSection === 'blogDetail' ||
      activeSection === 'friendLinkDetail'
    );

  return (
    <div className={`${styles.leftPanel} ${leftPanelAnimated ? styles.animated : ''} ${drawerOpen ? styles.drawerOpen : ''} ${isStandalone ? styles.standaloneHide : ''}`}>
      <div className={styles.topRightDecoration}></div>
      <div className={styles.leverGroup}>
        {mainVisible && (
          <ActivationLever
            onActivate={handleActivateTesseract}
            isActive={isTesseractActivated}
            iconType="discharge"
            isAnimated={leversVisible}
          />
        )}
        {mainVisible && (
          <ActivationLever
            onActivate={handleDischargeLeverPull}
            isActive={isDischarging}
            iconType="drain"
            isAnimated={leversVisible}
          />
        )}
      </div>
    <button
      className={`${styles.globalBackButton} ${showBackAndNav ? styles.visible : ''}`}
      onClick={handleGlobalBackClick}
      data-cursor-label="BACK"
    >
    </button>
      <div className={`${styles.globalBackButtonDivider} ${showBackAndNav ? styles.visible : ''}`}></div>
      <div className={`${styles.leftNavLinks} ${showBackAndNav ? styles.visible : ''}`}>
        {navLinks.map((link) => (
          <button
            key={link.label}
            className={styles.leftNavLink}
            onClick={() => handleLeftNavLinkClick(link)}
          >
            {link.label}
          </button>
        ))}
        <button
          className={styles.leftNavLink}
          onClick={handleFriendsClick}
        >
          Friends
        </button>
      </div>
      <div className={styles.powerDisplay}>
        <div className={styles.batteryIcon}>
          {[...Array(5)].map((_, i) => {
            const shouldBeFilled = powerLevel >= (i + 1) * 20;
            const isFilled = (i === 4 && powerLevel === 100) || shouldBeFilled;
            return (
              <span
                key={i}
                className={`${styles.batteryLevelSegment} ${isFilled ? styles.filled : ''}`}
              ></span>
            );
          })}
        </div>
        <span className={styles.powerText}>{powerLevel}%</span>
      </div>
      <div className={styles.logoContainer}></div>
      <div className={`${styles.fateTextContainer} ${isFateTypingActive ? styles.typingActive : ''}`}>
        <span className={styles.fateText}>{displayedFateText}</span>
        <div className={styles.fateLine}></div>
      </div>
      <div className={`${styles.envParamsContainer} ${isEnvParamsTyping ? styles.typingActive : ''} ${leftPanelAnimated ? styles.animated : ''}`}>
        <pre className={styles.envParamsText}>
          {displayedEnvParams}
        </pre>
      </div>
      <div className={styles.brailleText}>⠝⠊⠕⠍⠡⠸⠬⠉⠄⠅⠢⠛⠳⠟⠧⠃⠥⠓⠳</div>
      <div className={`${styles.gradientLine} ${isInverted ? styles.gradientLineInverted : ''}`}>
        {blocks && blocks.map((b, i) => (
          <div
            key={i}
            className={styles.gradientSegment}
            style={{ flex: b.flex, backgroundColor: b.color }}
          />
        ))}
      </div>
      <a
        href="https://www.travellings.cn/go.html"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.travellingLink}
      >
        <img src="/travel.svg" alt="Travelling" />
      </a>
    </div>
  );
}
