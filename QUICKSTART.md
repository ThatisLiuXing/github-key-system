# 快速开始指南

本指南将帮助你在 5 分钟内搭建并运行卡密系统。

## 前置条件

- GitHub 账号
- 基本的 Git 知识（可选）

## 步骤 1: 创建仓库 (1 分钟)

1. 登录 [GitHub](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 填写信息:
   - **Repository name**: `license-key-system`（或其他名称）
   - **Description**: 可选，例如 "卡密生成与验证系统"
   - **Public** 或 **Private**: 根据需要选择
   - ✅ **Add a README file**: 勾选
4. 点击 **Create repository**

## 步骤 2: 添加密钥 (1 分钟)

1. 进入刚创建的仓库
2. 点击 **Settings** 标签
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 填写:
   - **Name**: `KEY_SECRET`
   - **Value**: 输入一个强密码（例如随机生成的 32 位字符串）
6. 点击 **Add secret**

> 💡 **提示**: 可以使用在线密码生成器生成强密码

## 步骤 3: 上传文件 (2 分钟)

### 方式 A: 通过网页上传

1. 在仓库页面点击 **Add file** → **Upload files**
2. 创建目录结构:
   - 创建 `.github/workflows/` 目录
   - 创建 `docs/` 目录
3. 上传以下文件:
   - [`.github/workflows/generate-keys.yml`](.github/workflows/generate-keys.yml)
   - [`docs/index.html`](docs/index.html)
   - [`docs/keys.json`](docs/keys.json)
4. 点击 **Commit changes**

### 方式 B: 通过 Git 命令行

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# 创建目录
mkdir -p .github/workflows docs

# 复制文件（假设你已下载了项目文件）
cp /path/to/generate-keys.yml .github/workflows/
cp /path/to/index.html docs/
cp /path/to/keys.json docs/

# 提交并推送
git add .
git commit -m "Initial commit: Add key system files"
git push origin main
```

## 步骤 4: 启用 GitHub Pages (1 分钟)

1. 进入仓库 **Settings**
2. 左侧菜单选择 **Pages**
3. 配置:
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `master`，文件夹选择 `/docs`
4. 点击 **Save**
5. 等待 1-2 分钟，页面会显示访问链接，例如:
   ```
   https://your-username.github.io/your-repo-name
   ```

## 步骤 5: 生成卡密 (1 分钟)

1. 进入仓库 **Actions** 页面
2. 选择 **Generate License Keys** 工作流
3. 点击 **Run workflow** 下拉按钮
4. 填写参数:
   - **count**: `10`（生成数量）
   - **prefix**: 留空或输入前缀，如 `VIP`
   - **length**: `16`（卡密长度）
5. 点击 **Run workflow**
6. 等待工作流完成（约 30 秒）

## 验证系统

### 访问验证页面

打开浏览器，访问你的 GitHub Pages 链接:
```
https://your-username.github.io/your-repo-name
```

### 测试验证

1. 在输入框中输入一个生成的卡密
2. 点击 **验证卡密**
3. 查看验证结果

### 查看生成的卡密

1. 进入仓库页面
2. 打开 `docs/keys.json` 文件
3. 查看生成的卡密列表

## 常见问题

### Q: GitHub Pages 链接无法访问？

**A**: 
- 确认 Pages 设置已保存
- 等待 1-2 分钟让部署完成
- 检查仓库是否为 Public（Private 仓库需要登录）

### Q: Actions 工作流运行失败？

**A**:
- 检查是否正确添加了 `KEY_SECRET`
- 查看 Actions 日志获取详细错误信息
- 确认文件路径正确

### Q: 如何修改页面样式？

**A**: 直接编辑 `docs/index.html` 文件中的 CSS 部分。

### Q: 如何批量生成更多卡密？

**A**: 重新运行 Actions 工作流，修改 `count` 参数即可。

## 下一步

- 阅读 [完整文档](README.md) 了解更多功能
- 查看 [原理介绍](PRINCIPLE.md) 深入了解系统
- 自定义卡密格式和验证逻辑
- 添加更多安全措施

## 获取帮助

- 提交 [Issue](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/issues)
- 查看 [常见问题](README.md#常见问题)

---

🎉 **恭喜！** 你的卡密系统已经运行起来了！
