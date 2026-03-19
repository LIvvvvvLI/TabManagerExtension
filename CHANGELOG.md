# Change Log

All notable changes to the "Tab Manager" extension will be documented in this file.

## [2.0.0] - 2024-03-19

### Added

- **File Type Icons**: Display file type icons for each tab based on file extension
  - Support for 100+ file types including JavaScript, TypeScript, Python, Java, Go, Rust, etc.
  - Special icons for config files (package.json, tsconfig.json, .env, etc.)
  - Icons for documentation files (README, LICENSE, CHANGELOG)
  - Icons for media files (images, audio, video)
  - Icons for archive files (zip, tar, gz)
  - Icons for database files (sql, prisma)
- New `fileIconMapper.ts` module for comprehensive file icon mapping
- Improved visual appearance with consistent icon display

### Changed

- Enhanced QuickPick UI with file icons
- Better file type recognition

## [1.0.0] - 2024-01-01

### Added

- Initial release
- Show all open tabs in a QuickPick list
- Multi-select tabs for batch closing
- Close button on each tab item
- Close all tabs except active
- Close tabs to the right
- Close tabs to the left
- Editor title bar button
- Keyboard shortcut (Ctrl/Cmd + Alt + T)
- Configuration options for display preferences
- Support for unsaved file warnings
