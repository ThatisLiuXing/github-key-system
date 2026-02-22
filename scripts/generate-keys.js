#!/usr/bin/env node

/**
 * 本地卡密生成脚本
 * 用法: node generate-keys.js [数量] [前缀] [长度]
 * 示例: node generate-keys.js 10 VIP 16
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 默认配置
const DEFAULT_COUNT = 10;
const DEFAULT_PREFIX = '';
const DEFAULT_LENGTH = 16;

// 从命令行参数获取配置
const count = parseInt(process.argv[2]) || DEFAULT_COUNT;
const prefix = process.argv[3] || DEFAULT_PREFIX;
const length = parseInt(process.argv[4]) || DEFAULT_LENGTH;

// 密钥（应该从环境变量获取）
const secretKey = process.env.KEY_SECRET || 'default-secret-key-change-in-production';

/**
 * 生成随机卡密
 * @param {string} prefix - 卡密前缀
 * @param {number} length - 卡密长度
 * @returns {string} 生成的卡密
 */
function generateKey(prefix, length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = prefix;
    const keyLength = length - prefix.length;
    
    for (let i = 0; i < keyLength; i++) {
        if (i > 0 && i % 4 === 0) {
            key += '-';
        }
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return key;
}

/**
 * 创建卡密哈希
 * @param {string} key - 卡密
 * @returns {string} 哈希值
 */
function createHash(key) {
    return crypto.createHmac('sha256', secretKey).update(key).digest('hex').substring(0, 16);
}

/**
 * 生成指定数量的卡密
 * @param {number} count - 数量
 * @param {string} prefix - 前缀
 * @param {number} length - 长度
 * @returns {Array} 卡密数组
 */
function generateKeys(count, prefix, length) {
    const keys = [];
    const timestamp = new Date().toISOString();
    const existingKeys = new Set();
    
    let generated = 0;
    let attempts = 0;
    const maxAttempts = count * 100; // 防止无限循环
    
    while (generated < count && attempts < maxAttempts) {
        const key = generateKey(prefix, length);
        
        // 确保不重复
        if (!existingKeys.has(key)) {
            existingKeys.add(key);
            const hash = createHash(key);
            
            keys.push({
                key: key,
                hash: hash,
                createdAt: timestamp,
                used: false,
                usedAt: null,
                usedBy: null
            });
            
            generated++;
        }
        
        attempts++;
    }
    
    if (generated < count) {
        console.warn(`警告: 只生成了 ${generated}/${count} 个卡密（可能存在重复）`);
    }
    
    return keys;
}

/**
 * 保存卡密到文件
 * @param {Array} keys - 卡密数组
 * @param {string} outputDir - 输出目录
 */
function saveKeys(keys, outputDir) {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 读取现有卡密
    const keysFile = path.join(outputDir, 'keys.json');
    let existingKeys = [];
    
    if (fs.existsSync(keysFile)) {
        try {
            existingKeys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
            console.log(`读取到 ${existingKeys.length} 个现有卡密`);
        } catch (error) {
            console.warn('读取现有卡密失败:', error.message);
        }
    }
    
    // 合并卡密
    const allKeys = [...existingKeys, ...keys];
    
    // 保存 JSON 格式
    fs.writeFileSync(keysFile, JSON.stringify(allKeys, null, 2));
    console.log(`✓ 卡密已保存到: ${keysFile}`);
    
    // 保存纯文本格式
    const txtFile = path.join(outputDir, 'keys.txt');
    const keyList = keys.map(k => k.key).join('\n');
    fs.writeFileSync(txtFile, keyList);
    console.log(`✓ 卡密列表已保存到: ${txtFile}`);
    
    // 保存 CSV 格式
    const csvFile = path.join(outputDir, 'keys.csv');
    const csvContent = [
        'Key,Hash,Created At,Used,Used At',
        ...keys.map(k => `${k.key},${k.hash},${k.createdAt},${k.used},${k.usedAt || ''}`)
    ].join('\n');
    fs.writeFileSync(csvFile, csvContent);
    console.log(`✓ CSV 格式已保存到: ${csvFile}`);
}

/**
 * 打印统计信息
 * @param {Array} keys - 卡密数组
 */
function printStats(keys) {
    console.log('\n========== 生成统计 ==========');
    console.log(`生成数量: ${keys.length}`);
    console.log(`前缀: ${prefix || '无'}`);
    console.log(`长度: ${length}`);
    console.log(`时间: ${new Date().toLocaleString()}`);
    console.log('\n生成的卡密:');
    keys.forEach((k, i) => {
        console.log(`  ${i + 1}. ${k.key}`);
    });
    console.log('==============================\n');
}

// 主函数
function main() {
    console.log('\n🚀 开始生成卡密...\n');
    
    // 生成卡密
    const keys = generateKeys(count, prefix, length);
    
    // 打印统计
    printStats(keys);
    
    // 保存到文件
    const outputDir = path.join(__dirname, '..', 'docs');
    saveKeys(keys, outputDir);
    
    console.log('✅ 卡密生成完成!\n');
}

// 运行
main();
