import styles from '../../styles/Home.module.scss';

export default function ExperienceSection({
  experienceSectionRef,
  experienceData,
  handleExperienceItemClick,
}) {
  return (
    <div id="experience-section" ref={experienceSectionRef} className={`${styles.contentSection} ${styles.experienceSection}`}>
      <h2 className={styles.experienceTitleWithBackground}>EXPERIENCE</h2>
      <div className={styles.experienceTimeline}>
        {experienceData.map((item, index) => (
          <div
            key={item.id}
            className={`
              ${styles.timelineItem}
              ${item.alignment === 'left' ? styles.timelineItemLeft : styles.timelineItemRight}
              ${item.type === 'education' ? styles.educationItem : ''}
            `}
            onClick={(e) => handleExperienceItemClick(item, e)}
          >
            <div className={styles.timelinePoint} />
            <div className={styles.timelineBranch} />
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <span className={styles.timelineYear}>{item.duration}</span>
                <h3>{item.title}</h3>
              </div>
              {item.details && item.details.length > 0 && (
                <div className={styles.timelineDetails}>
                  {item.details.map((detail, i) => (
                    <p key={i} className={item.type === 'education' && index === 0 && (i === 0 || i === 1) ? styles.timelineNumber : ''}>
                      {detail}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
