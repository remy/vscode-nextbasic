const vscode = require('vscode');
const help = require('../nextbasic.json');

module.exports = main;

function main() {
  return vscode.languages.registerHoverProvider(['nextbasic'], {
    provideHover(document, position) {
      try {
        const wordRange = document.getWordRangeAtPosition(position);
        const token = document.getText(wordRange).toUpperCase();

        // ignore numbers, they give a false positive
        if (/\d/.test(token)) return;

        let matches = help.filter((_) => _.token === token);

        if (matches.length === 0) {
          matches.push(...help.filter((_) => _.modifier === token));
          matches.push(...help.filter((_) => _.token.endsWith(' ' + token)));
        }

        let contents = null;
        if (matches.length === 1) {
          contents = matches[0];
        } else if (matches.length > 1) {
          // if we have a match, we should check the previous tokens
          const line = document.getText(
            new vscode.Range(
              new vscode.Position(position.line, 0),
              new vscode.Position(position.line, position.character - 1)
            )
          );
          matches.sort((a, b) => {
            if (a.token === line.toUpperCase()) return 1;
            return line.toUpperCase().lastIndexOf(a.token) <
              line.toUpperCase().lastIndexOf(b.token)
              ? 1
              : -1;
          });
          contents = matches[0];
        }

        if (contents) {
          return {
            contents: [
              new vscode.MarkdownString(
                `**${contents.syntax}**\n\n${contents.description}`
              ),
            ],
          };
        }
      } catch (e) {
        console.log(e.message);
      }
    },
  });
}
