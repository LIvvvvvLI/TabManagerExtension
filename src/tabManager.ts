import * as vscode from 'vscode';
import * as path from 'path';

/**
 * 自定义 QuickPick 项，关联原始 Tab 对象
 */
export interface TabQuickPickItem extends vscode.QuickPickItem {
    tab: vscode.Tab;
    resourceUri?: vscode.Uri;
}

export class TabManager {
    private config: vscode.WorkspaceConfiguration;

    // 复用图标按钮对象
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

    /**
     * 获取所有标签页（按编辑器物理显示顺序）
     */
    public getAllTabs(): TabQuickPickItem[] {
        this.config = vscode.workspace.getConfiguration('tabManager');
        const showRelativePath = this.config.get<boolean>('showRelativePath', true);
        const showAbsolutePath = this.config.get<boolean>('showAbsolutePath', false);

        const items: TabQuickPickItem[] = [];

        // 遍历所有标签组（处理拆分窗口的情况）
        for (const group of vscode.window.tabGroups.all) {
            for (const tab of group.tabs) {
                // 获取 URI（支持文本、自定义编辑器、Notebook）
                let uri: vscode.Uri | undefined;
                if (tab.input instanceof vscode.TabInputText || 
                    tab.input instanceof vscode.TabInputCustom || 
                    tab.input instanceof vscode.TabInputNotebook) {
                    uri = tab.input.uri;
                }

                // 只有拥有有效 URI 的标签才显示（过滤掉设置、扩展详情等页面）
                if (!uri) continue;

                const fileName = tab.label;
                const isDirty = tab.isDirty;
                const isActive = tab.isActive;

                // 构造标签文本：未保存显示圆点，活动项显示对勾
                const label = `${isDirty ? '● ' : ''}${isActive ? '✓ ' : ''}${fileName}`;

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
                    // 核心：ThemeIcon.File 会结合下面的 resourceUri 渲染出特定文件类型的图标
                    iconPath: vscode.ThemeIcon.File, 
                    alwaysShow: isActive, // 搜索时活动项不消失
                    buttons: [this.SWITCH_BUTTON, this.CLOSE_BUTTON]
                });
            }
        }
        return items;
    }

    /**
     * 弹出搜索框界面
     */
    public async showTabsQuickPick(): Promise<void> {
        const quickPick = vscode.window.createQuickPick<TabQuickPickItem>();
        
        // 刷新列表数据
        const refresh = () => {
            const items = this.getAllTabs();
            if (items.length === 0) {
                quickPick.hide();
                return;
            }
            quickPick.items = items;
        };

        refresh();
        quickPick.placeholder = '搜索已打开的文件；Enter 切换；勾选后 Enter 批量关闭';
        quickPick.canSelectMany = true; // 开启多选模式
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // 1. 监听按钮点击（右侧的小图标）
        quickPick.onDidTriggerItemButton(async (e) => {
            if (e.button === this.SWITCH_BUTTON) {
                await this.switchToTab(e.item);
                quickPick.hide();
            } else if (e.button === this.CLOSE_BUTTON) {
                await vscode.window.tabGroups.close(e.item.tab);
                refresh(); // 关闭后原地刷新列表
            }
        });

        // 2. 监听 Enter 键
        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems;
            if (selected.length > 0) {
                // 如果用户勾选了复选框，执行批量关闭
                await this.closeSelectedTabs(selected);
                quickPick.hide();
            } else {
                // 如果没有勾选，则切换到当前高亮的那一项
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

    /**
     * 切换到标签页
     */
    private async switchToTab(item: TabQuickPickItem) {
        if (item.tab.input instanceof vscode.TabInputText) {
            await vscode.window.showTextDocument(item.tab.input.uri, { preview: false });
        } else {
            // 处理非文本文件（如图片）
            await vscode.commands.executeCommand('vscode.open', item.resourceUri);
        }
    }

    /**
     * 批量关闭标签页
     */
    private async closeSelectedTabs(items: readonly TabQuickPickItem[]) {
        const dirtyItems = items.filter(i => i.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `确定关闭 ${items.length} 个标签页吗？其中有 ${dirtyItems.length} 个文件未保存。`,
                { modal: true }, '确定'
            );
            if (result !== '确定') return;
        }
        
        // 调用系统 API 批量关闭
        await vscode.window.tabGroups.close(items.map(i => i.tab));
    }
}
