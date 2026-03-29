import styles from '../../styles/Home.module.scss';
import Noise from '../effects/Noise';

export default function AboutSection({
  aboutSectionRef,
  aboutContentRef,
  runtime,
  totalVisits,
  currentVisitors,
}) {
  return (
    <div id="about-section" ref={aboutSectionRef} className={`${styles.contentSection} ${styles.aboutSection}`}>
      <Noise />
      <div ref={aboutContentRef} className={styles.aboutContentInner}>
        <h2>ABOUT</h2>
        <div className={styles.siteStatsContainer}>
          <p>System Uptime: {runtime}</p>
          <p>Total Visits: {totalVisits}</p>
          <p>Online Now: {currentVisitors}</p>
        </div>
        <div className={styles.footerInfo}>
          {/* Replace with your own license/registration info, or remove */}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.licenseLink}
          >
            CC BY-NC-SA 4.0
          </a> 2025-PRESENT © Your Name
        </div>
      
      </div>
      
    </div>
  );
}
