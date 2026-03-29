import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/LifeDetailView.module.scss';
import Lightbox from '../interactive/Lightbox';
import LazyImage from '../shared/LazyImage';
import { ImageManager } from '../../lib/imageUtils';

const LifeDetailView = ({ item }) => {
  if (!item) return null; // 如果没有选中项，则不渲染

  const { title, description, tech, imageUrl, articleContent, galleryImages } = item;
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}; // 主图背景样式

  // 根据双换行符分割文章内容为段落
  const paragraphs = articleContent ? articleContent.split('\n\n') : [];
  
  // 模板：无作者 COS 图时可留空；有 galleryImages 时仍走上方分支
  const MINECRAFT_EXTRA_IMAGES = [];
  // 确定用于画廊和灯箱的图片数据源
  // 优先使用 item.galleryImages，否则根据 item.id 提供备用图片 (例如 Minecraft)
  const imagesForGallery = galleryImages && galleryImages.length > 0 
    ? galleryImages 
    : (item.id === 'mc' ? MINECRAFT_EXTRA_IMAGES : []); // 若无特定画廊数据或备用数据，则默认为空数组

  // 灯箱状态管理
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // 灯箱是否打开
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0); // 当前灯箱图片索引
  const [clickedThumbnailRect, setClickedThumbnailRect] = useState(null); // 新增 state 存储点击的缩略图位置和尺寸
  const [currentLightboxSourceInfo, setCurrentLightboxSourceInfo] = useState(null); // ADDED state
  
  const thumbnailRefs = useRef({}); // To store refs of thumbnail elements { index: ref }

  // 获取特定图片在特定 Life Item (如 WA, physical-games, qinghai) 中的动态图片说明
  const getDynamicCaption = (imageSrc) => {
    return null;
  };

  // 打开灯箱
  const openLightbox = (index, event, sourceType) => { // ADDED sourceType
    if (imagesForGallery && imagesForGallery.length > 0 && index >= 0 && index < imagesForGallery.length) {
      console.log(`LifeDetailView: Opening lightbox for index: ${index}, type: ${sourceType}, Event target:`, event.currentTarget);
      let rect;
      if (event && event.currentTarget) {
        rect = event.currentTarget.getBoundingClientRect();
        console.log(`LifeDetailView: openLightbox - Got rect from event.currentTarget for index ${index}`, rect);
      } else {
        const refKey = `${sourceType}_${index}`;
        const thumb = thumbnailRefs.current[refKey];
        if (thumb) {
          rect = thumb.getBoundingClientRect();
          console.log(`LifeDetailView: openLightbox - Fallback: Got rect from thumbnailRefs.current[${refKey}]`, rect);
        } else {
          console.warn(`LifeDetailView: openLightbox - No event.currentTarget and no thumbnail ref for key ${refKey}`);
        }
      }
      
      console.log(`LifeDetailView: Setting clickedThumbnailRect for index ${index}:`, rect);
      setClickedThumbnailRect(rect);
      setCurrentLightboxImageIndex(index);
      setCurrentLightboxSourceInfo({ index, type: sourceType }); // SET source info
      setIsLightboxOpen(true);
    } else {
      console.error("LifeDetailView: Cannot open lightbox, invalid index or no images for gallery.");
    }
  };

  // 关闭灯箱
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentLightboxSourceInfo(null); // CLEAR source info
  };

  // 显示下一张灯箱图片 
  const showNextImage = () => {
    if (imagesForGallery.length > 0) {
      const nextIndex = (currentLightboxImageIndex + 1) % imagesForGallery.length;
      console.log("LifeDetailView: showNextImage, nextIndex:", nextIndex);
      setCurrentLightboxImageIndex(nextIndex);
      setClickedThumbnailRect(null); 
      // Keep currentLightboxSourceInfo as is, assuming next/prev still refers to the same original gallery structure
    }
  };

  // 显示上一张灯箱图片
  const showPrevImage = () => {
    if (imagesForGallery.length > 0) {
      const prevIndex = (currentLightboxImageIndex - 1 + imagesForGallery.length) % imagesForGallery.length;
      console.log("LifeDetailView: showPrevImage, prevIndex:", prevIndex);
      setCurrentLightboxImageIndex(prevIndex);
      setClickedThumbnailRect(null); 
      // Keep currentLightboxSourceInfo
    }
  };

  // RENAMED and MODIFIED function
  const getClosingRect = () => {
    if (!currentLightboxSourceInfo) {
      console.warn("LifeDetailView: getClosingRect - No currentLightboxSourceInfo available.");
      return null;
    }
    const { index: closingIndex, type: closingType } = currentLightboxSourceInfo;
    const refKey = `${closingType}_${closingIndex}`;
    console.log(`LifeDetailView: getClosingRect - Attempting for key: ${refKey}`);
    console.log("LifeDetailView: Current thumbnailRefs.current:", thumbnailRefs.current);
    const thumb = thumbnailRefs.current[refKey];
    if (thumb) {
      const rect = thumb.getBoundingClientRect();
      console.log(`LifeDetailView: getClosingRect - Found ref for key ${refKey}, rect:`, rect);
      return rect;
    }
    console.warn(`LifeDetailView: getClosingRect - No thumbnail ref found for key: ${refKey}`);
    return null;
  };

  return (
    <div className={styles.detailContainer}>
      {/* 返回按钮 (已移除) 
      <button className={styles.backButton} onClick={onBack}>
        ← BACK
      </button>
      */}

      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailContent}>
          <div className={styles.detailImageContainer}>
              <div className={styles.detailImage} style={imageStyle}>
                 {!imageUrl && <span>Image not available</span>} {/* 无主图时显示占位文本 */}
                 <div className={styles.imageScanlineOverlay}></div> {/* 图片扫描线覆盖层 */}
              </div>
          </div>

          <div className={styles.detailText}>
              <p className={styles.detailDescription}>{description}</p>
              
              {/* 渲染文章内容，并在段落间插入图片/链接 */}
              {articleContent && (
                <div className={styles.articleSection}>
                  {paragraphs.map((paragraph, index) => {
                    let imagesToRenderAfter = []; // 存储在此段落后渲染的图片或链接对象

                    // --- 特定 Life Item 的图片/链接插入逻辑 ---
                    // 根据 item.id 和段落索引 (index) 决定插入哪些内容
                    
                    // 怪物猎人 (mh)
                    if (item.id === 'mh') {
                      if (index === paragraphs.length - 1) { // 最后一段后
                        const mh4Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Monster_Hunter/MH4.jpg?imageMogr2/quality/50/format/webp');
                        if (mh4Index !== -1) imagesToRenderAfter.push({ info: imagesForGallery[mh4Index], lightboxIndex: mh4Index });
                        imagesToRenderAfter.push('separator'); // 分隔符，用于后续渲染链接列表
                        imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1n5aTebESo', text: '鏖战冰牙龙' });
                        imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1uNapeDEcS', text: '初见冰呪龙' });
                      }
                    } 
                    // Minecraft (mc)
                    else if (item.id === 'new_minecraft') { // UPDATED item.id
                      let imageToInsertSrc = null;
                      let imageCaption = null; // Optional caption for specific image

                      if (index === 1) { // 第二段后
                        imageToInsertSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Minecraft/MC2024.png?imageMogr2/quality/50/format/webp';
                        // imageCaption = 'MC2024 Caption'; // Example if needed
                      } else if (index === 2) { // 第三段后
                        imageToInsertSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Minecraft/MC2.png?imageMogr2/quality/50/format/webp';
                      } else if (index === 4) { // 第五段后
                        imageToInsertSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Minecraft/yh.jpg?imageMogr2/quality/50/format/webp';
                      } else if (index === paragraphs.length - 1) { // 最后一段后
                        imageToInsertSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Minecraft/MC2025.png?imageMogr2/quality/50/format/webp';
                      }

                      if (imageToInsertSrc) {
                        const imgIndexInGallery = imagesForGallery.findIndex(img => img.src === imageToInsertSrc);
                        if (imgIndexInGallery !== -1) {
                          // Use caption from galleryImages if available, or the specific one if defined
                          const captionToUse = imageCaption || imagesForGallery[imgIndexInGallery].caption;
                          imagesToRenderAfter.push({ 
                            info: { ...imagesForGallery[imgIndexInGallery], caption: captionToUse }, 
                            lightboxIndex: imgIndexInGallery,
                            sourceTypeIdentifier: 'mc' // Add a specific identifier for Minecraft article images
                          });
                        }
                      }
                      
                      if (index === paragraphs.length - 1) { // 最后一段后加链接 (保持原有链接逻辑)
                          imagesToRenderAfter.push('separator'); 
                          imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV13G411D7Gq', text: '营火服务器实况' });
                          imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1ce411D7dG', text: '营火高级幻岛' });
                      }
                    } 
                    // 吉林 (jilin)
                    else if (item.id === 'jilin') {
                      if (index === 3) { // 第4段后
                        const jilin1Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/jilin/JL1.jpg?imageMogr2/quality/50/format/webp');
                        if (jilin1Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[jilin1Index], caption: '高考结束那天，黑云分界线如刀切一般，太阳也正展现着它的曙光' }, lightboxIndex: jilin1Index });
                      } else if (index === 4) { // 第5段后
                        const jilin5Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/jilin/JL5.jpg?imageMogr2/quality/50/format/webp');
                        if (jilin5Index !== -1) imagesToRenderAfter.push({ info: imagesForGallery[jilin5Index], lightboxIndex: jilin5Index });
                      }
                    }
                    // 青海 (qinghai)
                    else if (item.id === 'qinghai') {
                      let targetImageSrc = null, targetCaption = null, isRow = false;
                      let secondTargetImageSrc = null, secondTargetCaption = null;
                      let multipleImages = [];

                      if (index === 1) { // 第2段后 (图片行)
                        isRow = true;
                        targetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/qinghai/QH5.jpg?imageMogr2/quality/50/format/webp'; targetCaption = '凌晨的坎布拉';
                        secondTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/qinghai/QH6.jpg?imageMogr2/quality/50/format/webp'; secondTargetCaption = '我俩在黑夜打着手电筒交替前行';
                      } else if (index === 4) { // 第5段 (最后一段) 后 (多图堆叠)
                        multipleImages = [
                          { src: 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/qinghai/QH12.jpg?imageMogr2/quality/50/format/webp', caption: '青海湖' },
                          { src: 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/qinghai/QH18.jpg?imageMogr2/quality/50/format/webp', caption: '落日下的茶卡盐湖' },
                          { src: 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/qinghai/QH36.jpg?imageMogr2/quality/50/format/webp', caption: '岗什卡脚下的信号塔' },
                          { src: 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/qinghai/QH40.jpg?imageMogr2/quality/50/format/webp', caption: '风雪中的岗什卡' },
                        ];
                      }

                      if (targetImageSrc) {
                        const imgIndex = imagesForGallery.findIndex(img => img.src === targetImageSrc);
                        if (imgIndex !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption: targetCaption }, lightboxIndex: imgIndex });
                      }
                      if (isRow && secondTargetImageSrc) {
                        const secondImgIndex = imagesForGallery.findIndex(img => img.src === secondTargetImageSrc);
                        if (secondImgIndex !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[secondImgIndex], caption: secondTargetCaption }, lightboxIndex: secondImgIndex });
                      }
                      if (multipleImages.length > 0) {
                        multipleImages.forEach(imgInfo => {
                          const imgIndex = imagesForGallery.findIndex(img => img.src === imgInfo.src);
                          if (imgIndex !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption: imgInfo.caption }, lightboxIndex: imgIndex });
                        });
                      }
                    }
                    // 韩国 (korea)
                    else if (item.id === 'korea') {
                      if (index === 1) { // 第2段后
                        const hg3Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/images/travel/hanguo/HG3.jpg?imageMogr2/quality/50/format/webp');
                        if (hg3Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[hg3Index], caption: '我和父母一起吃烤肉' }, lightboxIndex: hg3Index });
                      }
                    }
                    // 东方凭依华 (thif)
                    else if (item.id === 'thif') {
                      if (index === paragraphs.length - 1) { // 最后一段后
                        const cg1Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Touhou/CG1.png?imageMogr2/quality/50/format/webp');
                        if (cg1Index !== -1) imagesToRenderAfter.push({ info: imagesForGallery[cg1Index], lightboxIndex: cg1Index });
                      }
                    }
                    // 黑神话：悟空 (bmwk)
                    else if (item.id === 'bmwk') { 
                      if (index === paragraphs.length - 1) { // 最后一段后
                        imagesToRenderAfter.push('separator');
                        imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1bKtXeoET6', text: '实体版开箱' });
                      }
                    }
                    // 泰坦陨落 (titanfall)
                    else if (item.id === 'titanfall') {
                      if (index === paragraphs.length - 1) { // 最后一段后
                        const imgIndex = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Titalfall/titan4.jpg?imageMogr2/quality/50/format/webp');
                        if (imgIndex !== -1) imagesToRenderAfter.push({ info: imagesForGallery[imgIndex], lightboxIndex: imgIndex });
                      }
                    }
                    // 实体游戏收藏 (physical-games)
                    else if (item.id === 'physical-games') {
                      if (index === 1) { // 第二段后
                        const sc13Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/collection/SC13.jpg?imageMogr2/quality/50/format/webp');
                        if (sc13Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[sc13Index], caption: 'Minecraft黑胶唱片' }, lightboxIndex: sc13Index });
                      } else if (index === paragraphs.length - 1) { // 最后一段后
                        const sc7Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/collection/SC7.jpg?imageMogr2/quality/50/format/webp');
                        if (sc7Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[sc7Index], caption: '《樱之诗》实体版' }, lightboxIndex: sc7Index });
                      }
                    }
                    // 白色相簿 (wa)
                    else if (item.id === 'wa') {
                      let waTargetImageSrc = null, waTargetCaption = null, waIsRow = false;
                      let waSecondTargetImageSrc = null, waSecondTargetCaption = null;

                      if (index === 0) { 
                        waTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/WHITE_ALBUM/w1.jpg?imageMogr2/quality/50/format/webp';
                      } else if (index === 2) { 
                        waTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/WHITE_ALBUM/w3.jpg?imageMogr2/quality/50/format/webp'; waTargetCaption = '小夜子名场面';
                      } else if (index === 3) { 
                        waTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/WHITE_ALBUM/w15.jpg?imageMogr2/quality/50/format/webp'; waTargetCaption = '理奈放弃自己的偶像事业后与冬弥来到海边';
                      } else if (index === 5) { 
                        waTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/WHITE_ALBUM/w18.jpg?imageMogr2/quality/50/format/webp'; waTargetCaption = '小夜子和冬弥相互依偎';
                      } else if (index === 6) { 
                        waIsRow = true;
                        waTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/WHITE_ALBUM/w16.jpg?imageMogr2/quality/50/format/webp'; waTargetCaption = '遥';
                        waSecondTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/WHITE_ALBUM/w20.jpg?imageMogr2/quality/50/format/webp'; waSecondTargetCaption = '弥生';
                      } else if (index === 8) { 
                        waTargetImageSrc = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/WHITE_ALBUM/w2.jpg?imageMogr2/quality/50/format/webp';
                      } else if (index === paragraphs.length - 1) {
                      }

                      if (waTargetImageSrc) {
                        const imgIndex = imagesForGallery.findIndex(img => img.src === waTargetImageSrc);
                        if (imgIndex !== -1) {
                          const caption = waTargetCaption || imagesForGallery[imgIndex].caption;
                          imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption }, lightboxIndex: imgIndex });
                        }
                      }
                      if (waIsRow && waSecondTargetImageSrc) {
                         const secondImgIndex = imagesForGallery.findIndex(img => img.src === waSecondTargetImageSrc);
                         if (secondImgIndex !== -1) {
                           const caption = waSecondTargetCaption || imagesForGallery[secondImgIndex].caption;
                           imagesToRenderAfter.push({ info: { ...imagesForGallery[secondImgIndex], caption }, lightboxIndex: secondImgIndex });
                         }
                      }
                    }
                    // Stray (stray)
                    else if (item.id === 'stray') {
                      if (index === paragraphs.length - 1) { // 最后一段后
                        const stray3Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/Stray/stray3.jpg?imageMogr2/quality/50/format/webp');
                        if (stray3Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[stray3Index], caption: '初遇B-12' }, lightboxIndex: stray3Index });
                        imagesToRenderAfter.push('separator');
                        imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1jN411h7Ea', text: 'Stray实况视频' });
                      }
                    }
                    // 实体游戏 (physical-games)
                    else if (item.id === 'physical-games') {
                        if (index === 1) { // 第二段后
                            const sc13Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/collection/SC13.jpg?imageMogr2/quality/50/format/webp');
                            if (sc13Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[sc13Index], caption: 'Minecraft黑胶唱片' }, lightboxIndex: sc13Index });
                        } else if (index === 2) { // 第三段后
                            const sc7Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/collection/SC7.jpg?imageMogr2/quality/50/format/webp');
                            if (sc7Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[sc7Index], caption: '《樱之诗》实体版' }, lightboxIndex: sc7Index });
                        }
                    }
                    // 桌搭 (desk-setup)
                    else if (item.id === 'desk-setup') {
                        // 桌搭部分目前只在画廊展示，不在文章中插入特定图片
                    }
                    // 硬件 (hardware)
                    else if (item.id === 'hardware') {
                        if (index === 0) { // 第一段后
                            const yj4Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/hard/YJ4.jpg?imageMogr2/quality/50/format/webp');
                            if (yj4Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[yj4Index], caption: '搭的一台itx服务器' }, lightboxIndex: yj4Index });
                        } else if (index === 2) { // 第三段后
                            const yj1Index = imagesForGallery.findIndex(img => img.src === 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/pictures/hard/YJ1.jpg?imageMogr2/quality/50/format/webp');
                            if (yj1Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[yj1Index], caption: '入手的铁三角唱片机' }, lightboxIndex: yj1Index });
                        }
                    }
                    // --- END 特定 Life Item 图片/链接插入逻辑 ---
                    
                    const isStrayQuote = item.id === 'stray' && paragraph.includes('——《我是猫》，夏目漱石'); // Stray 项目的特殊引用块处理

                    return (
                      <React.Fragment key={index}>
                        {/* 渲染段落文本或引用块 */}
                        {isStrayQuote ? (
                          <blockquote key={`${index}-text`} className={styles.articleBlockquote}>
                            {paragraph.split('\n').map((line, lineIndex) => <span key={lineIndex} style={{ display: 'block' }}>{line}</span>)}
                          </blockquote>
                        ) : (
                          <p key={`${index}-text`}>{paragraph}</p>
                        )}

                        {/* 在段落后渲染图片和链接 */}
                        {imagesToRenderAfter.length > 0 && (
                          <>
                            {/* 渲染图片行 (若适用) */}
                            {(item.id === 'wa' && index === 6 || item.id === 'qinghai' && index === 1) && 
                             imagesToRenderAfter.every(i => typeof i === 'object' && i.info) && imagesToRenderAfter.length === 2 && (
                              <div className={styles.inlineImageRow} key={`${index}-img-row`}> 
                                {imagesToRenderAfter.map(({ info, lightboxIndex }) => (
                                  <figure 
                                    key={`row_img_${lightboxIndex}`}
                                    className={`${styles.articleImageFigure} ${styles.clickableFigure} ${styles.rowFigure}`} 
                                    onClick={(e) => openLightbox(lightboxIndex, e, 'article')} // Pass sourceType
                                    ref={el => { thumbnailRefs.current[`article_${lightboxIndex}`] = el; }} // MODIFIED REF KEY
                                  >
                                    <LazyImage 
                                      src={info.src} 
                                      alt={info.caption || `${title} illustration`} 
                                      className={styles.articleImage}
                                      quality="medium"
                                    />
                                    {info.caption && <figcaption className={styles.articleImageCaption}>{info.caption}</figcaption>}
                                  </figure>
                                ))}
                              </div>
                            )}

                            {/* 渲染堆叠图片 (排除已在行中渲染的) */}
                            {imagesToRenderAfter
                              .filter(renderItem => typeof renderItem === 'object' && renderItem.info && 
                                     !(item.id === 'wa' && index === 6 || item.id === 'qinghai' && index === 1))
                              .map(({ info, lightboxIndex, sourceTypeIdentifier }, itemIndex) => { // Added sourceTypeIdentifier
                                const finalSourceType = `article${sourceTypeIdentifier ? '_' + sourceTypeIdentifier : ''}`;
                                return (
                                <figure 
                                  key={`stack_img_${lightboxIndex}`}
                                  className={`${styles.articleImageFigure} ${styles.clickableFigure}`} 
                                  onClick={(e) => openLightbox(lightboxIndex, e, finalSourceType)} // Use finalSourceType
                                  ref={el => { thumbnailRefs.current[`${finalSourceType}_${lightboxIndex}`] = el; }} // Use finalSourceType in ref key
                                >
                                  <LazyImage 
                                    src={info.src} 
                                    alt={info.caption || `${title} illustration`} 
                                    className={styles.articleImage}
                                    quality="medium"
                                  />
                                  {info.caption && <figcaption className={styles.articleImageCaption}>{info.caption}</figcaption>}
                                </figure>
                               );
                              })
                            }
                            
                            {/* 如果存在分隔符 'separator', 则渲染链接列表 */}
                            {imagesToRenderAfter.includes('separator') && (
                              <div className={styles.articleLinkList} key={`${index}-link-list`}>
                                {imagesToRenderAfter
                                  .filter(renderItem => typeof renderItem === 'object' && renderItem.type === 'link')
                                  .map(linkItem => (
                                    <div key={linkItem.href} className={styles.articleLinkItem}>
                                      {linkItem.href.includes('bilibili.com') ? ( // Bilibili 链接特殊处理 (带图标和波纹)
                                        <span className={styles.iconLinkContainer}> 
                                          <a href={linkItem.href} target="_blank" rel="noopener noreferrer" className={styles.inlineIconLink} aria-label={linkItem.text}>
                                            <span className={styles.inlineIconSvgContainer}> {/* SVG 图标容器 */} 
                                              <svg className={styles.inlineIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"/></g></svg>
                                            </span>
                                            <span className={styles.inlineIconText}>{linkItem.text}</span> {/* 链接文本在 a 标签内 */}
                                            <div className={styles.iconRipple}></div> {/* 点击波纹效果 */}
                                          </a>
                                        </span>
                                      ) : (
                                        <a href={linkItem.href} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>{linkItem.text}</a> // 普通链接
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </> 
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* 相关图片缩略图展示区域 */}
              {imagesForGallery.length > 0 && (
                <div className={styles.relatedImagesSection}>
                  <h4 className={styles.relatedImagesTitle}>图片</h4>
                  <div className={styles.thumbnailGrid}>
                    {imagesForGallery.map((img, idx) => ( // Changed index to idx to avoid conflict
                      <button 
                        key={`thumb_btn_${idx}`} 
                        className={styles.thumbnailButton} 
                        onClick={(e) => openLightbox(idx, e, 'thumb')} // Pass sourceType, use idx
                        ref={el => { thumbnailRefs.current[`thumb_${idx}`] = el; }} // MODIFIED REF KEY, use idx
                      >
                        <LazyImage 
                          src={img.src} 
                          alt={img.caption || `${title} thumbnail ${idx + 1}`} 
                          className={styles.thumbnailImage}
                          quality="low"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 技术标签展示区域 */}
              {tech && tech.length > 0 && (
                  <div className={styles.detailTechContainer}>
                       <span className={styles.techLabel}>Tags:</span> 
                       <div className={styles.detailTechTags}> 
                           {tech.map((tag, index) => (
                               <span key={index} className={styles.detailTechTag}>{tag}</span>
                           ))} 
                       </div> 
                  </div>
              )}
          </div>
      </div>

      {/* 灯箱组件 (当 isLightboxOpen 为 true 且有图片对象时渲染) */}
      {isLightboxOpen && imagesForGallery.length > 0 && (
        <Lightbox 
          image={imagesForGallery[currentLightboxImageIndex]}
          onClose={closeLightbox}
          onPrev={imagesForGallery.length > 1 ? showPrevImage : null}
          onNext={imagesForGallery.length > 1 ? showNextImage : null}
          thumbnailRect={clickedThumbnailRect}
          currentIndex={currentLightboxImageIndex}
          totalImages={imagesForGallery.length}
          getClosingRectForIndex={getClosingRect} // CHANGED prop name to pass the new function
        />
      )}

    </div>
  );
};

export default LifeDetailView; 