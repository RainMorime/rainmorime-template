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
        <div className={styles.aboutImageContainer}>
          {/* Replace with your own image or QR code */}
          <img
            src="https://placehold.co/200x200/0d0d0d/b2f2bb?text=QR"
            alt="Website QR Code"
            className={styles.aboutImage}
          />
        </div>
      </div>
      <div className={styles.aboutNewImageWrapper}>
        <div className={styles.aboutNewImageContainer}>
          {/* Replace with your own decorative images */}
          <img
            src="https://placehold.co/400x600/0d0d0d/b2f2bb?text=Avatar"
            alt="About decorative"
            className={`${styles.aboutNewImageBase} ${styles.aboutNewImageNormal}`}
          />
          <img
            src="https://placehold.co/400x600/0d0d0d/f2b2d8?text=Avatar+Alt"
            alt="About decorative alt"
            className={`${styles.aboutNewImageBase} ${styles.aboutNewImageInverted}`}
          />
        </div>
      </div>
    </div>
  );
}
