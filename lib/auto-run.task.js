const vscode = require('vscode');
const cp = require('child_process');
const { tmpdir } = require('os');
const { basename } = require('path');
const { writeFileSync } = require('fs');
const { file2bas } = require('txt2bas');

module.exports = main;

function exec(command, options) {
  return new Promise((resolve, reject) => {
    cp.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.log('exec fin', error);
        reject({ error, stdout, stderr });
      }
      resolve({ stdout, stderr });
    });
  });
}

function main(extensionPath) {
  return vscode.commands.registerCommand('nextbasic.run', async () => {
    const document = vscode.window.activeTextEditor.document;
    const workspaceRoot = vscode.workspace.rootPath;

    const {
      cspect,
      nextImagePath,
      hdfmonkeyPath: hdfmonkey,
      cspectOptions,
    } = vscode.workspace.getConfiguration('nextbasic');

    let commandLine = `${hdfmonkey} mkdir "${nextImagePath}" /devel`;
    try {
      await exec(commandLine, { cwd: workspaceRoot });
    } catch (e) {
      // ignore if exists
    }

    // push file into sdcard
    const filename = tmpdir() + '/index.bas';
    let text = document.getText();
    if (!text.includes('#autostart')) {
      text = `#autostart\n` + text;
    }

    const compile = true;

    if (compile) {
      writeFileSync(filename, file2bas(text), 'utf8');
      commandLine = `${hdfmonkey} put "${nextImagePath}" "${tmpdir()}/index.bas" /devel/index.bas`;
    } else {
      writeFileSync(filename, text, 'utf8');
      commandLine = `${hdfmonkey} put "${nextImagePath}" "${filename}" /devel/index.txt`;
    }

    await exec(commandLine, { cwd: workspaceRoot });

    commandLine = `${hdfmonkey} put "${nextImagePath}" ${extensionPath}/autoexec-${
      compile ? 'pre' : 'post'
    }-compiled.bas /nextzxos/autoexec.bas`;

    await exec(commandLine, { cwd: extensionPath });

    const files = await vscode.workspace.findFiles('*.*', '*.log');

    await Promise.all(
      files.map(({ path }) => {
        const cmd = `${hdfmonkey} put "${nextImagePath}" ${path} /devel/${basename(
          path
        )}`;
        return exec(cmd, { cwd: extensionPath });
      })
    );

    commandLine = `mono ${cspect} ${cspectOptions} -mmc=${nextImagePath}`;

    await exec(commandLine, { cwd: workspaceRoot });
  });
}
