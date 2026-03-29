#!/usr/bin/env node
/**
 * 批量图片URL优化脚本
 * 自动为所有腾讯云COS图片添加压缩参数
 */

const fs = require('fs');
const path = require('path');

// 需要处理的文件
const FILES_TO_PROCESS = [
  './pages/index.js',
  './components/LifeDetailView.js'
];

// 压缩参数配置（默认为低质量）
const COMPRESSION_PARAMS = {
  default: '?imageMogr2/quality/50/format/webp', // 改为低质量
  thumbnail: '?imageMogr2/thumbnail/400x300/quality/40/format/webp',
  high: '?imageMogr2/quality/75/format/webp' // 高质量降低到原来的中等质量
};

function optimizeFile(filePath) {
  console.log(`🔧 处理文件: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;

  // 正则表达式匹配腾讯云COS图片URL（未优化的）
  const cosUrlRegex = /(https:\/\/rainmorime-1315830626\.cos\.ap-beijing\.myqcloud\.com\/[^'"?\s]+)(?!\?imageMogr2)/g;

  // 替换所有匹配的URL
  content = content.replace(cosUrlRegex, (match) => {
    changeCount++;
    
    // 根据图片类型选择不同的压缩参数
    let params = COMPRESSION_PARAMS.default;
    
    // 如果是项目封面图，使用高质量
    if (match.includes('/images/projects/') && match.includes('imageUrl:')) {
      params = COMPRESSION_PARAMS.high;
    }
    // 如果是缩略图相关，使用缩略图参数
    else if (match.includes('thumbnail') || match.includes('thumb')) {
      params = COMPRESSION_PARAMS.thumbnail;
    }
    
    return match + params;
  });

  if (changeCount > 0) {
    // 备份原文件
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.writeFileSync(backupPath, fs.readFileSync(filePath));
    console.log(`📁 已备份到: ${backupPath}`);

    // 写入优化后的内容
    fs.writeFileSync(filePath, content);
    console.log(`✅ 已优化 ${changeCount} 个图片URL`);
  } else {
    console.log(`ℹ️  没有找到需要优化的图片URL`);
  }
}

function main() {
  console.log('🚀 开始批量优化图片URL...\n');

  let totalOptimized = 0;

  FILES_TO_PROCESS.forEach(filePath => {
    const beforeContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    const beforeMatches = (beforeContent.match(/https:\/\/rainmorime-1315830626\.cos\.ap-beijing\.myqcloud\.com/g) || []).length;
    
    optimizeFile(filePath);
    
    const afterContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    const afterMatches = (afterContent.match(/https:\/\/rainmorime-1315830626\.cos\.ap-beijing\.myqcloud\.com[^'"?\s]+\?imageMogr2/g) || []).length;
    
    const optimized = afterMatches;
    totalOptimized += optimized;
    
    console.log(`📊 ${filePath}: ${optimized} 个图片已优化\n`);
  });

  console.log(`🎉 批量优化完成！`);
  console.log(`📊 总计优化: ${totalOptimized} 个图片URL`);
  console.log(`💾 预期节省流量: 30-50%`);
  console.log(`\n💡 提示: 如果有问题，可以使用 .backup 文件恢复`);
}

// 执行脚本
if (require.main === module) {
  main();
}

module.exports = { optimizeFile }; 