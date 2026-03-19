import * as vscode from 'vscode';
import * as path from 'path';

/**
 * 文件图标映射器
 * 根据文件扩展名返回对应的 VSCode ThemeIcon
 */
export class FileIconMapper {
    
    /**
     * 语言ID到图标的映射
     */
    private static readonly languageIconMap: Map<string, string> = new Map([
        // JavaScript/TypeScript
        ['javascript', 'symbol-method'],
        ['typescript', 'symbol-method'],
        ['javascriptreact', 'symbol-method'],
        ['typescriptreact', 'symbol-method'],
        ['json', 'json'],
        ['jsonc', 'json'],
        
        // Web
        ['html', 'symbol-file'],
        ['css', 'symbol-color'],
        ['scss', 'symbol-color'],
        ['less', 'symbol-color'],
        ['vue', 'symbol-method'],
        ['svelte', 'symbol-method'],
        
        // Backend
        ['python', 'symbol-method'],
        ['java', 'symbol-method'],
        ['c', 'symbol-method'],
        ['cpp', 'symbol-method'],
        ['csharp', 'symbol-method'],
        ['go', 'symbol-method'],
        ['rust', 'symbol-method'],
        ['php', 'symbol-method'],
        ['ruby', 'symbol-method'],
        
        // Config/Data
        ['yaml', 'settings-gear'],
        ['xml', 'symbol-file'],
        ['toml', 'settings-gear'],
        ['ini', 'settings-gear'],
        ['env', 'settings-gear'],
        
        // Documentation
        ['markdown', 'book'],
        ['md', 'book'],
        
        // Shell
        ['shellscript', 'terminal'],
        ['powershell', 'terminal'],
        ['bash', 'terminal'],
        
        // Database
        ['sql', 'database'],
        ['mysql', 'database'],
        ['pgsql', 'database'],
        
        // Other
        ['dockerfile', 'package'],
        ['dockercompose', 'package'],
        ['makefile', 'gear'],
        ['cmake', 'gear'],
    ]);

