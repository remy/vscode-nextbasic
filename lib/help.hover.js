const vscode = require('vscode');
const help = require('../nextbasic.json');

module.exports = main;

function main() {
  return vscode.languages.registerHoverProvider(['nextbasic'], {
    provideHover(document, position) {
      try {
        const wordRange = document.getWordRangeAtPosition(position);
        let token = document.getText(wordRange).toUpperCase();

        const selection = vscode.window.activeTextEditor.selection;
        if (selection) {
          if (
            position.line === selection.start.line &&
            position.character < selection.end.character &&
            position.character > selection.start.character
          ) {
            const terms = document
              .getText(selection)
              .toUpperCase()
              .split(' ')
              .reverse();
            token = terms.find(
              (token) => help.filter((_) => _.token === token).length
            );
          }
        }

        // bad match
        if (!token || token.length > 100) return;

        // ignore numbers, they give a false positive
        if (/\d/.test(token)) return;

        let matches = help.filter((_) => _.token === token);

        if (matches.length === 0) {
          matches.push(...help.filter((_) => _.modifies === token));
          matches.push(...help.filter((_) => _.token.endsWith(' ' + token)));
        }

        console.log(matches);

        let contents = null;
        if (matches.length === 1) {
          contents = matches[0];
        } else if (matches.length > 1) {
          // if we have a match, we should check the previous tokens
          const line = document
            .getText(
              new vscode.Range(
                new vscode.Position(position.line, 0),
                new vscode.Position(position.line, position.character - 1)
              )
            )
            .toUpperCase()
            .trim();

          let pick = matches.filter((a) => {
            if (a.token === line) return true;
            if (a.modifies === line) return true;
            if (a.modifies && line.includes(a.modifies)) {
              return true;
            }
          });

          if (pick.length === 0) {
            // see if there were any good matches in the original
            pick = matches.filter((a) => !a.modifies);
          }

          return {
            contents: pick.map(
              (contents) =>
                new vscode.MarkdownString(
                  `**${contents.syntax}**\n\n${contents.description}`
                )
            ),
          };
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
