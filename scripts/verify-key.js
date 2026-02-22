#!/usr/bin/env node

/**
 * 本地卡密验证脚本
 * 用法: node verify-key.js <卡密>
 * 示例: node verify-key.js DEMO-1234-5678-ABCD
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 密钥
const secretKey = process.env.KEY_SECRET || 'default-secret-key-change-in-production';

/**
 * 加载卡密数据
 * @returns {Array} 卡密数组
 */
function loadKeys() {
    const keysFile = path.join(__dirname, '..', 'docs', 'keys.json');
    
    if (!fs.existsSync(keysFile)) {
        console.error('❌ 错误: 找不到卡密数据文件');
        process.exit(1);
    }
    
    try {
        const data = fs.readFileSync(keysFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ 错误: 读取卡密数据失败:', error.message);
        process.exit(1);
    }
}

/**
 * 验证卡密
 * @param {string} inputKey - 输入的卡密
 * @param {Array} keys - 卡密数组
 * @returns {Object} 验证结果
 */
function verifyKey(inputKey, keys) {
    // 格式化输入（移除多余字符，统一格式）
    const formattedKey = inputKey.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // 查找卡密
    const keyData = keys.find(k => {
        const storedKey = k.key.replace(/-/g, '');
        return storedKey === formattedKey;
    });
    
    if (!keyData) {
        return {
            valid: false,
            message: '卡密不存在',
            code: 'NOT_FOUND'
        };
    }
    
    if (keyData.used) {
        return {
            valid: false,
            message: `卡密已被使用（使用时间: ${keyData.usedAt}）`,
            code: 'ALREADY_USED',
            data: keyData
        };
    }
    
    // 验证哈希（可选）
    const expectedHash = crypto.createHmac('sha256', secretKey).update(keyData.key).digest('hex').substring(0, 16);
    if (keyData.hash !== expectedHash) {
        return {
            valid: false,
            message: '卡密校验失败（数据可能被篡改）',
            code: 'HASH_MISMATCH'
        };
    }
    
    return {
        valid: true,
        message: '卡密验证成功',
        code: 'SUCCESS',
        data: keyData
    };
}

/**
 * 标记卡密为已使用
 * @param {string} key - 卡密
 * @param {Array} keys - 卡密数组
 */
function markAsUsed(key, keys) {
    const keyData = keys.find(k => k.key === key);
    if (keyData) {
        keyData.used = true;
        keyData.usedAt = new Date().toISOString();
        keyData.usedBy = {
            userAgent: 'Node.js CLI',
            timestamp: new Date().toISOString()
        };
        
        // 保存更新
        const keysFile = path.join(__dirname, '..', 'docs', 'keys.json');
        fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
    }
}

/**
 * 打印验证结果
 * @param {Object} result - 验证结果
 */
function printResult(result) {
    console.log('\n========== 验证结果 ==========');
    
    if (result.valid) {
        console.log('✅ 状态: 验证成功');
        console.log(`📝 消息: ${result.message}`);
        console.log(`🔑 卡密: ${result.data.key}`);
        console.log(`📅 创建时间: ${result.data.createdAt}`);
        console.log(`#️⃣  哈希: ${result.data.hash}`);
    } else {
        console.log('❌ 状态: 验证失败');
        console.log(`📝 消息: ${result.message}`);
        console.log(`🔢 错误码: ${result.code}`);
        
        if (result.data) {
            console.log(`📅 使用时间: ${result.data.usedAt}`);
        }
    }
    
    console.log('==============================\n');
}

/**
 * 打印使用统计
 * @param {Array} keys - 卡密数组
 */
function printStats(keys) {
    const total = keys.length;
    const used = keys.filter(k => k.used).length;
    const available = total - used;
    
    console.log('========== 使用统计 ==========');
    console.log(`📊 总卡密: ${total}`);
    console.log(`✅ 已使用: ${used}`);
    console.log(`🆓 可用: ${available}`);
    console.log('==============================\n');
}

// 主函数
function main() {
    const inputKey = process.argv[2];
    
    if (!inputKey) {
        console.log('\n用法: node verify-key.js <卡密>');
        console.log('示例: node verify-key.js DEMO-1234-5678-ABCD\n');
        
        // 显示统计
        const keys = loadKeys();
        printStats(keys);
        return;
    }
    
    console.log(`\n🔍 正在验证卡密: ${inputKey}\n`);
    
    // 加载卡密数据
    const keys = loadKeys();
    
    // 验证卡密
    const result = verifyKey(inputKey, keys);
    
    // 打印结果
    printResult(result);
    
    // 如果验证成功，询问是否标记为已使用
    if (result.valid && result.code === 'SUCCESS') {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('是否标记为已使用? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                markAsUsed(result.data.key, keys);
                console.log('✅ 已标记为已使用\n');
            }
            rl.close();
        });
    }
}

// 运行
main();
