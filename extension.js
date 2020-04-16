// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const newLineCommand = require('./lib/new-line.command');
const importBasicCommand = require('./lib/import-basic.command');
const toggleCommentsCommand = require('./lib/toggle-comments.command');
const formatOnType = require('./lib/format-on-type.provider');
const definitions = require('./lib/definition.provider');
const hoverHelp = require('./lib/help.hover');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(newLineCommand());
  context.subscriptions.push(importBasicCommand());
  context.subscriptions.push(toggleCommentsCommand());
  context.subscriptions.push(formatOnType());
  context.subscriptions.push(definitions());
  context.subscriptions.push(hoverHelp());
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
