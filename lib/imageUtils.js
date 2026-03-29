// 图片管理工具类
export class ImageManager {
  static COS_DOMAIN = 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com';
  
  // 图片质量配置
  static QUALITY_PRESETS = {
    thumbnail: 'imageMogr2/thumbnail/200x150/quality/40/format/webp',
    low: 'imageMogr2/quality/50/format/webp',
    medium: 'imageMogr2/quality/75/format/webp',
    high: 'imageMogr2/quality/90/format/webp',
    original: ''
  };

  // 生成优化后的图片URL
  static getOptimizedUrl(originalUrl, quality = 'medium') {
    if (!originalUrl || !originalUrl.includes(this.COS_DOMAIN)) {
      return originalUrl;
    }
    
    const preset = this.QUALITY_PRESETS[quality];
    return preset ? `${originalUrl}?${preset}` : originalUrl;
  }

  // 生成响应式图片URL集合
  static getResponsiveUrls(originalUrl) {
    return {
      thumbnail: this.getOptimizedUrl(originalUrl, 'thumbnail'),
      low: this.getOptimizedUrl(originalUrl, 'low'),
      medium: this.getOptimizedUrl(originalUrl, 'medium'),
      high: this.getOptimizedUrl(originalUrl, 'high'),
      original: originalUrl
    };
  }

  // 预加载关键图片
  static preloadImages(urls, quality = 'low') {
    const promises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = this.getOptimizedUrl(url, quality);
      });
    });
    
    return Promise.allSettled(promises);
  }

  // 批量优化图片数据
  static optimizeImageData(imageArray, defaultQuality = 'medium') {
    return imageArray.map(img => ({
      ...img,
      optimized: this.getResponsiveUrls(img.src),
      defaultSrc: this.getOptimizedUrl(img.src, defaultQuality)
    }));
  }

  // 计算图片总大小（估算）
  static estimateDataUsage(imageArray, quality = 'medium') {
    const sizePerQuality = {
      thumbnail: 15, // KB
      low: 50,
      medium: 150,
      high: 400,
      original: 2000
    };
    
    const avgSize = sizePerQuality[quality] || 150;
    return {
      totalImages: imageArray.length,
      estimatedSizeKB: imageArray.length * avgSize,
      estimatedSizeMB: Math.round((imageArray.length * avgSize) / 1024 * 100) / 100
    };
  }
}

import { useState, useEffect, useRef } from 'react';

// 图片懒加载Hook
export const useImageLazyLoad = (imageSrc, options = {}) => {
  const {
    quality = 'medium',
    enableProgressiveLoad = true,
    rootMargin = '50px',
    threshold = 0.1
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);

  // 进入视窗检测
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // 渐进式加载
  useEffect(() => {
    if (!isInView || !imageSrc) return;

    const loadImage = async () => {
      try {
        if (enableProgressiveLoad) {
          // 先加载低质量版本
          const lowQualitySrc = ImageManager.getOptimizedUrl(imageSrc, 'low');
          setCurrentSrc(lowQualitySrc);
          
          // 预加载低质量图片
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = lowQualitySrc;
          });
        }

        // 加载目标质量图片
        const targetSrc = ImageManager.getOptimizedUrl(imageSrc, quality);
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = targetSrc;
        });

        setCurrentSrc(targetSrc);
        setIsLoaded(true);
      } catch (err) {
        setError(err);
        // 降级到原图
        setCurrentSrc(imageSrc);
      }
    };

    loadImage();
  }, [isInView, imageSrc, quality, enableProgressiveLoad]);

  return {
    imgRef,
    currentSrc,
    isLoaded,
    isInView,
    error
  };
}; 