import * as vscode from 'vscode';
import * as path from 'path';

export interface TabQuickPickItem extends vscode.QuickPickItem {
    tab: vscode.Tab;
    resourceUri?: vscode.Uri;
}

export class TabManager {
    // 预定义按钮，提高复用性能
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
                // 健壮地获取 URI
                const input = tab.input as any;
                const uri: vscode.Uri | undefined = input?.uri;

                if (!uri) continue;

                const isDirty = tab.isDirty;
                const isActive = tab.isActive;

                // --- 恢复为文字标识逻辑 ---
                const stateText = isDirty ? ' (未保存)' : '';
                const activeText = isActive ? ' (当前)' : '';
                const label = `${tab.label}${stateText}${activeText}`;
                // -----------------------

                // 路径处理逻辑
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
                    // 统一使用内置文件图标（不依赖主题颜色，确保稳定显示）
                    iconPath: new vscode.ThemeIcon('file'), 
                    alwaysShow: isActive,
                    buttons: [this.BUTTONS.SWITCH, this.BUTTONS.CLOSE]
                });
            }
        }
        return items;
    }

    /**
     * 主展示逻辑
     */
    public async showTabsQuickPick(): Promise<void> {
        const quickPick = vscode.window.createQuickPick<TabQuickPickItem>();
        
        const update = () => {
            const items = this.getAllTabs();
            if (items.length === 0) {
                quickPick.hide();
                return;
            }
            quickPick.items = items;
        };

        update();
        
        quickPick.placeholder = '搜索已打开的文件...';
        quickPick.canSelectMany = false;
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // 按钮监听：处理切换与关闭
        quickPick.onDidTriggerItemButton(async (e) => {
            if (e.button === this.BUTTONS.SWITCH) {
                await this.switchToTab(e.item);
                quickPick.hide();
            } else if (e.button === this.BUTTONS.CLOSE) {
                await vscode.window.tabGroups.close(e.item.tab);
                update(); // 局部刷新列表
            }
        });

        // 回车监听：默认切换
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

    /**
     * 执行标签切换
     */
    private async switchToTab(item: TabQuickPickItem) {
        if (!item.resourceUri) return;
        
        // 使用 vscode.open 确保兼容所有文件类型
        await vscode.commands.executeCommand('vscode.open', item.resourceUri, {
            preview: false
        });
    }
}
