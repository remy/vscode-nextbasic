// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const newLineCommand = require('./lib/new-line.command');
const importBasicCommand = require('./lib/import-basic.command');
const exportBasic = require('./lib/export-basic.command');
const toggleCommentsCommand = require('./lib/toggle-comments.command');
const indent = require('./lib/indent.command');
const formatOnType = require('./lib/format-on-type.provider');
const definitions = require('./lib/definition.provider');
const formatter = require('./lib/formatter.provider');
const symbols = require('./lib/symbols.provider');
const hoverHelp = require('./lib/help.hover');
const runInCspect = require('./lib/auto-run.task');
const validationDiagnostic = require('./lib/validation.diagnostic');
const shift = require('./lib/shift.command');
const renumber = require('./lib/renumber.command');
const txt2basVersion = require('./lib/txt2bas-version.command');
const errorPicker = require('./lib/error-picker.command');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(newLineCommand());
  context.subscriptions.push(importBasicCommand());
  context.subscriptions.push(...exportBasic());
  context.subscriptions.push(toggleCommentsCommand());
  context.subscriptions.push(formatOnType());
  context.subscriptions.push(definitions());
  context.subscriptions.push(...formatter());
  indent(); // hooks and unhooks
  shift();
  context.subscriptions.push(renumber());
  context.subscriptions.push(symbols());
  context.subscriptions.push(hoverHelp());
  context.subscriptions.push(runInCspect(context.extensionPath));
  context.subscriptions.push(validationDiagnostic(context));
  context.subscriptions.push(txt2basVersion());
  context.subscriptions.push(errorPicker());
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
