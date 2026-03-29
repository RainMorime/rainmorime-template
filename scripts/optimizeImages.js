#!/usr/bin/env node
/**
 * 图片优化脚本
 * 用于批量处理和优化网站图片
 */

const fs = require('fs');
const path = require('path');

// 腾讯云COS配置
const COS_CONFIG = {
  domain: 'https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com',
  qualityPresets: {
    thumbnail: 'imageMogr2/thumbnail/200x150/quality/40/format/webp',
    low: 'imageMogr2/quality/50/format/webp', 
    medium: 'imageMogr2/quality/75/format/webp',
    high: 'imageMogr2/quality/90/format/webp'
  }
};

// 图片数据文件路径
const DATA_FILES = [
  './pages/index.js',
  './components/LifeDetailView.js'
];

// 分析当前图片使用情况
function analyzeImageUsage() {
  console.log('🔍 分析图片使用情况...\n');
  
  let totalImages = 0;
  let totalEstimatedSize = 0;
  const imageMap = new Map();

  DATA_FILES.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(/https:\/\/rainmorime-1315830626\.cos\.ap-beijing\.myqcloud\.com[^'"]+/g);
      
      if (matches) {
        console.log(`📁 ${filePath}: 发现 ${matches.length} 个图片`);
        matches.forEach(url => {
          if (!imageMap.has(url)) {
            imageMap.set(url, { count: 0, files: [] });
          }
          imageMap.get(url).count++;
          imageMap.get(url).files.push(filePath);
          totalImages++;
        });
      }
    }
  });

  // 估算总大小（假设平均每张图片2MB）
  totalEstimatedSize = totalImages * 2;

  console.log(`\n📊 统计结果:`);
  console.log(`总图片数量: ${totalImages}`);
  console.log(`估算原始大小: ${totalEstimatedSize}MB`);
  console.log(`估算优化后大小: ${Math.round(totalImages * 0.15)}MB (节省 ${Math.round((1 - 0.15/2) * 100)}%)`);

  return { totalImages, totalEstimatedSize, imageMap };
}

// 生成优化建议
function generateOptimizationSuggestions(analysis) {
  console.log(`\n💡 优化建议:\n`);

  const suggestions = [
    {
      title: '实施懒加载',
      description: '只在图片进入视窗时才加载，可减少初始加载流量',
      expectedSavings: '60-80%',
      priority: 'high'
    },
    {
      title: '使用WebP格式',
      description: '相比JPEG平均减少30%文件大小',
      expectedSavings: '30%',
      priority: 'high'
    },
    {
      title: '实施渐进式加载',
      description: '先显示低质量图片，再加载高质量版本',
      expectedSavings: '50%初始流量',
      priority: 'medium'
    },
    {
      title: '按需加载画廊',
      description: '图片画廊只在用户查看时才加载',
      expectedSavings: '70%',
      priority: 'high'
    },
    {
      title: '添加质量选择器',
      description: '让用户根据网络条件选择图片质量',
      expectedSavings: '可变',
      priority: 'medium'
    }
  ];

  suggestions.forEach((suggestion, index) => {
    const priority = suggestion.priority === 'high' ? '🔴' : '🟡';
    console.log(`${priority} ${index + 1}. ${suggestion.title}`);
    console.log(`   ${suggestion.description}`);
    console.log(`   预期节省: ${suggestion.expectedSavings}\n`);
  });
}

// 生成优化后的URL示例
function generateOptimizedUrls(imageUrl) {
  const optimizedUrls = {};
  
  Object.entries(COS_CONFIG.qualityPresets).forEach(([quality, preset]) => {
    optimizedUrls[quality] = `${imageUrl}?${preset}`;
  });

  return optimizedUrls;
}

// 创建代码替换建议
function generateCodeSuggestions() {
  console.log(`\n📝 代码优化建议:\n`);
  
  console.log(`1. 替换直接图片引用:`);
  console.log(`   原代码: <img src="https://rainmorime...jpg" />`);
  console.log(`   优化后: <LazyImage src="https://rainmorime...jpg" quality="medium" />\n`);

  console.log(`2. 使用图片管理工具:`);
  console.log(`   原代码: { src: 'https://rainmorime...jpg' }`);
  console.log(`   优化后: { src: ImageManager.getOptimizedUrl(originalUrl, 'medium') }\n`);

  console.log(`3. 实现质量选择:`);
  console.log(`   添加: <ImageOptimizer onQualityChange={handleQualityChange} />\n`);
}

// 主函数
function main() {
  console.log('🚀 开始图片优化分析...\n');

  // 分析当前使用情况
  const analysis = analyzeImageUsage();

  // 生成优化建议
  generateOptimizationSuggestions(analysis);

  // 生成代码建议
  generateCodeSuggestions();

  // 显示示例优化URL
  if (analysis.imageMap.size > 0) {
    const firstImage = Array.from(analysis.imageMap.keys())[0];
    console.log(`\n🔧 优化URL示例:`);
    console.log(`原图: ${firstImage}`);
    
    const optimized = generateOptimizedUrls(firstImage);
    Object.entries(optimized).forEach(([quality, url]) => {
      console.log(`${quality}: ${url}`);
    });
  }

  console.log(`\n✅ 分析完成！请按照建议进行优化。`);
}

// 执行脚本
if (require.main === module) {
  main();
}

module.exports = { analyzeImageUsage, generateOptimizationSuggestions }; 