# Contributing to Tab Manager

感谢你考虑为 Tab Manager 做出贡献！🎉

## 🤔 如何贡献

### 报告 Bug

如果你发现了 bug，请：

1. 在 [Issues](../../issues) 中搜索是否已有相同问题
2. 如果没有，创建新的 Issue，包含：
   - 清晰的标题
   - 复现步骤
   - 预期行为
   - 实际行为
   - VSCode 版本
   - 操作系统
   - 截图（如果有帮助）

### 提出新功能

1. 在 [Issues](../../issues) 中搜索是否已有类似建议
2. 创建新的 Feature Request Issue，包含：
   - 功能描述
   - 使用场景
   - 可能的实现方式（可选）

### 提交代码

1. **Fork 仓库**
   ```bash
   git clone https://github.com/your-username/vscode-tab-manager.git
   cd vscode-tab-manager
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **进行开发**
   ```bash
   # 编译
   npm run compile
   
   # 监听模式
   npm run watch
   
   # 代码检查
   npm run lint
   ```

5. **测试**
   - 按 F5 在 VSCode 中启动调试
   - 测试你的更改

6. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加某某功能"
   # 或
   git commit -m "fix: 修复某某问题"
   ```

7. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   然后在 GitHub 上创建 Pull Request

## 📝 代码规范

### 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 新功能
fix: bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试
build: 构建
ci: CI 配置
chore: 其他
```

### 代码风格

- 使用 TypeScript
- 遵循 ESLint 规则
- 添加必要的注释
- 保持函数简洁

### 分支命名

- `feature/xxx` - 新功能
- `fix/xxx` - bug 修复
- `docs/xxx` - 文档更新
- `refactor/xxx` - 重构

## 📋 PR 检查清单

- [ ] 代码编译通过 (`npm run compile`)
- [ ] 代码检查通过 (`npm run lint`)
- [ ] 功能测试通过
- [ ] 提交信息符合规范
- [ ] 更新了相关文档

## 🙏 感谢

感谢所有贡献者的付出！
