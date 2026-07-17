import * as vscode from 'vscode';
import * as path from 'path';

export interface TabQuickPickItem extends vscode.QuickPickItem {
    tab: vscode.Tab;
    canSwitch: boolean;
}

interface TabPresentation {
    description?: string;
    detail?: string;
    iconPath: vscode.ThemeIcon;
    canSwitch: boolean;
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
                const presentation = this.getTabPresentation(
                    tab.input,
                    showRelativePath,
                    showAbsolutePath
                );

                // 恢复文字标识逻辑
                const stateText = tab.isDirty ? ' (未保存)' : '';
                const activeText = tab.isActive ? ' (当前)' : '';
                const label = `${tab.label}${stateText}${activeText}`;

                items.push({
                    label,
                    description: presentation.description,
                    detail: presentation.detail,
                    tab,
                    canSwitch: presentation.canSwitch,
                    iconPath: presentation.iconPath,
                    alwaysShow: tab.isActive,
                    buttons: presentation.canSwitch
                        ? [this.BUTTONS.SWITCH, this.BUTTONS.CLOSE]
                        : [this.BUTTONS.CLOSE]
                });
            }
        }
        return items;
    }

    private getTabPresentation(
        input: unknown,
        showRelativePath: boolean,
        showAbsolutePath: boolean
    ): TabPresentation {
        if (input instanceof vscode.TabInputText) {
            return this.createResourcePresentation(
                input.uri,
                'file',
                showRelativePath,
                showAbsolutePath
            );
        }

        if (input instanceof vscode.TabInputTextDiff) {
            return this.createResourcePresentation(
                input.modified,
                'diff',
                showRelativePath,
                showAbsolutePath,
                showAbsolutePath
                    ? `原始：${this.formatUri(input.original)}  修改：${this.formatUri(input.modified)}`
                    : undefined
            );
        }

        if (input instanceof vscode.TabInputCustom) {
            return this.createResourcePresentation(
                input.uri,
                'preview',
                showRelativePath,
                showAbsolutePath
            );
        }

        if (input instanceof vscode.TabInputNotebook) {
            return this.createResourcePresentation(
                input.uri,
                'notebook',
                showRelativePath,
                showAbsolutePath
            );
        }

        if (input instanceof vscode.TabInputNotebookDiff) {
            return this.createResourcePresentation(
                input.modified,
                'diff',
                showRelativePath,
                showAbsolutePath,
                showAbsolutePath
                    ? `原始：${this.formatUri(input.original)}  修改：${this.formatUri(input.modified)}`
                    : undefined
            );
        }

        if (input instanceof vscode.TabInputWebview) {
            return {
                description: `Webview · ${input.viewType}`,
                iconPath: new vscode.ThemeIcon('preview'),
                canSwitch: false
            };
        }

        if (input instanceof vscode.TabInputTerminal) {
            return {
                description: '终端',
                iconPath: new vscode.ThemeIcon('terminal'),
                canSwitch: false
            };
        }

        return {
            description: '其他标签页',
            iconPath: new vscode.ThemeIcon('window'),
            canSwitch: false
        };
    }

    private createResourcePresentation(
        uri: vscode.Uri,
        icon: string,
        showRelativePath: boolean,
        showAbsolutePath: boolean,
        detail?: string
    ): TabPresentation {
        return {
            description: this.getResourceDescription(uri, showRelativePath),
            detail: detail ?? (showAbsolutePath ? this.formatUri(uri) : undefined),
            iconPath: new vscode.ThemeIcon(icon),
            canSwitch: true
        };
    }

    private getResourceDescription(
        uri: vscode.Uri,
        showRelativePath: boolean
    ): string | undefined {
        if (!showRelativePath) {
            return undefined;
        }

        if (uri.scheme !== 'file' && uri.scheme !== 'vscode-remote') {
            return uri.scheme;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (workspaceFolder) {
            return path.relative(workspaceFolder.uri.fsPath, path.dirname(uri.fsPath)) || '.';
        }

        return path.dirname(uri.fsPath) || '.';
    }

    private formatUri(uri: vscode.Uri): string {
        return uri.scheme === 'file' ? uri.fsPath : uri.toString(true);
    }

    public async showTabsQuickPick(): Promise<void> {
        const quickPick = vscode.window.createQuickPick<TabQuickPickItem>();
        let disposed = false;
        let operationInProgress = false;

        const update = (): boolean => {
            if (disposed) {
                return false;
            }

            const selectedTabs = new Set(quickPick.selectedItems.map(item => item.tab));
            const activeTab = quickPick.activeItems[0]?.tab;
            const items = this.getAllTabs();
            if (items.length === 0) {
                quickPick.hide();
                return false;
            }

            quickPick.items = items;
            quickPick.selectedItems = items.filter(item => selectedTabs.has(item.tab));

            const activeItem = items.find(item => item.tab === activeTab);
            if (activeItem) {
                quickPick.activeItems = [activeItem];
            }

            return true;
        };

        const runOperation = async (
            operationName: string,
            operation: () => Thenable<boolean>
        ): Promise<boolean> => {
            if (operationInProgress || disposed) {
                return false;
            }

            operationInProgress = true;
            quickPick.busy = true;

            try {
                return await operation();
            } catch (error) {
                this.showOperationError(operationName, error);
                return false;
            } finally {
                operationInProgress = false;
                if (!disposed) {
                    quickPick.busy = false;
                }
            }
        };

        if (!update()) {
            quickPick.dispose();
            return;
        }

        quickPick.placeholder = '搜索；勾选后回车批量关闭；直接回车切换当前项';
        // 💡 关键恢复：重新开启多选
        quickPick.canSelectMany = true;
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // 按钮点击：单项切换或单项关闭
        quickPick.onDidTriggerItemButton(async (e) => {
            if (e.button === this.BUTTONS.SWITCH) {
                const switched = await runOperation('切换标签页', async () => {
                    await this.switchToTab(e.item);
                    return true;
                });
                if (switched) {
                    quickPick.hide();
                }
            } else if (e.button === this.BUTTONS.CLOSE) {
                const closed = await runOperation(
                    '关闭标签页',
                    () => vscode.window.tabGroups.close(e.item.tab)
                );
                if (closed) {
                    update();
                }
            }
        });

        // 💡 核心逻辑：处理 Enter 键
        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems;
            
            if (selected.length > 0) {
                // 如果有勾选，执行批量关闭
                const closed = await runOperation(
                    '批量关闭标签页',
                    () => this.closeSelectedTabs(selected)
                );
                if (closed) {
                    quickPick.hide();
                }
            } else {
                // 如果没勾选，则切换到当前光标所在的标签
                const activeItem = quickPick.activeItems[0];
                if (activeItem) {
                    if (!activeItem.canSwitch) {
                        void vscode.window.showInformationMessage(
                            'VS Code 未提供切换到此类标签页的公共接口，请在编辑器区域中打开它。'
                        );
                        return;
                    }

                    const switched = await runOperation('切换标签页', async () => {
                        await this.switchToTab(activeItem);
                        return true;
                    });
                    if (switched) {
                        quickPick.hide();
                    }
                }
            }
        });

        const liveUpdateDisposables = [
            vscode.window.tabGroups.onDidChangeTabs(update),
            vscode.window.tabGroups.onDidChangeTabGroups(update),
            vscode.workspace.onDidChangeConfiguration(event => {
                if (event.affectsConfiguration('tabManager')) {
                    update();
                }
            })
        ];

        quickPick.onDidHide(() => {
            disposed = true;
            liveUpdateDisposables.forEach(disposable => disposable.dispose());
            quickPick.dispose();
        });
        quickPick.show();
    }

    private async switchToTab(item: TabQuickPickItem) {
        if (item.tab.isActive) {
            return;
        }

        const options: vscode.TextDocumentShowOptions = {
            viewColumn: item.tab.group.viewColumn,
            preview: item.tab.isPreview
        };
        const input = item.tab.input;

        if (input instanceof vscode.TabInputText) {
            await vscode.commands.executeCommand('vscode.open', input.uri, options);
            return;
        }

        if (input instanceof vscode.TabInputTextDiff) {
            await vscode.commands.executeCommand(
                'vscode.diff',
                input.original,
                input.modified,
                item.tab.label,
                options
            );
            return;
        }

        if (input instanceof vscode.TabInputCustom) {
            await vscode.commands.executeCommand('vscode.openWith', input.uri, input.viewType, options);
            return;
        }

        if (input instanceof vscode.TabInputNotebook) {
            await vscode.commands.executeCommand('vscode.openWith', input.uri, input.notebookType, options);
            return;
        }

        if (input instanceof vscode.TabInputNotebookDiff) {
            await vscode.commands.executeCommand(
                'vscode.diff',
                input.original,
                input.modified,
                item.tab.label,
                options
            );
        }
    }

    private async closeSelectedTabs(items: readonly TabQuickPickItem[]): Promise<boolean> {
        const dirtyItems = items.filter(i => i.tab.isDirty);
        if (dirtyItems.length > 0) {
            const result = await vscode.window.showWarningMessage(
                `确定关闭这 ${items.length} 个标签页吗？其中包含未保存的文件。`,
                { modal: true }, '确定'
            );
            if (result !== '确定') {
                return false;
            }
        }

        return vscode.window.tabGroups.close(items.map(i => i.tab));
    }

    private showOperationError(operationName: string, error: unknown): void {
        const reason = error instanceof Error ? error.message : String(error);
        void vscode.window.showErrorMessage(`${operationName}失败：${reason}`);
    }
}
