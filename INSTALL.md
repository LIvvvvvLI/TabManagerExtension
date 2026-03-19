# VSCode Tab Manager 插件安装指南

## 快速安装

### 方法一：直接安装（推荐）

1. 打开终端，进入插件目录：
   ```bash
   cd /home/z/my-project/download/vscode-tab-manager
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 编译 TypeScript：
   ```bash
   npm run compile
   ```

4. 打包扩展：
   ```bash
   npm run package
   ```
   > 如果提示找不到 vsce 命令，请先全局安装：
   > ```bash
   > npm install -g @vscode/vsce
   > ```

5. 在 VSCode 中安装：
   - 按 `Ctrl/Cmd + Shift + P` 打开命令面板
   - 输入 "Install from VSIX"
   - 选择生成的 `.vsix` 文件

### 方法二：开发模式调试

1. 在 VSCode 中打开插件目录：
   ```bash
   code /home/z/my-project/download/vscode-tab-manager
   ```

2. 按 `F5` 启动调试，会打开一个新的 VSCode 窗口

3. 在新窗口中测试插件功能

## 使用方法

### 打开标签页管理器

有三种方式：

1. **点击按钮**：在编辑器标签栏右侧点击列表图标
2. **快捷键**：`Ctrl + Alt + T` (Windows/Linux) 或 `Cmd + Alt + T` (macOS)
3. **命令面板**：按 `Ctrl/Cmd + Shift + P`，输入 "显示所有标签页"

### 操作标签页

- **选择标签页**：点击选择，支持多选
- **关闭单个**：点击标签页右侧的 × 按钮
- **批量关闭**：选择多个后按 Enter

### 右键菜单功能

在编辑器标签页上右键可以：
- 关闭除当前外的所有标签页
- 关闭右侧所有标签页
- 关闭左侧所有标签页

## 配置选项

在 VSCode 设置中搜索 "Tab Manager"：

```json
{
    "tabManager.showPath": true,      // 显示文件路径
    "tabManager.groupByFolder": false, // 按文件夹分组
    "tabManager.maxVisibleItems": 20   // 最大显示数量
}
```

## 项目结构

```
vscode-tab-manager/
├── src/
│   ├── extension.ts      # 扩展入口
│   ├── tabManager.ts     # 核心功能实现
│   └── test/             # 测试文件
├── resources/
│   └── icon.svg          # 扩展图标
├── package.json          # 扩展配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 说明文档
```

## 常见问题

### Q: 安装后看不到按钮？

A: 请确保：
1. 扩展已正确安装并启用
2. 至少打开了一个编辑器文件
3. 尝试重启 VSCode

### Q: 快捷键不生效？

A: 检查是否有其他扩展占用了相同的快捷键，可以在 VSCode 快捷键设置中修改。

### Q: 如何卸载？

A: 在 VSCode 扩展面板中找到 "Tab Manager"，点击卸载即可。
