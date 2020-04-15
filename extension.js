// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { EOL } = require("os");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const f = require("txt2bas");
  console.log(Object.keys(f), f.formatText);
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "nextbasic.new-line-with-number",
      function () {
        try {
          // The code you place here will be executed every time your command is executed
          const editor = vscode.window.activeTextEditor;
          const document = editor.document;
          const selection = editor.selection;
          const position = selection.end;

          const currentPosition = document.getWordRangeAtPosition(
            new vscode.Position(position.line, 0)
          );
          let currentLine = currentPosition
            ? document.getText(currentPosition).split(" ")[0]
            : null;

          // if we can't find anything, just drop in a new line, we're nice like that.
          if (currentLine === null) {
            editor.insertSnippet(
              new vscode.SnippetString(`$0\n`),
              new vscode.Position(position.line + 1, 0)
            );
            return;
          }

          const nextLinePos = document.getWordRangeAtPosition(
            new vscode.Position(position.line + 1, 0)
          );

          let nextLine = nextLinePos
            ? document.getText(nextLinePos).split(" ")[0]
            : "9999";

          if (currentLine && nextLine) {
            currentLine = parseInt(currentLine, 10);

            if (isNaN(currentLine)) {
              return;
            }

            nextLine = parseInt(nextLine, 10);

            if (isNaN(nextLine)) {
              nextLine = 9999;
            }

            let d = currentLine + (((nextLine - currentLine) / 2) | 0);
            if (d !== nextLine && d !== currentLine) {
              if (d - currentLine > 10) d = currentLine + 10;
            }

            const onLastLine =
              position.line + 1 === document.getText().split("\n").length;

            editor.insertSnippet(
              new vscode.SnippetString(`${onLastLine ? "\n" : ""}${d} $0\n`),
              new vscode.Position(position.line + 1, 0)
            );
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(
      ["nextbasic"],
      {
        provideOnTypeFormattingEdits(document, position, ch) {
          try {
            const line = document.lineAt(position.line - 1).text;
            const formatted = formatText(line);
            const editor = vscode.window.activeTextEditor;

            console.log(line);
            console.log(formatted);

            editor.edit((editBuilder) => {
              editBuilder.replace(
                new vscode.Location(position.line - 1, position.character),
                formatted
              );
            });
          } catch (e) {
            console.log(e);
          }
        },
      },
      EOL
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(["nextbasic"], {
      provideDefinition(document, position) {
        try {
          const token = document.getWordRangeAtPosition(position);

          const line = document
            .lineAt(position)
            .text.substring(0, token.start.character)
            .trim()
            .toLowerCase();

          const jumpTerms = [
            "goto",
            "go to",
            "gosub",
            "go sub",
            "proc",
            "then",
            "line",
            "proc",
          ];

          if (jumpTerms.find((_) => line.endsWith(_))) {
            const lines = document.getText().split("\n");
            const lineNumber = document.getText(token);
            let line = null;
            if (/^\d+$/.test(lineNumber)) {
              line = lines.findIndex((line) =>
                line.startsWith(lineNumber + " ")
              );
            } else {
              line = lines.findIndex((line) =>
                line.includes(`DEFPROC ${lineNumber}(`)
              );
            }

            if (line != null && line > -1) {
              const pos = new vscode.Position(line, 0);
              return new vscode.Location(document.uri, pos);
            }
          }
        } catch (e) {
          console.log(e.message);
        }
      },
    })
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
