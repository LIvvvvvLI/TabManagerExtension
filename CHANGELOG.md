# Change Log

All notable changes to Tab Manager are documented in this file.

## [Unreleased]

### Added

- Support listing text, text diff, custom editor, notebook, notebook diff, webview, terminal, and unknown editor tabs.
- File icon theme integration on VS Code 1.108 and newer.
- File name and extension category icons as a fallback on VS Code 1.92–1.107.
- URI-aware path display.
- Live QuickPick updates when tabs, editor groups, or Tab Manager settings change.
- User-facing error messages for failed switch and close operations.
- Server workflow option for creating a draft release with the generated VSIX.

### Changed

- Preserve the original editor group and preview state when switching supported resource tabs.
- Activate the extension only when its contributed command is invoked.
- Keep selected and focused QuickPick items when the list refreshes.
- Keep the QuickPick open when an unsaved-file confirmation is cancelled.
- Align public documentation with the implemented feature set and server-only distribution flow.

### Removed

- Startup-ready notification.
- Inactive settings for item spacing, folder grouping, and maximum visible items.
- Obsolete local build, test, and deployment instructions.

## [2.0.0] - 2024-03-19

### Added

- Searchable QuickPick list for open resource tabs.
- Single-tab switching and closing actions.
- Multi-select batch closing with unsaved-file confirmation.
- Relative and absolute path display preferences.
- Editor title action and `Ctrl/Cmd+Alt+T` shortcut.

## [1.0.0] - 2024-01-01

### Added

- Initial Tab Manager extension structure and command.
