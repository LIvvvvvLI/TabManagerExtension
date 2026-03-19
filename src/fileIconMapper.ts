import * as vscode from 'vscode';
import * as path from 'path';

/**
 * 文件图标映射器
 * 根据文件扩展名返回对应的 VSCode ThemeIcon
 * 
 * 优先使用 ThemeIcon.File API（VSCode 1.92+）获取真实的文件图标
 * 对于旧版本，使用 Codicon 图标作为后备方案
 */
export class FileIconMapper {
    
    /**
     * 检查 ThemeIcon.File API 是否可用
     */
    private static hasFileIconApi(): boolean {
        return typeof (vscode.ThemeIcon as any).File === 'function';
    }

    /**
     * 文件扩展名到 Codicon 图标的映射（后备方案）
     */
    private static readonly extensionIconMap: Map<string, string> = new Map([
        // JavaScript/TypeScript
        ['.js', 'symbol-method'],
        ['.mjs', 'symbol-method'],
        ['.cjs', 'symbol-method'],
        ['.jsx', 'symbol-method'],
        ['.ts', 'symbol-method'],
        ['.tsx', 'symbol-method'],
        ['.mts', 'symbol-method'],
        ['.cts', 'symbol-method'],
        
        // JSON
        ['.json', 'json'],
        ['.jsonc', 'json'],
        ['.json5', 'json'],
        
        // HTML
        ['.html', 'file-code'],
        ['.htm', 'file-code'],
        ['.xhtml', 'file-code'],
        
        // CSS/Style
        ['.css', 'symbol-color'],
        ['.scss', 'symbol-color'],
        ['.sass', 'symbol-color'],
        ['.less', 'symbol-color'],
        ['.styl', 'symbol-color'],
        
        // Vue/Svelte/Astro
        ['.vue', 'symbol-method'],
        ['.svelte', 'symbol-method'],
        ['.astro', 'symbol-method'],
        
        // Python
        ['.py', 'symbol-method'],
        ['.pyw', 'symbol-method'],
        ['.pyi', 'symbol-method'],
        ['.pyx', 'symbol-method'],
        
        // Java
        ['.java', 'symbol-method'],
        ['.class', 'file-binary'],
        
        // Kotlin
        ['.kt', 'symbol-method'],
        ['.kts', 'symbol-method'],
        
        // Scala
        ['.scala', 'symbol-method'],
        ['.sc', 'symbol-method'],
        
        // Groovy
        ['.groovy', 'symbol-method'],
        
        // C/C++
        ['.c', 'symbol-method'],
        ['.cpp', 'symbol-method'],
        ['.cc', 'symbol-method'],
        ['.cxx', 'symbol-method'],
        ['.h', 'symbol-method'],
        ['.hpp', 'symbol-method'],
        ['.hxx', 'symbol-method'],
        
        // C#
        ['.cs', 'symbol-method'],
        
        // Go
        ['.go', 'symbol-method'],
        
        // Rust
        ['.rs', 'symbol-method'],
        
        // PHP
        ['.php', 'symbol-method'],
        ['.phtml', 'symbol-method'],
        
        // Ruby
        ['.rb', 'symbol-method'],
        ['.rake', 'symbol-method'],
        
        // Swift
        ['.swift', 'symbol-method'],
        
        // Objective-C
        ['.m', 'symbol-method'],
        ['.mm', 'symbol-method'],
        
        // Other Languages
        ['.lua', 'symbol-method'],
        ['.r', 'symbol-method'],
        ['.jl', 'symbol-method'],
        ['.ex', 'symbol-method'],
        ['.exs', 'symbol-method'],
        ['.erl', 'symbol-method'],
        ['.hrl', 'symbol-method'],
        ['.hs', 'symbol-method'],
        ['.ml', 'symbol-method'],
        ['.mli', 'symbol-method'],
        ['.fs', 'symbol-method'],
        ['.fsi', 'symbol-method'],
        ['.fsx', 'symbol-method'],
        ['.clj', 'symbol-method'],
        ['.cljs', 'symbol-method'],
        ['.dart', 'symbol-method'],
        ['.vim', 'symbol-method'],
        
        // Shell scripts
        ['.sh', 'terminal'],
        ['.bash', 'terminal'],
        ['.zsh', 'terminal'],
        ['.bat', 'terminal'],
        ['.cmd', 'terminal'],
        ['.ps1', 'terminal'],
        ['.psm1', 'terminal'],
        ['.psd1', 'terminal'],
        
        // Config files
        ['.yaml', 'settings-gear'],
        ['.yml', 'settings-gear'],
        ['.xml', 'file-code'],
        ['.toml', 'settings-gear'],
        ['.ini', 'settings-gear'],
        ['.conf', 'settings-gear'],
        ['.config', 'settings-gear'],
        ['.cfg', 'settings-gear'],
        ['.properties', 'settings-gear'],
        
        // Database
        ['.sql', 'database'],
        ['.db', 'database'],
        ['.sqlite', 'database'],
        ['.sqlite3', 'database'],
        ['.prisma', 'database'],
        
        // Documentation
        ['.md', 'book'],
        ['.markdown', 'book'],
        ['.mdx', 'book'],
        ['.rst', 'book'],
        ['.txt', 'file-text'],
        
        // Documents
        ['.pdf', 'file-pdf'],
        
        // Images
        ['.png', 'file-media'],
        ['.jpg', 'file-media'],
        ['.jpeg', 'file-media'],
        ['.gif', 'file-media'],
        ['.svg', 'file-media'],
        ['.ico', 'file-media'],
        ['.webp', 'file-media'],
        ['.bmp', 'file-media'],
        ['.tiff', 'file-media'],
        
        // Audio
        ['.mp3', 'file-media'],
        ['.wav', 'file-media'],
        ['.ogg', 'file-media'],
        ['.flac', 'file-media'],
        
        // Video
        ['.mp4', 'file-media'],
        ['.avi', 'file-media'],
        ['.mov', 'file-media'],
        ['.mkv', 'file-media'],
        ['.webm', 'file-media'],
        
        // Archives
        ['.zip', 'file-zip'],
        ['.tar', 'file-zip'],
        ['.gz', 'file-zip'],
        ['.rar', 'file-zip'],
        ['.7z', 'file-zip'],
        
        // Lock files
        ['.lock', 'lock'],
        ['.sum', 'lock'],
        
        // Certificate/Key
        ['.pem', 'key'],
        ['.crt', 'key'],
        ['.key', 'key'],
        ['.pub', 'key'],
        
        // Log files
        ['.log', 'output'],
        
        // Binary
        ['.bin', 'file-binary'],
        ['.dll', 'file-binary'],
        ['.so', 'file-binary'],
        ['.exe', 'file-binary'],
        
        // GraphQL
        ['.graphql', 'symbol-method'],
        ['.gql', 'symbol-method'],
        
        // Other
        ['.csv', 'table'],
        ['.tsv', 'table'],
        ['.diff', 'diff'],
        ['.patch', 'diff'],
    ]);

