import { ImageManager } from './imageUtils';

// 基础图片数据 - 只包含必要信息
const RAW_IMAGE_DATA = {
  // 游戏相关图片
  games: {
    minecraft: {
      cover: '/images/projects/Minecraft/MC2025.png',
      gallery: [
        '/images/projects/Minecraft/MC2.png',
        '/images/projects/Minecraft/MC2024.png',
        '/images/projects/Minecraft/MC2025.png',
        '/images/projects/Minecraft/yh.jpg'
      ]
    },
    whiteAlbum: {
      cover: '/images/pictures/WHITE_ALBUM/w10.jpg',
      gallery: Array.from({length: 21}, (_, i) => `/images/pictures/WHITE_ALBUM/w${i + 1}.jpg`)
    },
    stray: {
      cover: '/images/pictures/Stray/stray15.jpg',
      gallery: Array.from({length: 16}, (_, i) => `/images/pictures/Stray/stray${i + 1}.jpg`)
    },
    touhou: {
      cover: '/images/pictures/Touhou/TH3.png',
      gallery: [
        '/images/pictures/Touhou/CG1.png',
        '/images/pictures/Touhou/CG2.png', 
        '/images/pictures/Touhou/CG3.png',
        '/images/pictures/Touhou/TH1.jpg',
        '/images/pictures/Touhou/TH2.jpg',
        '/images/pictures/Touhou/TH3.png',
        '/images/pictures/Touhou/TH4.jpg',
        '/images/pictures/Touhou/TH5.jpg',
        '/images/pictures/Touhou/TH6.jpg'
      ]
    },
    titanfall: {
      cover: '/images/pictures/Titalfall/titan13.jpg',
      gallery: Array.from({length: 13}, (_, i) => `/images/pictures/Titalfall/titan${i + 1}.jpg`)
    },
    blackMyth: {
      cover: '/images/pictures/BLACKMYTH/WK3.jpg',
      gallery: Array.from({length: 11}, (_, i) => `/images/pictures/BLACKMYTH/WK${i}.jpg`)
    },
    monsterHunter: {
      cover: '/images/pictures/Monster_Hunter/MH1.jpg',
      gallery: Array.from({length: 14}, (_, i) => `/images/pictures/Monster_Hunter/MH${i + 1}.jpg`)
    }
  },
  
  // 旅行相关图片
  travels: {
    jilin: {
      cover: '/images/travel/jilin/JL1.jpg',
      gallery: Array.from({length: 9}, (_, i) => `/images/travel/jilin/JL${i + 1}.jpg`)
    },
    shaanxi: {
      cover: '/images/travel/shaanxi/SX5.jpg',
      gallery: Array.from({length: 14}, (_, i) => `/images/travel/shaanxi/SX${i + 1}.jpg`)
    },
    chongqing: {
      cover: '/images/travel/chongqing/CQ1.jpg',
      gallery: Array.from({length: 6}, (_, i) => `/images/travel/chongqing/CQ${i + 1}.jpg`)
    },
    qinghai: {
      cover: '/images/travel/qinghai/QH36.jpg',
      gallery: Array.from({length: 44}, (_, i) => `/images/travel/qinghai/QH${i}.jpg`)
    },
    guizhou: {
      cover: '/images/travel/guizhou/GZ1.jpg',
      gallery: Array.from({length: 24}, (_, i) => `/images/travel/guizhou/GZ${i + 1}.jpg`)
    }
  },

  // 项目相关图片
  projects: {
    robby: {
      cover: '/images/projects/robby/RB0.png',
      gallery: [
        '/images/projects/robby/RB0.png',
        '/images/projects/robby/RB1.png',
        '/images/projects/robby/RB2.png'
      ]
    },
    fox: {
      gallery: Array.from({length: 4}, (_, i) => `/images/projects/fox/fox${i + 1}.png`)
    },
    // ... 其他项目
  }
};

// 将相对路径转换为完整URL
const addDomain = (path) => `https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com${path}`;

// 处理图片数据，添加优化版本
const processImageData = (data) => {
  const processed = {};
  
  Object.keys(data).forEach(category => {
    processed[category] = {};
    
    Object.keys(data[category]).forEach(item => {
      const itemData = data[category][item];
      processed[category][item] = {
        cover: itemData.cover ? {
          original: addDomain(itemData.cover),
          ...ImageManager.getResponsiveUrls(addDomain(itemData.cover))
        } : null,
        gallery: itemData.gallery ? itemData.gallery.map(path => ({
          original: addDomain(path),
          ...ImageManager.getResponsiveUrls(addDomain(path))
        })) : []
      };
    });
  });
  
  return processed;
};

// 导出处理后的图片数据
export const OPTIMIZED_IMAGE_DATA = processImageData(RAW_IMAGE_DATA);

// 图片数据统计
export const getImageStats = () => {
  let totalImages = 0;
  
  Object.keys(RAW_IMAGE_DATA).forEach(category => {
    Object.keys(RAW_IMAGE_DATA[category]).forEach(item => {
      const itemData = RAW_IMAGE_DATA[category][item];
      if (itemData.cover) totalImages++;
      if (itemData.gallery) totalImages += itemData.gallery.length;
    });
  });
  
  return {
    totalImages,
    estimatedOriginalSize: totalImages * 2, // MB
    estimatedOptimizedSize: totalImages * 0.15, // MB with WebP + compression
    savings: Math.round((1 - 0.15/2) * 100) // 节省百分比
  };
};

// 按需获取图片数据
export const getImageData = (category, item, quality = 'medium') => {
  const data = OPTIMIZED_IMAGE_DATA[category]?.[item];
  if (!data) return null;
  
  return {
    cover: data.cover?.[quality] || data.cover?.original,
    gallery: data.gallery.map(img => img[quality] || img.original)
  };
}; 