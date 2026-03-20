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

    // 添加到订阅列表
    context.subscriptions.push(
        showTabsCommand
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
