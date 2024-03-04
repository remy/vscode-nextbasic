# NextBASIC VSCode Syntax

ZX Spectrum NextBASIC syntax highlighting for Visual Studio Code.

![vscode-nextbasic demo](https://user-images.githubusercontent.com/13700/84424388-f00f9600-ac17-11ea-88f3-cd14a082d38f.gif)

## Video: how to setup your NextBASIC dev workflow

This video installation walk through is shown on a Mac but is the same process for Windows and Linux: **[Watch on YouTube](https://www.youtube.com/watch?v=Hg-Uu4QWK1E&feature=youtu.be)**

## Features

- Supports 2.08+ NextBASIC syntax
- Import and export binary NextBASIC files
- Full NextBASIC syntax, including new `;` comment support
- Jump to definition for `GO TO` and `PROC` statements
- Symbol lookup (for `DEFPROC` and `DEF FN`)
- Renumbering for whole doc, selected lines or line swap
- Simple syntax validator
- Indentation support
- ctrl/cmd+enter will insert a new line with line number pre-populated
- Format on edit and format full document
- Collapse DEFPROC
- Help on hover
- Export to .bas as +3DOS format or .tap
- Support directives: `#autostart n`, `#autoline n,m`, `#program str` and custom `#define key=value` (and replaces `#key` instances in BASIC)
- Support for `#bank` and `#bankfile` to auto split your code in both "run with cspect" and "export"

## Cspect support

Prerequisites:

- Install [Cspect](https://dailly.blogspot.com/) (see right hand sidebar)
- Install [hdfmonkey](https://github.com/gasman/hdfmonkey) (ideally stored in `$PATH`) ([Windows version here](http://uto.speccy.org/downloads/hdfmonkey_windows.zip))
- (MacOS only) Install [mono](https://formulae.brew.sh/formula/mono) via `brew install mono`

**Important Windows users** ensure you use the hdfmonkey build from uto.speccy.org (link above) - it's built _without_ cygwin as a dependency.

Update `nextbasic` configuration in VS Code, which requires the location of cspect.exe (yes, even on a Mac) and the Next img file.

Video explanation coming soon.

_Note that using `NextBASIC: run with cspect` will overwrite your `autoexec.bas` file on the cspect image._

## Hat tips

Credit to Rob Uttley for solving the autoexec and `#autostart`.

Credit to @kounch for their superb original work on [vscode_zx](https://github.com/kounch/vscode_zx) (cspect, ZEsarUX and zxbasic - BASIC to asm support)

Original syntax based specifically on the work by [jsanjose](https://github.com/jsanjose/zxbasic-vscode) - and modified to specifically support NextBASIC.