    /**
     * 特殊文件名到图标的映射
     */
    private static readonly fileNameIconMap: Map<string, string> = new Map([
        // Package managers
        ['package.json', 'package'],
        ['package-lock.json', 'lock'],
        ['yarn.lock', 'lock'],
        ['pnpm-lock.yaml', 'lock'],
        
        // TypeScript config
        ['tsconfig.json', 'settings-gear'],
        ['jsconfig.json', 'settings-gear'],
        
        // Build tools
        ['webpack.config.js', 'gear'],
        ['vite.config.js', 'gear'],
        ['vite.config.ts', 'gear'],
        ['rollup.config.js', 'gear'],
        ['gulpfile.js', 'gear'],
        ['gruntfile.js', 'gear'],
        
        // Docker
        ['dockerfile', 'docker'],
        ['Dockerfile', 'docker'],
        ['docker-compose.yml', 'docker'],
        ['docker-compose.yaml', 'docker'],
        ['.dockerignore', 'docker'],
        
        // Git
        ['.gitignore', 'git-pull-request'],
        ['.gitattributes', 'git-pull-request'],
        ['.gitmodules', 'git-pull-request'],
        
        // Documentation
        ['readme.md', 'book'],
        ['README.md', 'book'],
        ['changelog.md', 'book'],
        ['CHANGELOG.md', 'book'],
        ['contributing.md', 'book'],
        ['CONTRIBUTING.md', 'book'],
        
        // License
        ['license', 'law'],
        ['LICENSE', 'law'],
        ['license.md', 'law'],
        ['LICENSE.md', 'law'],
        
        // Environment
        ['.env', 'settings-gear'],
        ['.env.local', 'settings-gear'],
        ['.env.development', 'settings-gear'],
        ['.env.production', 'settings-gear'],
        ['.env.test', 'settings-gear'],
        ['.env.example', 'settings-gear'],
        
        // Make
        ['makefile', 'gear'],
        ['Makefile', 'gear'],
        
        // Python
        ['requirements.txt', 'package'],
        ['pipfile', 'package'],
        ['pipfile.lock', 'lock'],
        ['pyproject.toml', 'package'],
        ['setup.py', 'package'],
        
        // Ruby
        ['gemfile', 'package'],
        ['Gemfile', 'package'],
        ['gemfile.lock', 'lock'],
        ['Gemfile.lock', 'lock'],
        ['rakefile', 'gear'],
        ['Rakefile', 'gear'],
        
        // PHP
        ['composer.json', 'package'],
        ['composer.lock', 'lock'],
        
        // Rust
        ['cargo.toml', 'package'],
        ['cargo.lock', 'lock'],
        
        // Go
        ['go.mod', 'package'],
        ['go.sum', 'lock'],
        
        // iOS
        ['podfile', 'package'],
        ['Podfile', 'package'],
        ['podfile.lock', 'lock'],
        ['Podfile.lock', 'lock'],
        
        // Java
        ['pom.xml', 'package'],
        ['build.gradle', 'gear'],
        ['settings.gradle', 'settings-gear'],
    ]);

