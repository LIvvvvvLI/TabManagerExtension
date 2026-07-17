# Tab Manager 安装与服务器分发指南

## 获取 VSIX

本项目不要求在本地安装依赖、编译、测试、打包或部署。可安装的 VSIX 统一由服务器工作流生成。

1. 打开代码托管平台的 Actions/工作流页面。
2. 选择 `Build Extension Artifact`。
3. 手动运行工作流；仅需要安装包时保持 `create_release` 为关闭状态。
4. 工作流完成后下载 `tab-manager-extension` Artifact。
5. 解压压缩包，得到名称形如 `tab-manager-<version>.vsix` 的文件。

Artifact 默认保留 30 天。

## 安装 VSIX

### 从 VS Code 安装

1. 打开命令面板：`Ctrl/Cmd+Shift+P`。
2. 执行 `Extensions: Install from VSIX...`。
3. 选择下载并解压后的 `.vsix` 文件。
4. 按提示重新加载 VS Code。

### 从命令行安装

```bash
code --install-extension <extension-file>.vsix
```

## 创建草稿 Release

维护者可以在手动运行服务器工作流时启用 `create_release`。工作流会：

1. 生成版本化 VSIX。
2. 上传工作流 Artifact。
3. 创建以清单版本号命名的草稿 Release。
4. 把 VSIX 附加到草稿 Release。

草稿不会自动公开。维护者应检查版本号、更新日志和安装包后，再在代码托管平台上手动发布。

发布者、仓库地址、主页及问题反馈地址均使用占位符；真实信息只应在受控的私有发布环境中配置。

## 使用

- 点击编辑器标题栏右侧的列表图标。
- Windows/Linux 使用 `Ctrl+Alt+T`，macOS 使用 `Cmd+Alt+T`。
- 也可以从命令面板执行“显示所有标签页”。

在列表中可以搜索、切换、单项关闭，或勾选多个标签页后按 `Enter` 批量关闭。

## 配置

```json
{
  "tabManager.showRelativePath": true,
  "tabManager.showAbsolutePath": false
}
```

## 常见问题

### 安装后看不到标题栏按钮

确认扩展已启用并至少打开了一个编辑器标签页，也可以直接从命令面板执行“显示所有标签页”。

### 快捷键没有响应

在 VS Code 键盘快捷方式设置中检查是否有其他命令占用了相同组合键。

### Webview 或终端没有切换按钮

VS Code 公共扩展 API 没有提供这两类编辑器标签的可恢复资源句柄。它们仍支持在列表中查看和关闭。

### 如何卸载

在扩展面板中找到 Tab Manager，选择卸载并按提示重新加载窗口。
