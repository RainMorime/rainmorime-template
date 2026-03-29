import Head from 'next/head';
import SectionPageLayout from '../components/layout/SectionPageLayout';
import styles from '../styles/Home.module.scss';
import { friendLinksData } from '../data/friendLinks';

export default function FriendsPage() {
  return (
    <>
      <Head>
        <title>FRIENDS</title>
        <meta name="description" content="友链 — 同行者的信号" />
      </Head>
      <SectionPageLayout>
        <div className={styles.friendLinkSection}>
          <h2>Friend Links</h2>
          <div className={styles.friendLinkGrid}>
            {friendLinksData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.friendLinkCard}
                data-cursor-no-magnetic
              >
                <div className={styles.friendLinkAvatar}>
                  <img src={link.avatar} alt={link.name} />
                </div>
                <div className={styles.friendLinkInfo}>
                  <h3>{link.name}</h3>
                  <p>{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </SectionPageLayout>
    </>
  );
}
