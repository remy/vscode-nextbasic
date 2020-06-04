# Change Log

All notable changes to the "nextbasic" extension will be documented in this file.

## [1.3.13] - 2020-06-04

- txt2bas@1.10.8 fixes: validation on IF statements and int functions

## [1.3.12] - 2020-06-03

- txt2bas@1.10.7 fixes: SPRITE CONT encoding and validation around PLOT, DRAW

## [1.3.11] - 2020-05-30

- txt2bas@1.10.5 validation around integer expressions and INT

## [1.3.10] - 2020-05-29

- Add user configurable limit to files copied to cspect image
- Add warnings when export fails or run has validation errors
- Fix highlight function names
- txt2bas@1.10.3 fixes validation checks and fraction encoding

## [1.3.9] - 2020-05-28

- Fix missing first line on windows

## [1.3.8] - 2020-05-28

- Fix GAAHH txt2bas@1.10.1 - bad parsing in autostart

## [1.3.7] - 2020-05-28

- Fix: revert autoexec back to precompiled.

## [1.3.6] - 2020-05-27

- Bump for txt2bas@1.10.0 - fixes channel number parsing, adds better validation and fixes some int expression parsing.

## [1.3.5] - 2020-05-25

- Minor bug fixes:
  - new line at start of line inserts blank correctly
  - enter only applies when editor is focused (and not when searching)

## [1.3.4] - 2020-05-19

- Fix single line shift renumbering

## [1.3.3] - 2020-05-19

- Fix use #program as default filename on export
- Fix better #autoline support (indent, line shift, new line)

## [1.3.2] - 2020-05-18

- Fix format leading whitespace (via txt2bas update)

## [1.3.1] - 2020-05-17

- Fix format document

## [1.3.0] - 2020-05-17

- Add autoline support
- Fix don't send files with spaces to cspect

## [1.2.1] - 2020-05-17

- Fix new line on last line (first time it was adding 2 lines)
- Update readme

## [1.2.0] - 2020-05-17

- Add line renumbering
- Add support for editor.action.moveLinesUpAction/editor.action.moveLinesDownAction with line number updates
- Fix push active working directory into cspect (not root workspace), and ignore hidden files

## [1.1.1] - 2020-05-13

- Fix - forgot to package txt2bas!
- Fix back-indent on Mac
- Add new line number and format upon enter (controllable through settings)

## [1.1.0] - 2020-05-13

- Fix and restore validation (but inline only)
- Fix windows export to bas (fixes #1)
- Add format document support
- Add indentation keyboard support
- txt2bas@1.7.4

## [1.0.1] - 2020-05-06

- Emergency patch - validation clearly needed some work!

## [1.0.0] - 2020-05-06

- Add inline validation
- Upgrade to latest txt2bas (new parsing engine)
- Fix ensure user code is last to be sent to Cspect (avoid conflicts with cwd)
- Shutdown previously spawned Cspect instances
- Show NextBASIC errors on compile and launch Cspect
- Bump to stable release

## [0.0.13] - 2020-04-25

- Add export to NextBASIC file
- Add missing syntax highlighting (including: `OPEN`, `REG`, `DPEEK`, `DPOKE` and others)
- Highlight stream/channel numbers
- Update txt2bas to fix weird corruption of characters

## [0.0.12] - 2020-04-24

- Add symbol lookup support - to jump to `DEFPROC` and `DEF FN`
- Update txt2bas to support blank lines and `#` leading lines

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
