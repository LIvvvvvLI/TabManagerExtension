import * as vscode from 'vscode';
import * as path from 'path';
import { FileIconMapper } from './fileIconMapper';

/**
 * QuickPick项接口，用于显示标签页信息
 */
export interface TabQuickPickItem extends vscode.QuickPickItem {
    tab: vscode.Tab;
    index: number;
}

/**
 * 标签页管理器类
 * 实现所有标签页管理功能
 */
export class TabManager {
    private config: vscode.WorkspaceConfiguration;

    // 定义按钮
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
     * 刷新配置
     */
    private refreshConfig(): void {
        this.config = vscode.workspace.getConfiguration('tabManager');
    }

    /**
     * 获取所有打开的标签页
     * @returns 标签页QuickPick项数组
     */
    public getAllTabs(): TabQuickPickItem[] {
        const items: TabQuickPickItem[] = [];
        const showPath = this.config.get<boolean>('showPath', true);

        vscode.window.tabGroups.all.forEach((group, groupIndex) => {
            group.tabs.forEach((tab, tabIndex) => {
                // 跳过非编辑器标签（如设置页、扩展页等）
                if (tab.input instanceof vscode.TabInputText) {
                    const uri = tab.input.uri;
                    const fileName = path.basename(uri.fsPath);
                    const filePath = uri.fsPath;
                    const dirPath = path.dirname(uri.fsPath);
                    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
                    
                    // 获取文件图标
                    const fileIcon = FileIconMapper.getFileIcon(uri.fsPath);
                    
                    // 构建显示标签
                    let label = fileName;
                    let description = '';
                    
                    if (showPath) {
                        if (workspaceFolder) {
                            const relativePath = path.relative(workspaceFolder.uri.fsPath, dirPath);
                            description = relativePath || '.';
                        } else {
                            description = dirPath;
                        }
                    }

                    // 检查是否为活动标签
                    if (tab.isActive) {
                        label = `✓ ${fileName}`;
                    }

                    // 检查是否已修改
                    if (tab.isDirty) {
                        label = `● ${label}`;
                    }

                    items.push({
                        label: label,
                        description: description,
                        detail: filePath,
                        iconPath: fileIcon,
                        tab: tab,
                        index: tabIndex,
                        picked: tab.isActive,
                        // 添加两个按钮：切换和关闭
                        buttons: [
                            this.SWITCH_BUTTON,
                            this.CLOSE_BUTTON
                        ]
                    });
                }
            });
        });

        return items;
    }

    /**
     * 显示标签页QuickPick界面
     */
    public async showTabsQuickPick(): Promise<void> {
        this.refreshConfig();
        const items = this.getAllTabs();

        if (items.length === 0) {
            vscode.window.showInformationMessage('没有打开的标签页');
            return;
        }

        // 创建QuickPick
        const quickPick = vscode.window.createQuickPick<TabQuickPickItem>();
        quickPick.items = items;
        quickPick.canSelectMany = true;
        quickPick.placeholder = '选择要关闭的标签页（可多选），按Enter关闭选中项';
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // 存储选中的项
        let selectedItems: TabQuickPickItem[] = [];

        quickPick.onDidChangeSelection((selection) => {
            selectedItems = selection as TabQuickPickItem[];
        });

        // 监听当前活动项变化（键盘上下移动时触发）
        quickPick.onDidChangeActive((activeItems) => {
            if (activeItems && activeItems.length > 0) {
                const activeItem = activeItems[0] as TabQuickPickItem;
                // 切换到对应的标签页
                this.switchToTab(activeItem);
            }
        });

        // 处理按钮点击
        quickPick.onDidTriggerItemButton(async (event) => {
            const item = event.item as TabQuickPickItem;
            
            // 通过比较按钮对象来区分不同的按钮
            if (event.button.tooltip === this.SWITCH_BUTTON.tooltip) {
                // 切换按钮：切换到此标签页并关闭列表
                await this.switchToTab(item);
                quickPick.hide();
            } else if (event.button.tooltip === this.CLOSE_BUTTON.tooltip) {
                // 关闭按钮：关闭此标签页
                await this.closeTab(item);
                
                // 刷新列表
                const newItems = this.getAllTabs();
                if (newItems.length === 0) {
                    quickPick.hide();
                    vscode.window.showInformationMessage('所有标签页已关闭');
                } else {
                    quickPick.items = newItems;
                }
            }
        });

        // 处理确认选择（关闭选中的标签页）
        quickPick.onDidAccept(async () => {
            quickPick.hide();
            if (selectedItems.length > 0) {
                await this.closeSelectedTabs(selectedItems);
            }
        });

        // 显示QuickPick
        quickPick.show();
    }

