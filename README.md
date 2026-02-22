# GitHub 卡密系统

一个基于 GitHub Actions 和 GitHub Pages 的轻量级卡密（授权码）生成与验证系统。

## 功能特性

- **自动化生成**: 通过 GitHub Actions 工作流批量生成卡密
- **在线验证**: 通过 GitHub Pages 提供前端验证界面
- **数据持久化**: 卡密数据存储在仓库中，便于管理
- **使用追踪**: 记录卡密的生成时间、使用状态和使用时间
- **安全可靠**: 关键数据通过 GitHub Secrets 保护
- **零成本**: 完全基于 GitHub 免费服务

## 系统架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub        │────▶│   GitHub        │────▶│   GitHub        │
│   Actions       │     │   Repository    │     │   Pages         │
│   (生成卡密)     │     │   (存储数据)     │     │   (验证界面)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
   触发工作流                                        用户访问
   批量生成卡密                                      输入卡密验证
```

## 工作原理

### 1. 卡密生成流程

```
用户触发 Actions ──▶ 读取配置参数 ──▶ 生成随机卡密 ──▶ 计算哈希签名
                                              │
                                              ▼
保存到 keys.json ◀── 提交到仓库 ◀── 创建文件 ◀── 添加元数据
```

**核心算法**:
- 卡密格式: `PREFIX-XXXX-XXXX-XXXX-XXXX` (可配置)
- 字符集: 大写字母 A-Z + 数字 0-9
- 哈希算法: HMAC-SHA256 (用于完整性校验)

### 2. 卡密验证流程

```
用户输入卡密 ──▶ 格式化输入 ──▶ 查询本地数据 ──▶ 检查使用状态
                                              │
                    ┌─────────────────────────┘
                    ▼
           未使用 ──▶ 标记为已使用 ──▶ 更新统计
                    │
           已使用 ──▶ 返回错误信息
```

### 3. 数据存储结构

```json
[
  {
    "key": "PROD-A1B2-C3D4-E5F6",
    "hash": "a1b2c3d4e5f67890",
    "createdAt": "2024-01-15T08:30:00.000Z",
    "used": false,
    "usedAt": null,
    "usedBy": null
  }
]
```

## 快速搭建教程

### 步骤 1: 创建仓库

1. 登录 GitHub 账号
2. 点击右上角 **+** → **New repository**
3. 填写仓库名称，例如 `license-key-system`
4. 选择 **Public** 或 **Private**
5. 勾选 **Add a README file**
6. 点击 **Create repository**

### 步骤 2: 添加密钥

1. 进入仓库页面，点击 **Settings**
2. 左侧菜单选择 **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下密钥:
   - **Name**: `KEY_SECRET`
   - **Value**: 输入一个强密码（用于卡密签名）
5. 点击 **Add secret**

### 步骤 3: 创建工作流

1. 在仓库中创建目录 `.github/workflows/`
2. 创建文件 `generate-keys.yml`
3. 复制 [generate-keys.yml](.github/workflows/generate-keys.yml) 内容

### 步骤 4: 创建前端页面

1. 在仓库中创建目录 `docs/`
2. 创建文件 `index.html`
3. 复制 [index.html](docs/index.html) 内容
4. 修改 `index.html` 中的配置:
   ```javascript
   const CONFIG = {
       owner: '你的GitHub用户名',
       repo: '你的仓库名',
       branch: 'main'
   };
   ```

### 步骤 5: 启用 GitHub Pages

1. 进入仓库 **Settings**
2. 左侧菜单选择 **Pages**
3. **Source** 选择 **Deploy from a branch**
4. **Branch** 选择 `main` 或 `master`，文件夹选择 `/docs`
5. 点击 **Save**
6. 等待几分钟，访问显示的链接（如 `https://username.github.io/repo-name`）

### 步骤 6: 生成卡密

1. 进入仓库 **Actions** 页面
2. 选择 **Generate License Keys** 工作流
3. 点击 **Run workflow**
4. 填写参数:
   - **count**: 生成数量（默认 10）
   - **prefix**: 卡密前缀（可选）
   - **length**: 卡密长度（默认 16）
5. 点击 **Run workflow**
6. 等待工作流完成，卡密将自动保存到 `docs/keys.json`

