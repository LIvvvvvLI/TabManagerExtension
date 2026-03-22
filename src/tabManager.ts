import * as vscode from 'vscode';
import * as path from 'path';

export interface TabQuickPickItem extends vscode.QuickPickItem {
    tab: vscode.Tab;
    resourceUri?: vscode.Uri;
}

export class TabManager {
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

    public getAllTabs(): TabQuickPickItem[] {
        const config = vscode.workspace.getConfiguration('tabManager');
        const showRelativePath = config.get<boolean>('showRelativePath', true);
        const showAbsolutePath = config.get<boolean>('showAbsolutePath', false);

        const items: TabQuickPickItem[] = [];

        for (const group of vscode.window.tabGroups.all) {
            for (const tab of group.tabs) {
                const input = tab.input as any;
                const uri: vscode.Uri | undefined = input?.uri;

                if (!uri) continue;

                // 恢复文字标识逻辑
                const stateText = tab.isDirty ? ' (未保存)' : '';
                const activeText = tab.isActive ? ' (当前)' : '';
                const label = `${tab.label}${stateText}${activeText}`;

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
                    iconPath: new vscode.ThemeIcon('file'), // 稳定的文件占位图标
                    alwaysShow: tab.isActive,
                    buttons: [this.BUTTONS.SWITCH, this.BUTTONS.CLOSE]
                });
            }
        }
        return items;
    }

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
        
        quickPick.placeholder = '搜索；勾选后回车批量关闭；直接回车切换当前项';
        // 💡 关键恢复：重新开启多选
        quickPick.canSelectMany = true; 
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // 按钮点击：单项切换或单项关闭
        quickPick.onDidTriggerItemButton(async (e) => {
            if (e.button === this.BUTTONS.SWITCH) {
                await this.switchToTab(e.item);
                quickPick.hide();
            } else if (e.button === this.BUTTONS.CLOSE) {
                await vscode.window.tabGroups.close(e.item.tab);
                update(); 
            }
        });

        // 💡 核心逻辑：处理 Enter 键
        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems;
            
            if (selected.length > 0) {
                // 如果有勾选，执行批量关闭
                await this.closeSelectedTabs(selected);
                quickPick.hide();
            } else {
                // 如果没勾选，则切换到当前光标所在的标签
                const activeItem = quickPick.activeItems[0];
                if (activeItem) {
                    await this.switchToTab(activeItem);
                }
                quickPick.hide();
            }
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }

    private async switchToTab(item: TabQuickPickItem) {
        if (item.resourceUri) {
            await vscode.commands.executeCommand('vscode.open', item.resourceUri, { preview: false });
        }
    }

    private async closeSelectedTabs(items: readonly TabQuickPickItem[]) {
        const dirtyItems = items.filter(i => i.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `确定关闭这 ${items.length} 个标签页吗？其中包含未保存的文件。`,
                { modal: true }, '确定'
            );
            if (result !== '确定') return;
        }
        await vscode.window.tabGroups.close(items.map(i => i.tab));
    }
}