    /**
     * 切换到指定标签页
     * @param item 标签页QuickPick项
     */
    public async switchToTab(item: TabQuickPickItem): Promise<void> {
        try {
            // 获取标签页对应的 URI
            if (item.tab.input instanceof vscode.TabInputText) {
                const uri = item.tab.input.uri;
                // 打开对应的文档
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, {
                    preview: false,
                    preserveFocus: false
                });
            }
        } catch (error) {
            console.error('切换标签页失败:', error);
        }
    }

    /**
     * 关闭单个标签页
     * @param item 标签页QuickPick项
     */
    public async closeTab(item: TabQuickPickItem): Promise<void> {
        try {
            // 如果有未保存的更改，提示用户
            if (item.tab.isDirty) {
                const fileName = path.basename((item.tab.input as vscode.TabInputText).uri.fsPath);
                const result = await vscode.window.showWarningMessage(
                    `文件 "${fileName}" 有未保存的更改，确定要关闭吗？`,
                    '关闭',
                    '取消'
                );
                if (result !== '关闭') {
                    return;
                }
            }
            // 使用 vscode.window.tabGroups.close() 关闭标签页
            await vscode.window.tabGroups.close(item.tab);
        } catch (error) {
            console.error('关闭标签页失败:', error);
        }
    }

    /**
     * 关闭选中的标签页
     * @param items 选中的标签页项数组
     */
    public async closeSelectedTabs(items: TabQuickPickItem[]): Promise<void> {
        if (!items || items.length === 0) {
            return;
        }

        // 检查是否有未保存的文件
        const dirtyItems = items.filter(item => item.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `有 ${dirtyItems.length} 个文件未保存，确定要关闭吗？`,
                '全部关闭',
                '取消'
            );
            if (result !== '全部关闭') {
                return;
            }
        }

        // 关闭所有选中的标签页
        let closedCount = 0;
        for (const item of items) {
            try {
                // 需要重新获取tab引用
                const currentTabs = this.getAllTabs();
                const currentTab = currentTabs.find(
                    t => {
                        if (t.tab.input instanceof vscode.TabInputText && item.tab.input instanceof vscode.TabInputText) {
                            return t.tab.input.uri.fsPath === item.tab.input.uri.fsPath;
                        }
                        return false;
                    }
                );
                if (currentTab) {
                    await vscode.window.tabGroups.close(currentTab.tab);
                    closedCount++;
                }
            } catch (error) {
                console.error('关闭标签页失败:', error);
            }
        }

        if (closedCount > 0) {
            vscode.window.showInformationMessage(`已关闭 ${closedCount} 个标签页`);
        }
    }

    /**
     * 关闭除当前活动标签页外的所有标签页
     */
    public async closeAllExceptActive(): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('没有活动的编辑器');
            return;
        }

        const activeUri = activeEditor.document.uri;
        const items = this.getAllTabs();
        const itemsToClose = items.filter(item => {
            if (item.tab.input instanceof vscode.TabInputText) {
                return item.tab.input.uri.fsPath !== activeUri.fsPath;
            }
            return false;
        });

        if (itemsToClose.length === 0) {
            vscode.window.showInformationMessage('没有其他标签页需要关闭');
            return;
        }

        // 检查未保存文件
        const dirtyItems = itemsToClose.filter(item => item.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `有 ${dirtyItems.length} 个文件未保存，确定要关闭吗？`,
                '全部关闭',
                '取消'
            );
            if (result !== '全部关闭') {
                return;
            }
        }

        await this.closeSelectedTabs(itemsToClose);
    }

    /**
     * 关闭右侧所有标签页
     */
    public async closeTabsToRight(): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('没有活动的编辑器');
            return;
        }

        const activeUri = activeEditor.document.uri;
        const items = this.getAllTabs();
        const itemsToClose: TabQuickPickItem[] = [];
        let foundActive = false;

        for (const item of items) {
            if (foundActive) {
                itemsToClose.push(item);
            }
            if (item.tab.input instanceof vscode.TabInputText &&
                item.tab.input.uri.fsPath === activeUri.fsPath) {
                foundActive = true;
            }
        }

        if (itemsToClose.length === 0) {
            vscode.window.showInformationMessage('右侧没有标签页需要关闭');
            return;
        }

        // 检查未保存文件
        const dirtyItems = itemsToClose.filter(item => item.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `有 ${dirtyItems.length} 个文件未保存，确定要关闭吗？`,
                '全部关闭',
                '取消'
            );
            if (result !== '全部关闭') {
                return;
            }
        }

        await this.closeSelectedTabs(itemsToClose);
    }

    /**
     * 关闭左侧所有标签页
     */
    public async closeTabsToLeft(): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('没有活动的编辑器');
            return;
        }

        const activeUri = activeEditor.document.uri;
        const items = this.getAllTabs();
        const itemsToClose: TabQuickPickItem[] = [];

        for (const item of items) {
            if (item.tab.input instanceof vscode.TabInputText &&
                item.tab.input.uri.fsPath === activeUri.fsPath) {
                break;
            }
            itemsToClose.push(item);
        }

        if (itemsToClose.length === 0) {
            vscode.window.showInformationMessage('左侧没有标签页需要关闭');
            return;
        }

        // 检查未保存文件
        const dirtyItems = itemsToClose.filter(item => item.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `有 ${dirtyItems.length} 个文件未保存，确定要关闭吗？`,
                '全部关闭',
                '取消'
            );
            if (result !== '全部关闭') {
                return;
            }
        }

        await this.closeSelectedTabs(itemsToClose);
    }
}
