import * as vscode from 'vscode';
import { TabQuickPickItem, TabManager } from './tabManager';

/**
 * 扩展激活时调用
 * @param context 扩展上下文
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Tab Manager 扩展已激活');

    const tabManager = new TabManager();

    // 注册显示所有标签页的命令
    const showTabsCommand = vscode.commands.registerCommand(
        'tabManager.showTabs',
        async () => {
            await tabManager.showTabsQuickPick();
        }
    );

    // 注册关闭选中标签页的命令
    const closeSelectedTabsCommand = vscode.commands.registerCommand(
        'tabManager.closeSelectedTabs',
        async (items: TabQuickPickItem[]) => {
            await tabManager.closeSelectedTabs(items);
        }
    );

    // 注册关闭除当前外的所有标签页命令
    const closeAllExceptActiveCommand = vscode.commands.registerCommand(
        'tabManager.closeAllExceptActive',
        async () => {
            await tabManager.closeAllExceptActive();
        }
    );

    // 注册关闭右侧所有标签页命令
    const closeTabsToRightCommand = vscode.commands.registerCommand(
        'tabManager.closeTabsToRight',
        async () => {
            await tabManager.closeTabsToRight();
        }
    );

    // 注册关闭左侧所有标签页命令
    const closeTabsToLeftCommand = vscode.commands.registerCommand(
        'tabManager.closeTabsToLeft',
        async () => {
            await tabManager.closeTabsToLeft();
        }
    );

    // 添加到订阅列表
    context.subscriptions.push(
        showTabsCommand,
        closeSelectedTabsCommand,
        closeAllExceptActiveCommand,
        closeTabsToRightCommand,
        closeTabsToLeftCommand
    );

    // 显示激活通知
    vscode.window.showInformationMessage('Tab Manager 标签页管理器已就绪！');
}

/**
 * 扩展停用时调用
 */
export function deactivate() {
    console.log('Tab Manager 扩展已停用');
}
