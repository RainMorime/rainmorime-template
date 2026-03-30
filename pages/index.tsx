import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.scss';
import { useApp } from '../contexts/AppContext';
import { useTransition } from '../contexts/TransitionContext';
import NavigationColumns from '../components/layout/NavigationColumns';

export default function Home() {
  const router = useRouter();
  const { navigateTo } = useTransition();
  const {
    linesAnimated, pulsingNormalIndices, pulsingReverseIndices,
    textVisible, animationsComplete, isInverted, columnPhase,
    randomHudTexts, branchText1, branchText2, branchText3, branchText4,
    handleColumnMouseEnter, handleColumnMouseLeave,
  } = useApp();

  useEffect(() => {
    router.prefetch('/content');
  }, [router]);

  const handleColumnClick = (columnIndex: number) => {
    if (!animationsComplete) return;

    const sectionHashes = ['works', 'experience', 'blog', 'life', 'contact', 'about'];
    if (columnIndex < sectionHashes.length) {
      navigateTo(`/content#${sectionHashes[columnIndex]}`);
    }
  };

  return (
    <>
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="Personal portfolio and blog" />
        <meta property="og:title" content="My Portfolio" />
        <meta property="og:description" content="Personal portfolio and blog" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'} />
      </Head>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <NavigationColumns
          activeSection="home"
          linesAnimated={linesAnimated}
          pulsingNormalIndices={pulsingNormalIndices}
          pulsingReverseIndices={pulsingReverseIndices}
          textVisible={textVisible}
          animationsComplete={animationsComplete}
          isInverted={isInverted}
          columnPhase={columnPhase}
          randomHudTexts={randomHudTexts}
          branchText1={branchText1}
          branchText2={branchText2}
          branchText3={branchText3}
          branchText4={branchText4}
          handleColumnClick={handleColumnClick}
          handleColumnMouseEnter={handleColumnMouseEnter}
          handleColumnMouseLeave={handleColumnMouseLeave}
        />
      </div>
    </>
  );
}
