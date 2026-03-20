import * as vscode from 'vscode';
import * as path from 'path';

/**
 * 文件图标映射器
 * 根据文件路径返回对应的文件图标
 * 
 * 使用 VSCode 内置的 ThemeIcon.File API 获取当前文件图标主题中的图标
 * 这样可以确保显示的图标与 VSCode 其他地方（如文件资源管理器、Ctrl+Tab）一致
 */
export class FileIconMapper {
    
    /**
     * 获取文件图标
     * 使用 VSCode 的 ThemeIcon.File API 获取当前文件图标主题中的图标
     * 
     * @param filePath 文件路径
     * @returns VSCode ThemeIcon 或 Uri，用于 QuickPickItem.iconPath
     */
    public static getFileIcon(filePath: string): vscode.ThemeIcon | vscode.Uri {
        try {
            // 创建文件 URI
            const uri = vscode.Uri.file(filePath);
            
            // 尝试使用 ThemeIcon.File API（VSCode 1.92+）
            // 这个 API 会返回当前文件图标主题中该文件的图标
            const themeIcon = (vscode.ThemeIcon as any).File;
            if (typeof themeIcon === 'function') {
                const icon = themeIcon(uri);
                if (icon) {
                    return icon;
                }
            }
            
            // 如果 ThemeIcon.File 不可用，返回默认文件图标
            return new vscode.ThemeIcon('file');
        } catch (error) {
            // 出错时返回默认文件图标
            console.error('获取文件图标失败:', error);
            return new vscode.ThemeIcon('file');
        }
    }

    /**
     * 获取文件图标名称（用于调试）
     * @param filePath 文件路径
     * @returns 图标名称字符串
     */
    public static getFileIconName(filePath: string): string {
        const themeIcon = (vscode.ThemeIcon as any).File;
        if (typeof themeIcon === 'function') {
            return 'ThemeIcon.File (from file icon theme)';
        }
        return 'file (default)';
    }
}
