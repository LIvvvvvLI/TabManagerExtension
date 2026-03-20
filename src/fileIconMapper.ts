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
     * VSCode 1.92+ 支持
     */
    private static hasFileIconApi(): boolean {
        // 检查 ThemeIcon.File 是否是一个函数
        const themeIcon = vscode.ThemeIcon as any;
        return typeof themeIcon.File === 'function';
    }

    /**
     * 文件扩展名到 Codicon 图标的映射（后备方案）
     */
    private static readonly extensionIconMap: Map<string, string> = new Map([
        // JavaScript/TypeScript
        ['.js', 'file-code'],
        ['.mjs', 'file-code'],
        ['.cjs', 'file-code'],
        ['.jsx', 'file-code'],
        ['.ts', 'file-code'],
        ['.tsx', 'file-code'],
        ['.mts', 'file-code'],
        ['.cts', 'file-code'],
        
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
        ['.vue', 'file-code'],
        ['.svelte', 'file-code'],
        ['.astro', 'file-code'],
        
        // Python
        ['.py', 'file-code'],
        ['.pyw', 'file-code'],
        ['.pyi', 'file-code'],
        ['.pyx', 'file-code'],
        
        // Java
        ['.java', 'file-code'],
        ['.class', 'file-binary'],
        
        // Kotlin
        ['.kt', 'file-code'],
        ['.kts', 'file-code'],
        
        // Scala
        ['.scala', 'file-code'],
        ['.sc', 'file-code'],
        
        // Groovy
        ['.groovy', 'file-code'],
        
        // C/C++
        ['.c', 'file-code'],
        ['.cpp', 'file-code'],
        ['.cc', 'file-code'],
        ['.cxx', 'file-code'],
        ['.h', 'file-code'],
        ['.hpp', 'file-code'],
        ['.hxx', 'file-code'],
        
        // C#
        ['.cs', 'file-code'],
        
        // Go
        ['.go', 'file-code'],
        
        // Rust
        ['.rs', 'file-code'],
        
        // PHP
        ['.php', 'file-code'],
        ['.phtml', 'file-code'],
        
        // Ruby
        ['.rb', 'file-code'],
        ['.rake', 'file-code'],
        
        // Swift
        ['.swift', 'file-code'],
        
        // Objective-C
        ['.m', 'file-code'],
        ['.mm', 'file-code'],
        
        // Other Languages
        ['.lua', 'file-code'],
        ['.r', 'file-code'],
        ['.jl', 'file-code'],
        ['.ex', 'file-code'],
        ['.exs', 'file-code'],
        ['.erl', 'file-code'],
        ['.hrl', 'file-code'],
        ['.hs', 'file-code'],
        ['.ml', 'file-code'],
        ['.mli', 'file-code'],
        ['.fs', 'file-code'],
        ['.fsi', 'file-code'],
        ['.fsx', 'file-code'],
        ['.clj', 'file-code'],
        ['.cljs', 'file-code'],
        ['.dart', 'file-code'],
        ['.vim', 'file-code'],
        
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
        ['.yaml', 'gear'],
        ['.yml', 'gear'],
        ['.xml', 'file-code'],
        ['.toml', 'gear'],
        ['.ini', 'gear'],
        ['.conf', 'gear'],
        ['.config', 'gear'],
        ['.cfg', 'gear'],
        ['.properties', 'gear'],
        
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
        ['.graphql', 'file-code'],
        ['.gql', 'file-code'],
        
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
        ['tsconfig.json', 'gear'],
        ['jsconfig.json', 'gear'],
        
        // Build tools
        ['webpack.config.js', 'gear'],
        ['vite.config.js', 'gear'],
        ['vite.config.ts', 'gear'],
        ['rollup.config.js', 'gear'],
        ['gulpfile.js', 'gear'],
        ['gruntfile.js', 'gear'],
        
        // Docker
        ['dockerfile', 'server'],
        ['Dockerfile', 'server'],
        ['docker-compose.yml', 'server'],
        ['docker-compose.yaml', 'server'],
        ['.dockerignore', 'server'],
        
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
        ['.env', 'gear'],
        ['.env.local', 'gear'],
        ['.env.development', 'gear'],
        ['.env.production', 'gear'],
        ['.env.test', 'gear'],
        ['.env.example', 'gear'],
        
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
        ['settings.gradle', 'gear'],
    ]);

    /**
     * 获取文件图标
     * @param filePath 文件路径
     * @returns VSCode ThemeIcon 或 Uri
     */
    public static getFileIcon(filePath: string): vscode.ThemeIcon | vscode.Uri {
        // 尝试使用 ThemeIcon.File API（VSCode 1.92+）
        // 这个 API 会根据当前文件图标主题返回正确的图标
        if (this.hasFileIconApi()) {
            try {
                const uri = vscode.Uri.file(filePath);
                const icon = (vscode.ThemeIcon as any).File(uri);
                if (icon) {
                    return icon;
                }
            } catch (error) {
                // 如果失败，使用后备方案
                console.debug('ThemeIcon.File API failed, using fallback:', error);
            }
        }
        
        // 后备方案：使用 Codicon 图标映射
        return this.getFallbackIcon(filePath);
    }

    /**
     * 获取后备图标（Codicon）
     * @param filePath 文件路径
     * @returns VSCode ThemeIcon
     */
    private static getFallbackIcon(filePath: string): vscode.ThemeIcon {
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
            return 'ThemeIcon.File (from file icon theme)';
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