## 使用说明

### 生成卡密

#### 通过 GitHub 界面

1. 进入仓库 Actions 页面
2. 选择 "Generate License Keys"
3. 点击 "Run workflow"
4. 填写参数后运行

#### 通过 API 调用

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/generate-keys.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "count": "50",
      "prefix": "VIP",
      "length": "20"
    }
  }'
```

### 验证卡密

1. 访问 GitHub Pages 链接
2. 在输入框中输入卡密
3. 点击 "验证卡密"
4. 系统将显示验证结果

### 查看统计

页面底部会显示:
- **总卡密**: 生成的卡密总数
- **已使用**: 已被使用的卡密数量
- **可用**: 剩余可用卡密数量

## 配置说明

### 工作流参数

| 参数 | 说明 | 默认值 | 必填 |
|------|------|--------|------|
| count | 生成数量 | 10 | 是 |
| prefix | 卡密前缀 | 空 | 否 |
| length | 卡密长度（不含分隔符） | 16 | 是 |

### 前端配置

在 `index.html` 中修改 `CONFIG` 对象:

```javascript
const CONFIG = {
    // GitHub 用户名
    owner: 'your-username',
    // 仓库名
    repo: 'your-repo',
    // 分支
    branch: 'main',
    // 是否启用实时验证
    enableRealtime: false,
    // GitHub Token（可选）
    githubToken: null
};
```

## 安全建议

### 1. 保护密钥

- ✅ 使用强密码作为 `KEY_SECRET`
- ✅ 定期更换 `KEY_SECRET`
- ❌ 不要将密钥硬编码在代码中
- ❌ 不要将密钥提交到仓库

### 2. 访问控制

- 对于私有仓库，GitHub Pages 也是私有的（需要登录）
- 可以考虑添加额外的身份验证层
- 限制 Actions 的权限范围

### 3. 数据备份

- 定期备份 `keys.json` 文件
- 考虑使用 GitHub Releases 存档重要版本

## 进阶配置

### 自定义卡密格式

修改工作流中的 `generateKey` 函数:

```javascript
function generateKey(prefix, length) {
    // 自定义格式逻辑
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符
    // ... 自定义逻辑
}
```

### 添加过期时间

在生成时添加过期时间:

```javascript
keys.push({
    key: key,
    hash: hash,
    createdAt: timestamp,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后过期
    used: false,
    usedAt: null,
    usedBy: null
});
```

### 批量导入现有卡密

创建导入脚本:

```javascript
const fs = require('fs');

const existingKeys = ['KEY1', 'KEY2', 'KEY3'];
const keys = existingKeys.map(key => ({
    key: key,
    hash: createHash(key),
    createdAt: new Date().toISOString(),
    used: false,
    usedAt: null,
    usedBy: null
}));

fs.writeFileSync('docs/keys.json', JSON.stringify(keys, null, 2));
```

## 常见问题

### Q: 卡密数据安全吗？

A: 卡密以明文形式存储在 `keys.json` 中，但可以通过以下方式增强安全性:
- 使用私有仓库
- 添加额外的加密层
- 限制访问权限

### Q: 可以同时验证多个卡密吗？

A: 当前版本仅支持单个卡密验证。如需批量验证，可以修改前端代码或创建新的工作流。

### Q: 如何重置已使用的卡密？

A: 直接编辑 `docs/keys.json` 文件，将 `used` 字段改为 `false` 即可。

### Q: 支持实时同步吗？

A: 由于 GitHub Pages 是静态托管，前端无法直接写入数据。如需实时同步，需要:
- 使用后端服务器
- 使用 GitHub API 配合 Token
- 使用第三方数据库服务

### Q: 可以自定义页面样式吗？

A: 可以，直接修改 `docs/index.html` 中的 CSS 样式即可。

## 技术栈

- **GitHub Actions**: 自动化工作流
- **GitHub Pages**: 静态网站托管
- **Node.js**: 卡密生成逻辑
- **HTML/CSS/JavaScript**: 前端验证界面
- **Crypto**: HMAC-SHA256 哈希算法

## 贡献指南

欢迎提交 Issue 和 Pull Request!

## 许可证

MIT License

## 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 支持卡密生成和验证
- 基础统计功能
