# Change Log

All notable changes to the "nextbasic" extension will be documented in this file.

## [1.11.6] - 2024-03-28

- Fix integer expression with additive arithmetic [#54](https://github.com/remy/vscode-nextbasic/issues/54)

## [1.11.5] - 2024-03-18

- Include strip comments option in "Run with cspect" if enabled
- Strip comments no longer triggers re-number (tx2bas fix)
- Show messaging when comments are stripped (it's the only mutation)

## [1.11.4] - 2024-03-13

- Support string modifiers: `a$[<+->]`
- Support floating hex and binary values: `a = $DEAD.EFF` or `b = @11.11`
- Fix auto numbering when explicit `#autoline` is toggled
- Bug fixes in txt2bas, including validation fixes

## [1.11.3] - 2024-03-08

- Add ctrl+shift+e / cmd+shift+e for export keyboard shortcut
- Fix splitbank sync (finally) fixed [#47](https://github.com/remy/vscode-nextbasic/issues/47)

## [1.11.2] - 2024-03-07

- keyword now resets int function [#48](https://github.com/remy/vscode-nextbasic/issues/48)
- reset int function on `;` in `PRINT` statement [#49](https://github.com/remy/vscode-nextbasic/issues/49)
- fixed main program not being synced properly when using split banks [#47](https://github.com/remy/vscode-nextbasic/issues/47) - all three, thanks @NealeTools for the issues
- bump to txt2bas@1.19.3

## [1.11.1] - 2024-03-04

- txt2bas@1.19.2 - fixed bank splitting error: "EROFS: read-only file system"

## [1.11.0] - 2024-03-04

- Support for #bank and #bankfile landed, this will split create bank files and sync these across to cspect during development, but also during export
- Note that with bank splitting, during "run with cspect" the banks are saved in a tmp directory and don't overwrite local files. Only during "export" are the banks stored in the working directory
- txt2bas@1.19.0 - restored support for inline IF/THEN statements + split bank
- Add config option for mono, defaults to reading from the path

## [1.10.0] - 2024-02-28

- txt2bas@1.18.0 - updated to support 2.08 IF and ELSE IF statements and additional new syntax, including TIME$, TIME, EXIT, PRIVATE and REF

## [1.9.0] - 2023-08-24

- txt2bas@1.17.0 - updated to _start_ to support 2.08 NextBASIC

## [1.8.5] - 2021-02-05

- txt2bas@1.16.3 - fix defines combined with code that uses streams and channels

## [1.8.4] - 2021-01-23

- Fix: highlight defines with underscores properly

## [1.8.3] - 2021-01-18

- docs - remove iframe and simplify link to video

## [1.8.2] - 2021-01-18

- txt2bas@1.16.1 - fix eager slurping of tokens when #define token is used

## [1.8.1] - 2021-01-18

- Fix: fix to support mixed case error codes (i.e. A or a works)

## [1.8.0] - 2021-01-18

- Add: support for underscores in #define values
- Add: error code lookup command

## [1.7.2] - 2021-01-12

- Fix: run cspect in project directory so logs, dumps, etc are project specific

## [1.7.1] - 2020-12-21

- Docs: include video walkthrough of installation

## [1.7.0] - 2020-12-18

- Add: restore the original autoexec.bas allowing authors to use cspect with their own autoexec
- txt2bas@1.15.5 - fix numeric exponent encoding (i.e. PRINT 1e6 works)

## [1.6.2] - 2020-12-15

- txt2bas@1.15.4 - fix export and validator around expressions in PRINT and other small validation tweaks

## [1.6.1] - 2020-11-01

- Fix: quick simplify - use \A for UDG A (instead of \UDGA)

## [1.6.0] - 2020-11-01

- Add: UDG character support through simple escaped "\A" where x is A-U
- txt2bas@1.15.0

## [1.5.9] - 2020-10-23

- txt2bas@1.14.9: ensure `#define` statements keep the proper tokenised values, important around using a define on a numeric then later casting as an int: https://github.com/remy/txt2bas/issues/26 (original release didn't bump correctly)

## [1.5.8] - 2020-09-25

- Fix Windows carriage return and remove them during file formatting or export.

## [1.5.7] - 2020-09-25

- txt2bas@1.14.9: ensure `#define` statements keep the proper tokenised values, important around using a define on a numeric then later casting as an int: https://github.com/remy/txt2bas/issues/26

## [1.5.6] - 2020-09-24

- txt2bas@1.14.8: multiple patches for print-ish (`INPUT` included) validation

## [1.5.5] - 2020-09-24

- txt2bas@1.14.5: quick patch for `SPRITE PRINT` with wrong validation error

## [1.5.4] - 2020-09-24

- Fix issue when definition lookup fails if `DEFPROC` is in a comment
- txt2bas@1.14.4: smarter validation around PRINT(like) statements

## [1.5.3] - 2020-09-15

- Fix issues in format document when spaces were being incorrectly striped
- Add expose the current txt2bas version (useful for debugging)

## [1.5.2] - 2020-09-10

- Add more detailed error reporting if cspect fails to launch

## [1.5.1] - 2020-09-06

- txt2bas@1.14.1: small validation fixes around `#define` and values.

## [1.5.0] - 2020-09-06

- Add export to .tap
- Fix # definitions being striped when in "normal" non-autoline mode

## [1.4.8] - 2020-09-06

- Fix spaces in Windows paths
- Add support for stripping comments from exports
- Fix extra space in uncomment with semi-colons
- txt2bas@1.14.0: add support for #define statements, strip comments support

## [1.4.7] - 2020-07-17

- txt2bas@1.12.10: fixes parsing error in int expression functions (like `% SPRITE OVER`) and it's arguments in parens.

## [1.4.6] - 2020-07-17

- txt2bas@1.12.8: fixes validator of int expressions after colon
- Fix Allow cspect to launch even with validation errors

## [1.4.5] - 2020-07-16

- Fix new line (sometimes) clipping end of line during format
- txt2bas@1.12.7: Error on bank lines > 256 bytes, many validation tweaks plus edge case encoding issues

## [1.4.4] - 2020-06-30

- Fix recursive directory send to Cspect
- txt2bas@1.12.4: bug fix in parser for `UNTIL` and integers

## [1.4.3] - 2020-06-24

- txt2bas@1.12.2: fixes parsing error in dot command arguments

## [1.4.2] - 2020-06-21

- txt2bas@1.12.1: fixes int after `INT` parsing, and fixes dot commands after `ON ERROR`

## [1.4.1] - 2020-06-14

- txt2bas@1.12.0: encoding and validation fixes (around `PEEK$`), and better integer expression support

## [1.4.0] - 2020-06-12

- Add "export to BANK" option for exporting code to `BANK` binary, allowing for `LOAD "file" BANK a`
- Add import also supports importing BANKed NextBASIC files

## [1.3.15] - 2020-06-11

- Fix missing `PLAY` keyword
- txt2bas@1.10.12: validation fixes

## [1.3.14] - 2020-06-08

- Add more hover help and improve lookups
- Fix to send supporting files to cspect in sequence to mitigate race condition
- txt2bas@1.10.11: validation fixes, and encoding fix on `MOD` statements

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
