import * as vscode from 'vscode';
import * as path from 'path';

export interface TabQuickPickItem extends vscode.QuickPickItem {
    tab: vscode.Tab;
    resourceUri?: vscode.Uri;
}

export class TabManager {
    // 预定义按钮，避免重复创建
    private readonly BUTTONS = {
        SWITCH: {
            iconPath: new vscode.ThemeIcon('arrow-right'),
            tooltip: '切换到此标签页'
        },
        CLOSE: {
            iconPath: new vscode.ThemeIcon('close'),
            tooltip: '关闭此标签页'
        }
    };

    /**
     * 获取所有标签页并格式化为 QuickPickItem
     */
    public getAllTabs(): TabQuickPickItem[] {
        const config = vscode.workspace.getConfiguration('tabManager');
        const showRelativePath = config.get<boolean>('showRelativePath', true);
        const showAbsolutePath = config.get<boolean>('showAbsolutePath', false);

        const items: TabQuickPickItem[] = [];

        for (const group of vscode.window.tabGroups.all) {
            for (const tab of group.tabs) {
                // 尝试从 input 获取 URI
                const input = tab.input as any;
                const uri: vscode.Uri | undefined = input?.uri;

                if (!uri) continue;

                const isDirty = tab.isDirty;
                const isActive = tab.isActive;

                /**
                 * 💡 优化：使用 Markdown 图标 (Octicons)
                 * $(circle-filled) 是未保存的小圆点
                 * $(primitive-dot) 或 $(circle-outline) 是活动标记
                 */
                const label = [
                    isDirty ? '$(circle-filled)' : '',
                    isActive ? '$(record)' : '',
                    tab.label
                ].filter(Boolean).join(' ');

                // 路径处理
                let description = '';
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
                if (showRelativePath && workspaceFolder) {
                    description = path.relative(workspaceFolder.uri.fsPath, path.dirname(uri.fsPath));
                } else {
                    description = path.dirname(uri.fsPath);
                }

                items.push({
                    label,
                    description: description || '.',
                    detail: showAbsolutePath ? uri.fsPath : undefined,
                    tab,
                    resourceUri: uri,
                    // 既然放弃文件图标，我们统一使用一个简洁的图标
                    iconPath: new vscode.ThemeIcon('file-text'), 
                    alwaysShow: isActive,
                    buttons: [this.BUTTONS.SWITCH, this.BUTTONS.CLOSE]
                });
            }
        }
        return items;
    }

    public async showTabsQuickPick(): Promise<void> {
        const quickPick = vscode.window.createQuickPick<TabQuickPickItem>();
        
        // 抽取刷新逻辑
        const update = () => {
            const items = this.getAllTabs();
            if (items.length === 0) {
                quickPick.hide();
                return;
            }
            quickPick.items = items;
        };

        update();
        
        quickPick.placeholder = '搜索标签页... (Enter 切换，点击按钮操作)';
        quickPick.canSelectMany = false;
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // 按钮监听
        quickPick.onDidTriggerItemButton(async (e) => {
            if (e.button === this.BUTTONS.SWITCH) {
                await this.switchToTab(e.item);
                quickPick.hide();
            } else if (e.button === this.BUTTONS.CLOSE) {
                // 直接使用 API 关闭，更快捷
                await vscode.window.tabGroups.close(e.item.tab);
                update(); 
            }
        });

        // 确认监听 (Enter)
        quickPick.onDidAccept(async () => {
            const selected = quickPick.activeItems[0];
            if (selected) {
                await this.switchToTab(selected);
            }
            quickPick.hide();
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }

    private async switchToTab(item: TabQuickPickItem) {
        if (!item.resourceUri) return;
        
        // 使用内置命令打开，支持所有类型的文件（图片、文本等）
        await vscode.commands.executeCommand('vscode.open', item.resourceUri, {
            preview: false,
            preserveFocus: false
        });
    }
}