    /**
     * 文件扩展名到图标的映射
     */
    private static readonly extensionIconMap: Map<string, string> = new Map([
        // JavaScript/TypeScript
        ['.js', 'symbol-method'],
        ['.jsx', 'symbol-method'],
        ['.ts', 'symbol-method'],
        ['.tsx', 'symbol-method'],
        ['.mjs', 'symbol-method'],
        ['.cjs', 'symbol-method'],
        ['.json', 'json'],
        
        // Web
        ['.html', 'symbol-file'],
        ['.htm', 'symbol-file'],
        ['.css', 'symbol-color'],
        ['.scss', 'symbol-color'],
        ['.sass', 'symbol-color'],
        ['.less', 'symbol-color'],
        ['.vue', 'symbol-method'],
        ['.svelte', 'symbol-method'],
        
        // Backend Languages
        ['.py', 'symbol-method'],
        ['.pyw', 'symbol-method'],
        ['.java', 'symbol-method'],
        ['.c', 'symbol-method'],
        ['.cpp', 'symbol-method'],
        ['.cc', 'symbol-method'],
        ['.cxx', 'symbol-method'],
        ['.h', 'symbol-method'],
        ['.hpp', 'symbol-method'],
        ['.cs', 'symbol-method'],
        ['.go', 'symbol-method'],
        ['.rs', 'symbol-method'],
        ['.php', 'symbol-method'],
        ['.rb', 'symbol-method'],
        ['.swift', 'symbol-method'],
        ['.kt', 'symbol-method'],
        ['.scala', 'symbol-method'],
        ['.lua', 'symbol-method'],
        ['.r', 'symbol-method'],
        ['.jl', 'symbol-method'],
        
        // Config Files
        ['.yaml', 'settings-gear'],
        ['.yml', 'settings-gear'],
        ['.xml', 'symbol-file'],
        ['.toml', 'settings-gear'],
        ['.ini', 'settings-gear'],
        ['.conf', 'settings-gear'],
        ['.config', 'settings-gear'],
        ['.env', 'settings-gear'],
        ['.editorconfig', 'settings-gear'],
        ['.prettierrc', 'settings-gear'],
        ['.eslintrc', 'settings-gear'],
        
        // Documentation
        ['.md', 'book'],
        ['.markdown', 'book'],
        ['.mdx', 'book'],
        ['.rst', 'book'],
        ['.txt', 'symbol-file'],
        ['.pdf', 'file-pdf'],
        ['.doc', 'file-pdf'],
        ['.docx', 'file-pdf'],
        
        // Shell/Scripts
        ['.sh', 'terminal'],
        ['.bash', 'terminal'],
        ['.zsh', 'terminal'],
        ['.ps1', 'terminal'],
        ['.bat', 'terminal'],
        ['.cmd', 'terminal'],
        
        // Database
        ['.sql', 'database'],
        ['.db', 'database'],
        ['.sqlite', 'database'],
        ['.prisma', 'database'],
        
        // Build/Package
        ['.dockerfile', 'package'],
        ['.makefile', 'gear'],
        ['.cmake', 'gear'],
        ['.gradle', 'gear'],
        ['.maven', 'gear'],
        
        // Images
        ['.png', 'file-media'],
        ['.jpg', 'file-media'],
        ['.jpeg', 'file-media'],
        ['.gif', 'file-media'],
        ['.svg', 'file-media'],
        ['.ico', 'file-media'],
        ['.webp', 'file-media'],
        ['.bmp', 'file-media'],
        
        // Audio/Video
        ['.mp3', 'file-media'],
        ['.mp4', 'file-media'],
        ['.wav', 'file-media'],
        ['.avi', 'file-media'],
        ['.mov', 'file-media'],
        ['.mkv', 'file-media'],
        
        // Archives
        ['.zip', 'file-zip'],
        ['.tar', 'file-zip'],
        ['.gz', 'file-zip'],
        ['.rar', 'file-zip'],
        ['.7z', 'file-zip'],
        
        // Styles/Design
        ['.sketch', 'symbol-color'],
        ['.fig', 'symbol-color'],
        ['.xd', 'symbol-color'],
        
        // Lock files
        ['.lock', 'lock'],
        ['.sum', 'lock'],
        
        // Git
        ['.gitignore', 'git-pull-request'],
        ['.gitattributes', 'git-pull-request'],
        ['.gitmodules', 'git-pull-request'],
        
        // License
        ['.license', 'law'],
        ['.lic', 'law'],
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
        ['bun.lock', 'lock'],
        ['bun.lockb', 'lock'],
        
        // Config files
        ['tsconfig.json', 'settings-gear'],
        ['jsconfig.json', 'settings-gear'],
        ['.eslintrc', 'symbol-color'],
        ['.eslintrc.js', 'symbol-color'],
        ['.eslintrc.json', 'symbol-color'],
        ['.eslintrc.yaml', 'symbol-color'],
        ['.eslintrc.yml', 'symbol-color'],
        ['.prettierrc', 'symbol-color'],
        ['.prettierrc.js', 'symbol-color'],
        ['.prettierrc.json', 'symbol-color'],
        ['.prettierrc.yaml', 'symbol-color'],
        ['prettier.config.js', 'symbol-color'],
        
        // Build tools
        ['webpack.config.js', 'gear'],
        ['webpack.config.ts', 'gear'],
        ['vite.config.js', 'gear'],
        ['vite.config.ts', 'gear'],
        ['rollup.config.js', 'gear'],
        ['rollup.config.ts', 'gear'],
        ['gulpfile.js', 'gear'],
        ['gulpfile.ts', 'gear'],
        ['gruntfile.js', 'gear'],
        
        // Docker
        ['dockerfile', 'package'],
        ['Dockerfile', 'package'],
        ['docker-compose.yml', 'package'],
        ['docker-compose.yaml', 'package'],
        ['docker-compose.override.yml', 'package'],
        ['.dockerignore', 'package'],
        
        // CI/CD
        ['.travis.yml', 'gear'],
        ['.gitlab-ci.yml', 'gear'],
        ['azure-pipelines.yml', 'gear'],
        ['Jenkinsfile', 'gear'],
        
        // Git
        ['.gitignore', 'git-pull-request'],
        ['.gitattributes', 'git-pull-request'],
        ['.gitmodules', 'git-pull-request'],
        ['.gitkeep', 'git-pull-request'],
        
        // Editor
        ['.editorconfig', 'settings-gear'],
        ['.vscode', 'settings-gear'],
        
        // Documentation
        ['readme.md', 'book'],
        ['README.md', 'book'],
        ['readme', 'book'],
        ['README', 'book'],
        ['changelog.md', 'book'],
        ['CHANGELOG.md', 'book'],
        ['contributing.md', 'book'],
        ['CONTRIBUTING.md', 'book'],
        ['license', 'law'],
        ['LICENSE', 'law'],
        ['license.md', 'law'],
        ['LICENSE.md', 'law'],
        ['license.txt', 'law'],
        ['LICENSE.txt', 'law'],
        
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
        ['CMakeLists.txt', 'gear'],
        
        // Other
        ['.npmrc', 'settings-gear'],
        ['.nvmrc', 'settings-gear'],
        ['.python-version', 'settings-gear'],
        ['.ruby-version', 'settings-gear'],
        ['Gemfile', 'package'],
        ['Gemfile.lock', 'lock'],
        ['Rakefile', 'gear'],
        ['Podfile', 'package'],
        ['Podfile.lock', 'lock'],
        ['composer.json', 'package'],
        ['composer.lock', 'lock'],
        ['Cargo.toml', 'package'],
        ['Cargo.lock', 'lock'],
        ['go.mod', 'package'],
        ['go.sum', 'lock'],
        ['requirements.txt', 'package'],
        ['Pipfile', 'package'],
        ['Pipfile.lock', 'lock'],
        ['pyproject.toml', 'package'],
    ]);

