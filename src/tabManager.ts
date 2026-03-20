import * as vscode from 'vscode';
import * as path from 'path';

export interface TabQuickPickItem extends vscode.QuickPickItem {
    tab: vscode.Tab;
    resourceUri?: vscode.Uri;
}

export class TabManager {
    private config: vscode.WorkspaceConfiguration;

    private readonly SWITCH_BUTTON: vscode.QuickInputButton = {
        iconPath: new vscode.ThemeIcon('arrow-right'),
        tooltip: '切换到此标签页'
    };

    private readonly CLOSE_BUTTON: vscode.QuickInputButton = {
        iconPath: new vscode.ThemeIcon('close'),
        tooltip: '关闭此标签页'
    };

    constructor() {
        this.config = vscode.workspace.getConfiguration('tabManager');
    }

    public getAllTabs(): TabQuickPickItem[] {
        this.config = vscode.workspace.getConfiguration('tabManager');
        const showRelativePath = this.config.get<boolean>('showRelativePath', true);
        const showAbsolutePath = this.config.get<boolean>('showAbsolutePath', false);

        const items: TabQuickPickItem[] = [];

        for (const group of vscode.window.tabGroups.all) {
            for (const tab of group.tabs) {
                let uri: vscode.Uri | undefined;
                // 更加健壮的 URI 获取方式
                const input = tab.input as any; 
                if (input && input.uri instanceof vscode.Uri) {
                    uri = input.uri;
                }

                if (!uri) continue;

                const fileName = tab.label;
                const isDirty = tab.isDirty;
                const isActive = tab.isActive;

                /**
                 * 💡 关键修正点 1：调整 Label 格式
                 * 建议不要在最前面放特殊符号，或者确保 fileName 保持完整。
                 * 我们可以利用 description 来显示状态，或者将符号放在后面。
                 * 如果坚持放在前面，请确保 resourceUri 绝对正确。
                 */
                const stateIcon = isDirty ? ' (未保存)' : '';
                const activeIcon = isActive ? ' (当前)' : '';
                
                // 尝试将状态放在后面，或者保持原样但确保下面的配置生效
                const label = `${fileName}${stateIcon}${activeIcon}`;

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
                    /**
                     * 💡 关键修正点 2：resourceUri 的赋值
                     * 确保它是完整的 Uri 对象。
                     */
                    resourceUri: uri,
                    iconPath: vscode.ThemeIcon.File, 
                    alwaysShow: isActive,
                    buttons: [this.SWITCH_BUTTON, this.CLOSE_BUTTON]
                });
            }
        }
        return items;
    }

    public async showTabsQuickPick(): Promise<void> {
        const quickPick = vscode.window.createQuickPick<TabQuickPickItem>();
        
        const refresh = () => {
            quickPick.items = this.getAllTabs();
            if (quickPick.items.length === 0) {
                quickPick.hide();
            }
        };

        refresh();
        
        // 💡 关键修正点 3：这些属性必须在 items 赋值前后保持正确
        quickPick.placeholder = '搜索已打开的文件...';
        quickPick.canSelectMany = true;
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        quickPick.onDidTriggerItemButton(async (e) => {
            if (e.button === this.SWITCH_BUTTON) {
                await this.switchToTab(e.item);
                quickPick.hide();
            } else if (e.button === this.CLOSE_BUTTON) {
                await vscode.window.tabGroups.close(e.item.tab);
                refresh(); 
            }
        });

        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems;
            if (selected.length > 0) {
                await this.closeSelectedTabs(selected);
                quickPick.hide();
            } else {
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
        // 统一使用 open 命令，这样可以自动处理文本和非文本文件
        if (item.resourceUri) {
            await vscode.commands.executeCommand('vscode.open', item.resourceUri);
        }
    }

    private async closeSelectedTabs(items: readonly TabQuickPickItem[]) {
        const dirtyItems = items.filter(i => i.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `确定关闭 ${items.length} 个标签页吗？`,
                { modal: true }, '确定'
            );
            if (result !== '确定') return;
        }
        await vscode.window.tabGroups.close(items.map(i => i.tab));
    }
}
