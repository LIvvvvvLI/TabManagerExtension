import * as vscode from 'vscode';
import * as path from 'path';

const EXTENSION_ICONS: ReadonlyArray<readonly [ReadonlySet<string>, string]> = [
    [new Set([
        'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'vue', 'svelte', 'astro',
        'html', 'htm', 'css', 'scss', 'sass', 'less', 'styl', 'py', 'java',
        'kt', 'kts', 'go', 'rs', 'php', 'rb', 'swift', 'dart', 'lua', 'r',
        'cs', 'fs', 'vb', 'c', 'h', 'cc', 'cpp', 'cxx', 'hpp', 'scala'
    ]), 'file-code'],
    [new Set(['json', 'jsonc', 'yaml', 'yml', 'toml', 'ini', 'conf', 'config', 'properties', 'xml']), 'json'],
    [new Set(['md', 'mdx', 'markdown', 'rst', 'adoc']), 'markdown'],
    [new Set(['txt', 'log', 'csv', 'tsv']), 'file-text'],
    [new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tif', 'tiff', 'avif', 'mp3', 'wav', 'flac', 'ogg', 'mp4', 'webm', 'mov', 'avi']), 'file-media'],
    [new Set(['pdf']), 'file-pdf'],
    [new Set(['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'tgz']), 'file-zip'],
    [new Set(['sql', 'sqlite', 'sqlite3', 'db', 'prisma']), 'database'],
    [new Set(['sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd']), 'terminal'],
    [new Set(['ipynb']), 'notebook'],
    [new Set(['exe', 'dll', 'so', 'dylib', 'bin', 'wasm', 'class', 'jar']), 'file-binary']
];

/**
 * 为不支持 QuickPick resourceUri 的旧版 VS Code 提供文件类别图标。
 */
export class FileIconMapper {
    public static getIcon(uri: vscode.Uri, fallbackLabel: string): vscode.ThemeIcon {
        const fileName = this.getFileName(uri, fallbackLabel);
        const specialIcon = this.getSpecialFileIcon(fileName);
        if (specialIcon) {
            return new vscode.ThemeIcon(specialIcon);
        }

        const extension = path.posix.extname(fileName).slice(1);
        for (const [extensions, icon] of EXTENSION_ICONS) {
            if (extensions.has(extension)) {
                return new vscode.ThemeIcon(icon);
            }
        }

        return new vscode.ThemeIcon('file');
    }

    private static getFileName(uri: vscode.Uri, fallbackLabel: string): string {
        const uriFileName = path.posix.basename(uri.path).toLowerCase();
        return uriFileName || fallbackLabel.toLowerCase();
    }

    private static getSpecialFileIcon(fileName: string): string | undefined {
        if (/^(readme|license|changelog|contributing)(\..+)?$/.test(fileName)) {
            return 'book';
        }

        if (/^(package(-lock)?\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?)$/.test(fileName)) {
            return 'package';
        }

        if (/^(dockerfile|compose\.ya?ml|docker-compose\.ya?ml)$/.test(fileName)) {
            return 'server';
        }

        if (fileName.startsWith('.git')) {
            return 'git-branch';
        }

        if (
            fileName.startsWith('.env') ||
            /^(tsconfig|jsconfig|settings|launch|tasks)(\..+)?\.json$/.test(fileName) ||
            /^(makefile|cmakelists\.txt)$/.test(fileName)
        ) {
            return 'settings-gear';
        }

        return undefined;
    }
}
