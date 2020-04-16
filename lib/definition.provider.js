const vscode = require("vscode");

module.exports = main;

function main() {
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
            line = lines.findIndex((line) => line.startsWith(lineNumber + " "));
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
  });
}