    /**
     * 获取文件图标
     * @param filePath 文件路径
     * @param languageId 语言ID（可选）
     * @returns VSCode ThemeIcon
     */
    public static getFileIcon(filePath: string, languageId?: string): vscode.ThemeIcon {
        const fileName = path.basename(filePath).toLowerCase();
        const ext = path.extname(filePath).toLowerCase();
        
        // 1. 首先检查特殊文件名
        const namedIcon = this.fileNameIconMap.get(fileName);
        if (namedIcon) {
            return new vscode.ThemeIcon(namedIcon);
        }
        
        // 2. 检查扩展名
        const extIcon = this.extensionIconMap.get(ext);
        if (extIcon) {
            return new vscode.ThemeIcon(extIcon);
        }
        
        // 3. 检查语言ID
        if (languageId) {
            const langIcon = this.languageIconMap.get(languageId.toLowerCase());
            if (langIcon) {
                return new vscode.ThemeIcon(langIcon);
            }
        }
        
        // 4. 默认文件图标
        return new vscode.ThemeIcon('file');
    }

    /**
     * 获取文件图标名称（用于显示）
     * @param filePath 文件路径
     * @param languageId 语言ID（可选）
     * @returns 图标名称字符串
     */
    public static getFileIconName(filePath: string, languageId?: string): string {
        const fileName = path.basename(filePath).toLowerCase();
        const ext = path.extname(filePath).toLowerCase();
        
        // 检查特殊文件名
        const namedIcon = this.fileNameIconMap.get(fileName);
        if (namedIcon) {
            return namedIcon;
        }
        
        // 检查扩展名
        const extIcon = this.extensionIconMap.get(ext);
        if (extIcon) {
            return extIcon;
        }
        
        // 检查语言ID
        if (languageId) {
            const langIcon = this.languageIconMap.get(languageId.toLowerCase());
            if (langIcon) {
                return langIcon;
            }
        }
        
        return 'file';
    }
}
