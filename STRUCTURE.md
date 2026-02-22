# 项目结构说明

```
github-key-system/
│
├── .github/
│   └── workflows/
│       └── generate-keys.yml      # GitHub Actions 工作流 - 卡密生成
│
├── docs/                          # GitHub Pages 目录
│   ├── index.html                 # 卡密验证页面
│   ├── keys.json                  # 卡密数据文件
│   └── keys.txt                   # 卡密纯文本列表（自动生成）
│
├── scripts/                       # 辅助脚本
│   ├── generate-keys.js           # 本地卡密生成脚本
│   └── verify-key.js              # 本地卡密验证脚本
│
├── .gitignore                     # Git 忽略文件配置
├── LICENSE                        # 许可证文件
├── package.json                   # Node.js 项目配置
├── PRINCIPLE.md                   # 原理详解文档
├── QUICKSTART.md                  # 快速开始指南
├── README.md                      # 项目主文档
└── STRUCTURE.md                   # 本文件
```

## 文件说明

### `.github/workflows/generate-keys.yml`

GitHub Actions 工作流配置文件，定义了卡密生成的自动化流程。

**主要功能**:
- 接收用户输入参数（数量、前缀、长度）
- 生成随机卡密
- 计算哈希签名
- 保存到仓库
- 生成统计报告

**触发方式**:
- 手动触发（workflow_dispatch）
- 支持 API 调用

### `docs/index.html`

卡密验证系统的前端页面，部署在 GitHub Pages 上。

**主要功能**:
- 卡密输入和格式化
- 本地数据验证
- 使用状态追踪
- 统计信息展示
- 管理员面板（可选）

**技术栈**:
- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript (ES6+)

### `docs/keys.json`

卡密数据存储文件，采用 JSON 格式。

**数据结构**:
```json
[
  {
    "key": "卡密字符串",
    "hash": "哈希签名",
    "createdAt": "创建时间",
    "used": "是否已使用",
    "usedAt": "使用时间",
    "usedBy": "使用者信息"
  }
]
```

### `scripts/generate-keys.js`

本地卡密生成脚本，用于在不使用 GitHub Actions 的情况下生成卡密。

**用法**:
```bash
node scripts/generate-keys.js [数量] [前缀] [长度]
```

**输出文件**:
- `docs/keys.json` - JSON 格式
- `docs/keys.txt` - 纯文本格式
- `docs/keys.csv` - CSV 格式

### `scripts/verify-key.js`

本地卡密验证脚本，用于命令行验证卡密。

**用法**:
```bash
node scripts/verify-key.js <卡密>
```

**功能**:
- 验证卡密是否存在
- 检查使用状态
- 标记为已使用
- 显示统计信息

### `package.json`

Node.js 项目配置文件。

**脚本命令**:
- `npm run generate` - 运行生成脚本
- `npm run verify` - 运行验证脚本

### 文档文件

| 文件 | 说明 | 目标读者 |
|------|------|----------|
| README.md | 项目主文档，包含完整使用说明 | 所有用户 |
| QUICKSTART.md | 快速开始指南，5 分钟上手 | 新用户 |
| PRINCIPLE.md | 原理详解，深入技术细节 | 开发者 |
| STRUCTURE.md | 项目结构说明 | 贡献者 |

## 数据流

```
生成阶段:
GitHub Actions ──▶ 生成卡密 ──▶ 保存到 keys.json ──▶ 提交到仓库

验证阶段:
用户访问 Pages ──▶ 加载 keys.json ──▶ 验证卡密 ──▶ 更新状态
```

## 扩展建议

### 添加后端服务

```
github-key-system/
├── backend/
│   ├── server.js          # Express 服务器
│   ├── routes/
│   │   ├── keys.js        # 卡密 API
│   │   └── verify.js      # 验证 API
│   └── models/
│       └── Key.js         # 数据模型
```

### 添加数据库支持

```
github-key-system/
├── database/
│   ├── schema.sql         # 数据库结构
│   └── migrations/        # 迁移文件
```

### 添加测试

```
github-key-system/
├── tests/
│   ├── unit/
│   │   ├── generate.test.js
│   │   └── verify.test.js
│   └── integration/
│       └── api.test.js
```

## 配置文件

### GitHub Actions 配置

工作流参数（在 `.github/workflows/generate-keys.yml` 中定义）:

```yaml
inputs:
  count:
    description: '生成卡密数量'
    required: true
    default: '10'
  prefix:
    description: '卡密前缀'
    required: false
    default: ''
  length:
    description: '卡密长度'
    required: true
    default: '16'
```

### 前端配置

在 `docs/index.html` 中修改:

```javascript
const CONFIG = {
    owner: '你的GitHub用户名',
    repo: '你的仓库名',
    branch: 'main',
    enableRealtime: false
};
```

## 环境变量

| 变量名 | 说明 | 位置 |
|--------|------|------|
| `KEY_SECRET` | HMAC 签名密钥 | GitHub Secrets |
| `KEY_SECRET` | HMAC 签名密钥 | 本地环境变量（可选） |

## 依赖关系

```
generate-keys.yml
    ├── Node.js (GitHub Actions 环境)
    └── KEY_SECRET (GitHub Secrets)

index.html
    ├── keys.json (数据文件)
    └── 浏览器环境

generate-keys.js (本地)
    ├── Node.js
    └── KEY_SECRET (环境变量)
```

## 版本控制

建议的提交信息格式:

```
Generate X license keys [skip ci]
Update frontend styling
Fix verification bug
Add new features
```

使用 `[skip ci]` 可以跳过不必要的 Actions 运行。
