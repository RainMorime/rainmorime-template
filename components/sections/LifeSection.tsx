import { useState } from 'react';
import styles from '../../styles/Home.module.scss';
import ProjectCard from '../cards/ProjectCard';

export default function LifeSection({
  lifeSectionRef,
  activeSection,
  activeLifeTab,
  handleLifeTabClick,
  lifeContentAreaRef,
  lifeGameTabRef,
  lifeTravelTabRef,
  lifeArtTabRef,
  lifeOtherTabRef,
  gameData,
  travelData,
  otherData,
  handleLifeItemClick,
}) {
  const alsoPlayGames = [
    'The Binding of Isaac: Rebirth',
    'Terraria',
    'Stardew Valley',
    'Warframe',
    'Deep Rock Galactic',
    'Slay the Spire',
    'Stellaris',
    'RimWorld',
  ];

  const [alsoPlayExpanded, setAlsoPlayExpanded] = useState(false);

  return (
    <div
      id="life-section"
      ref={lifeSectionRef}
      className={`${styles.contentSection} ${styles.lifeSection} ${activeSection === 'lifeDetail' ? styles.detailActive : ''}`}
    >
      <h2 className={styles.lifeTitleWithBackground}>LIFE</h2>
      <div className={styles.lifeTabButtons}>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'game' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('game')}
        >
          Game
        </button>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'travel' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('travel')}
        >
          Travel
        </button>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'art' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('art')}
        >
          Art
        </button>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'other' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('other')}
        >
          Other
        </button>
      </div>
      <div ref={lifeContentAreaRef} className={styles.lifeContentArea}>
        {/* Game Tab */}
        <div ref={lifeGameTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'game' ? styles.activeContent : ''}`}>
          <div className={styles.gameGrid}>
            {gameData.map(game => (
              <ProjectCard
                key={game.id}
                project={game}
                onClick={handleLifeItemClick}
              />
            ))}
          </div>
          <div className={styles.earlySection}>
            <button
              className={`${styles.earlySectionToggle} ${alsoPlayExpanded ? styles.expanded : ''}`}
              onClick={() => setAlsoPlayExpanded(prev => !prev)}
            >
              <span className={styles.earlySectionToggleIcon}>{alsoPlayExpanded ? '▾' : '▸'}</span>
              <span>还有这些也玩 / Also Play These</span>
              <span className={styles.earlySectionCount}>{alsoPlayGames.length}</span>
            </button>
            <div className={`${styles.earlySectionContent} ${alsoPlayExpanded ? styles.expanded : ''}`}>
              <div className={styles.smallGameGrid}>
                {alsoPlayGames.map((gameName) => (
                  <div key={gameName} className={styles.smallGameCard}>
                    {gameName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Travel Tab */}
        <div ref={lifeTravelTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'travel' ? styles.activeContent : ''}`}>
          <div className={styles.travelGrid}>
            {travelData.map(place => (
              <ProjectCard
                key={place.id}
                project={place}
                onClick={handleLifeItemClick}
              />
            ))}
          </div>
        </div>
        {/* Art Tab */}
        <div ref={lifeArtTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'art' ? styles.activeContent : ''}`}>
          <div className={styles.compactTextContainer}>
            <p>艺术是个好东西，音乐、绘画、设计还是电影我都喜欢，可回想起来能做的能说的却很少，或许我可以晚点再写...</p>
          </div>
        </div>
        {/* Other Tab */}
        <div ref={lifeOtherTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'other' ? styles.activeContent : ''} ${styles.compactTabContent}`}>
          <div className={styles.gameGrid}>
            {otherData.map(item => (
              <ProjectCard
                key={item.id}
                project={item}
                onClick={handleLifeItemClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
