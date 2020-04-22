# Change Log

All notable changes to the "nextbasic" extension will be documented in this file.

## [0.0.11] - 2020-04-22

- Warning notice for cygwin based hdfmonkey (tip: use [this](http://uto.speccy.org/downloads/hdfmonkey_windows.zip))

## [0.0.10] - 2020-04-21

- More specific error reporting
- Fixing paths when on Windows

## [0.0.9] - 2020-04-20

- Fix comments: cmd-/ (mac) or ctrl-/ (non-mac)
- Surface any errors in cspect booting
- Fix format on newline with number (alt+enter)

## [0.0.8] - 2020-04-20

- Windows support 🎉
- Allow "Run with cspect" to work on non-workspace directories
- Bump txt2bas to fix comment crunching

## [0.0.7] - 2020-04-19

- Pause after run to allow for fast exit of user code (testing)
- Bump [txt2bas](https://github.com/remy/txt2bas) dependency to 1.2.2

## [0.0.6] - 2020-04-17

- Fix comment shortcut taking over 😱 (again, sorry)
- Add cpsect launch support 🎉 (MacOS only at present, sorry…again)

## [0.0.5] - 2020-04-17

- Fix comment shortcut taking over 😱

## [0.0.3] - 2020-04-16

- On new line, the syntax is correctly capitalised (parsed into binary .bas and out to text)
- Toggle single and multi-line comments (using VS Code's standard toggle comment shortcut), plus configuration to change between
- New command "Convert .bas to text" to convert .bas binary to plain text
- Hover over keywords for help definition and syntax

## [0.0.2] - 2020-04-15

- Fix line number insertion at end of doc or empty lines

## [0.0.1] - 2020-04-15

- Initial release