    /**
     * 获取文件图标
     * @param filePath 文件路径
     * @returns VSCode ThemeIcon
     */
    public static getFileIcon(filePath: string): vscode.ThemeIcon {
        // 尝试使用 ThemeIcon.File API（VSCode 1.92+）
        // 这个 API 会根据当前文件图标主题返回正确的图标
        if (this.hasFileIconApi()) {
            try {
                const uri = vscode.Uri.file(filePath);
                return (vscode.ThemeIcon as any).File(uri);
            } catch {
                // 如果失败，使用后备方案
            }
        }
        
        // 后备方案：使用 Codicon 图标映射
        const fileName = path.basename(filePath).toLowerCase();
        const ext = path.extname(filePath).toLowerCase();
        
        // 1. 检查特殊文件名
        const namedIcon = this.fileNameIconMap.get(fileName);
        if (namedIcon) {
            return new vscode.ThemeIcon(namedIcon);
        }
        
        // 2. 检查扩展名
        const extIcon = this.extensionIconMap.get(ext);
        if (extIcon) {
            return new vscode.ThemeIcon(extIcon);
        }
        
        // 3. 默认文件图标
        return new vscode.ThemeIcon('file');
    }

    /**
     * 获取文件图标名称（用于调试）
     * @param filePath 文件路径
     * @returns 图标名称字符串
     */
    public static getFileIconName(filePath: string): string {
        if (this.hasFileIconApi()) {
            return 'ThemeIcon.File';
        }
        
        const fileName = path.basename(filePath).toLowerCase();
        const ext = path.extname(filePath).toLowerCase();
        
        const namedIcon = this.fileNameIconMap.get(fileName);
        if (namedIcon) {
            return namedIcon;
        }
        
        const extIcon = this.extensionIconMap.get(ext);
        if (extIcon) {
            return extIcon;
        }
        
        return 'file';
    }
}
