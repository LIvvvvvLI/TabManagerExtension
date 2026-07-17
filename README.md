# Tab Manager - VS Code 标签页管理器

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-1.92.0%2B-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

Tab Manager 通过一个可搜索的 QuickPick 列表集中展示当前窗口中的编辑器标签页，支持快速切换、单项关闭和多选批量关闭。

> This is a VS Code extension developed based on GLM-5 (all code is AI-generated).

## 功能

- 展示文本、Diff、自定义编辑器、Notebook、Webview、编辑器终端及其他标签页。
- 按文件名、相对路径或完整 URI 搜索。
- 切换文本、Diff、自定义编辑器和 Notebook，并尽量保留原编辑器组和预览状态。
- 通过列表项按钮关闭单个标签页，或勾选多个标签页后按 `Enter` 批量关闭。
- 批量关闭包含未保存内容的标签页前显示确认提示。
- 在列表打开期间同步标签页增删、状态变化、编辑器组变化和扩展设置变化。
- VS Code 1.108 及以上版本直接使用当前文件图标主题，文件图标与资源管理器和编辑器标签保持一致。
- VS Code 1.92–1.107 根据文件名和扩展名显示代码、配置、文档、媒体、压缩包、数据库等类别图标。

## 安装

本项目的 VSIX 由服务器工作流生成，不要求在本地安装依赖、编译或打包。

1. 在代码托管平台中手动运行 `Build Extension Artifact` 工作流。
2. 从工作流的 `tab-manager-extension` Artifact 下载压缩包。
3. 解压得到 `.vsix` 文件。
4. 在 VS Code 中打开命令面板，执行 `Extensions: Install from VSIX...`。
5. 选择 `.vsix` 文件并按提示重新加载窗口。

也可以在取得 VSIX 后执行：

```bash
code --install-extension <extension-file>.vsix
```

更完整的安装与服务器发布说明见 [INSTALL.md](INSTALL.md)。

## 使用

通过以下任一方式打开标签页管理器：

- 点击编辑器标题栏右侧的列表图标。
- Windows/Linux：`Ctrl+Alt+T`。
- macOS：`Cmd+Alt+T`。
- 从命令面板执行“显示所有标签页”。

列表操作：

- 未勾选项目时，选中一个项目并按 `Enter` 切换到对应标签页。
- 点击箭头按钮切换到对应标签页。
- 点击关闭按钮关闭单个标签页。
- 勾选一个或多个项目后按 `Enter` 批量关闭。
- 输入文字可按标签名和已显示路径过滤。
- 按 `Esc` 关闭列表。

### 标签类型限制

VS Code 的公共扩展 API 不会为编辑器区中的 Webview 和终端提供可恢复的资源句柄。这些标签仍会显示并支持关闭，但不会显示切换按钮；需要在编辑器区域中直接打开它们。

文件图标主题的 QuickPick 资源解析能力从 VS Code 1.108 开始提供。旧版本仍可安装本扩展，但列表使用内置的文件类别图标作为兼容回退。

## 配置

在 VS Code 设置中搜索 `Tab Manager`：

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---:|---|
| `tabManager.showRelativePath` | boolean | `true` | 在文件名右侧显示相对路径 |
| `tabManager.showAbsolutePath` | boolean | `false` | 在文件名下方显示完整路径或 URI |

```json
{
  "tabManager.showRelativePath": true,
  "tabManager.showAbsolutePath": false
}
```

## 服务器构建与发布

`.github/workflows/build-artifact.yml` 是项目唯一约定的构建与分发入口：

- 默认生成保留 30 天的 VSIX Artifact。
- 手动启用 `create_release` 时，同时创建附带 VSIX 的草稿 Release。
- 草稿 Release 不会自动公开，仍需仓库维护者审核后手动发布。

`package.json` 中的发布者、仓库、主页和反馈地址有意使用占位符。实际值应只在受控的私有发布环境中替换或注入，不应提交隐私信息到公开源码。

## 项目结构

```text
.
├── .github/workflows/build-artifact.yml  # 服务器构建与分发
├── resources/                            # 扩展图标
├── src/extension.ts                      # 扩展入口
├── src/tabManager.ts                     # 标签页管理逻辑
├── .vscodeignore                         # VSIX 内容排除规则
├── package.json                          # 扩展清单
└── tsconfig.json                         # TypeScript 配置
```

## 贡献与许可

贡献约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。项目采用 [MIT License](LICENSE)。

问题反馈地址保留为占位链接：[Issues](https://github.com/your-username/vscode-tab-manager/issues)。
