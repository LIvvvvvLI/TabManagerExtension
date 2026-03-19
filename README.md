# Tab Manager - VSCode 标签页管理器

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![VSCode](https://img.shields.io/badge/VSCode-1.85.0+-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**类似 IntelliJ IDEA 的标签页管理体验，让 VSCode 标签页管理更高效**

[功能特性](#-功能特性) • [安装](#-安装) • [使用方法](#-使用方法) • [配置](#️-配置选项)

</div>

---

`This is a VS Code extension developed based on GLM-5 (all code is AI-generated).`

## 📖 简介

你是否厌倦了 VSCode 中杂乱的标签页？是否羡慕 IntelliJ IDEA 中优雅的标签页管理方式？

**Tab Manager** 为 VSCode 带来了类似 IDEA 的标签页管理体验。通过一个快捷键或点击按钮，即可查看所有打开的标签页，支持多选批量关闭，让标签页管理变得轻松高效。

## ✨ 功能特性

### 🎯 核心功能

| 功能 | 描述 |
|------|------|
| 📋 **标签页列表** | 在可滚动的列表中查看所有打开的标签页 |
| 🎨 **文件图标** | 自动显示文件类型对应的图标，一目了然 |
| ✅ **多选关闭** | 支持同时选择多个标签页批量关闭 |
| ⚡ **快捷操作** | 一键关闭左侧/右侧/其他标签页 |
| 🔍 **搜索过滤** | 支持按文件名、路径搜索过滤 |
| 🔒 **安全提示** | 关闭未保存文件时自动提示确认 |

### 🖼️ 界面预览

```
┌─────────────────────────────────────────────────────────┐
│  📋 选择要关闭的标签页（可多选）                          │
├─────────────────────────────────────────────────────────┤
│  📄  package.json          ──  my-project               │
│  📄  tsconfig.json         ──  my-project               │
│  🔷  extension.ts          ──  src                      │
│  🔷  tabManager.ts         ──  src                      │
│  🔷  fileIconMapper.ts     ──  src                      │
│  📖  README.md             ──  .                        │
│  ⚙️  .eslintrc.json        ──  .                        │
│  ✓📄  tabManager.ts •      ──  src        [当前活动]    │
└─────────────────────────────────────────────────────────┘
```

### 🎨 支持的文件图标

支持 **100+ 种文件类型** 的图标识别：

| 类别 | 文件类型 |
|------|----------|
| **前端** | JavaScript, TypeScript, React, Vue, HTML, CSS, SCSS, Less |
| **后端** | Python, Java, Go, Rust, PHP, Ruby, C#, C/C++ |
| **配置** | JSON, YAML, TOML, .env, package.json, tsconfig.json |
| **文档** | Markdown, PDF, TXT |
| **数据库** | SQL, Prisma, SQLite |
| **其他** | Shell, Docker, Git, 图片, 音视频, 压缩包 |

---

## 📦 安装

### 方式一：VSCode 扩展市场（推荐）

1. 打开 VSCode
2. 按 `Ctrl/Cmd + Shift + X` 打开扩展面板
3. 搜索 **"Tab Manager"**
4. 点击安装

### 方式二：从 VSIX 文件安装

1. 下载 `.vsix` 文件
2. 按 `Ctrl/Cmd + Shift + P` 打开命令面板
3. 输入 **"Install from VSIX"**
4. 选择下载的文件

### 方式三：命令行安装

```bash
code --install-extension tab-manager-2.0.0.vsix
```

---

## 🚀 使用方法

### 打开标签页管理器

| 方式 | 操作 |
|------|------|
| 🖱️ **按钮** | 点击编辑器标题栏右侧的列表图标 |
| ⌨️ **快捷键** | `Ctrl + Alt + T` (Windows/Linux) |
| ⌨️ **快捷键** | `Cmd + Alt + T` (macOS) |
| 📋 **命令面板** | `Ctrl/Cmd + Shift + P` → 输入 "显示所有标签页" |

### 操作标签页

| 操作 | 说明 |
|------|------|
| **选择** | 点击标签页项进行选择，支持多选 |
| **关闭单个** | 点击标签页右侧的 × 按钮 |
| **批量关闭** | 选择多个后按 `Enter` 键 |
| **取消** | 按 `Esc` 键关闭窗口 |

### 右键菜单功能

在编辑器标签页上右键，可以快速：

- 📌 **关闭除当前外的所有标签页**
- ➡️ **关闭右侧所有标签页**
- ⬅️ **关闭左侧所有标签页**

---

## ⚙️ 配置选项

在 VSCode 设置中搜索 **"Tab Manager"** 进行配置：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `tabManager.showPath` | boolean | `true` | 是否显示文件路径 |
| `tabManager.groupByFolder` | boolean | `false` | 是否按文件夹分组 |
| `tabManager.maxVisibleItems` | number | `20` | 最大显示数量 |

### 配置示例

```json
{
  "tabManager.showPath": true,
  "tabManager.groupByFolder": false,
  "tabManager.maxVisibleItems": 20
}
```

---

## 🔑 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + Alt + T` (Win/Linux) | 打开标签页管理器 |
| `Cmd + Alt + T` (macOS) | 打开标签页管理器 |
| `↑` `↓` | 在列表中导航 |
| `Space` | 多选/取消选择 |
| `Enter` | 关闭选中的标签页 |
| `Esc` | 取消并关闭窗口 |

---

## 📝 更新日志

### v2.0.0 (2024-03-19)

- ✨ **新增**：文件类型图标显示，支持 100+ 种文件类型
- ✨ **新增**：`fileIconMapper.ts` 图标映射模块
- 🎨 **优化**：界面视觉效果提升

### v1.0.0 (2024-01-01)

- 🎉 首次发布
- ✅ 标签页列表显示
- ✅ 多选批量关闭
- ✅ 快捷操作支持

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 💬 反馈与支持

- 🐛 [报告问题](https://github.com/your-username/vscode-tab-manager/issues)
- 💡 [功能建议](https://github.com/your-username/vscode-tab-manager/issues)
- ⭐ 如果这个项目对你有帮助，欢迎 Star 支持！

---

<div align="center">

**Made with ❤️ for VSCode users**

</div>