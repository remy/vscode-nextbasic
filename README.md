# NextBASIC VSCode Syntax

ZX Spectrum NextBASIC syntax highlighting for Visual Studio Code.

Based specifically on the great work by [jsanjose](https://github.com/jsanjose/zxbasic-vscode) - and modified to specifically support NextBASIC.

## Features

- Full NextBASIC syntax, including new `;` comment support
- Jump to definition for `GO TO` and `PROC` statements
- ctrl/cmd+enter will insert a new line with line number pre-populated
- Format on edit
- Collapse DEFPROC
- Help on hover

## Cspect support

Currently MacOS only (Windows coming soon!). Prerequisites:

- Install [mono](https://formulae.brew.sh/formula/mono) via `brew install mono`
- Install [Cspect](https://dailly.blogspot.com/) (see right hand sidebar)
- Install [hdfmonkey](https://github.com/gasman/hdfmonkey) (ideally stored in `$PATH`)

Update `nextbasic` configuration in VS Code, which requires the location of cspect.exe (yes, on a Mac) and the Next img file.

Video explanation coming soon.

_Note that using `NextBASIC: run with cspect` will overwrite your `autoexec.bas` file on the cspect image._

## Hat tips

Credit to Rob Uttley for solving the autoexec and `#autostart`.

Credit to @kounch for their original work on [vscode_zx](https://github.com/kounch/vscode_zx)
