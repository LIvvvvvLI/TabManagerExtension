# Contributing to Tab Manager

感谢你为 Tab Manager 提交问题、文档或代码改进。

## 报告问题

提交 Issue 前请先搜索是否已有相同问题。新 Issue 建议包含：

- 清晰的问题描述和复现步骤。
- 预期行为与实际行为。
- VS Code 版本和操作系统。
- 涉及的标签类型，例如文本、Diff、Notebook、Webview 或终端。
- 必要时提供已脱敏的截图或日志。

问题地址使用占位符：`https://github.com/your-username/vscode-tab-manager/issues`。

## 提交改动

1. Fork 或克隆仓库。仓库地址在公开文档中保持为占位符：

   ```bash
   git clone https://github.com/your-username/vscode-tab-manager.git
   cd vscode-tab-manager
   ```

2. 创建分支：

   ```bash
   git checkout -b feature/short-description
   ```

3. 修改代码或文档，确保功能说明与实际行为一致。
4. 提交并推送分支，然后创建 Pull Request。

本项目不要求贡献者在本地安装依赖、编译、测试、打包或部署。VSIX 由服务器工作流统一生成。

## 代码与文档约定

- 使用 TypeScript，并保持严格、清晰的类型处理。
- 优先使用 VS Code 公共扩展 API，不依赖未公开的内部命令。
- 新增设置时同时更新 `package.json`、README 和安装指南。
- 新增或删除功能时同步更新 README 和 CHANGELOG。
- 不提交真实发布者 ID、私有仓库地址、主页、反馈地址、令牌或其他隐私信息。
- 发布相关字段统一使用明确的占位符，真实值仅在受控发布环境中配置。

## 提交信息

建议遵循 Conventional Commits：

```text
feat: add a feature
fix: correct a bug
docs: update documentation
refactor: restructure code
perf: improve performance
build: update server build configuration
ci: update workflow
chore: maintenance
```

## Pull Request 检查清单

- [ ] 改动范围明确，没有包含无关文件。
- [ ] 功能描述与当前实现一致。
- [ ] 相关 README、安装说明或更新日志已同步。
- [ ] 没有提交令牌、真实发布身份或其他隐私信息。
- [ ] 提交信息清晰，便于服务器端生成发布说明。
