const vscode = require('vscode');

module.exports = main;

function main() {
  vscode.languages.registerDocumentSymbolProvider(['nextbasic'], {
    provideDocumentSymbols(document) {
      try {
        const symbols = [];
        const lines = document.getText().split('\n');
        lines.forEach((line, lineNumber) => {
          if (
            line.toUpperCase().includes(`DEFPROC `) ||
            line.toUpperCase().includes('DEF FN')
          ) {
            // check for comments
            const match = line.match(/DEF(?:(?:PROC| FN))\s+(.*)\(/i);
            if (!match) return;
            const name = match[1];

            const start = new vscode.Position(lineNumber, line.indexOf(name));
            const end = new vscode.Position(
              lineNumber,
              line.indexOf(name) + name.length
            );

            symbols.push(
              new vscode.SymbolInformation(
                name,
                vscode.SymbolKind.Method,
                new vscode.Range(start, end)
              )
            );
          }
        });
        return symbols;
      } catch (e) {
        console.log(e.stack);
      }
    },
  });
}
