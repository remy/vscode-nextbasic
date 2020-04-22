const vscode = require('vscode');
const cp = require('child_process');
const { tmpdir, platform } = require('os');
const { sep, join } = require('path');
const { writeFileSync, readdirSync } = require('fs');
const { file2bas } = require('txt2bas');

module.exports = main;

function exec(command, options) {
  return new Promise((resolve, reject) => {
    cp.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        if (!command.includes('mkdir')) {
          console.log('exec fail', error);
        }
        reject(new Error(stderr.trim()));
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
      await exec(commandLine, { cwd: workspaceRoot }, false);
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
      commandLine = `${hdfmonkey} put "${nextImagePath}" "${join(
        tmpdir(),
        sep,
        'index.bas'
      )}" /devel/index.bas`;
    } else {
      writeFileSync(filename, text, 'utf8');
      commandLine = `${hdfmonkey} put "${nextImagePath}" "${filename}" /devel/index.txt`;
    }

    try {
      await exec(commandLine, { cwd: workspaceRoot });
    } catch (e) {
      if (e.message.includes('CYGWIN')) {
        vscode.window.showErrorMessage(
          'hdfmonkey failed (possibly using cygwin build - use hdfmonkey version linked in this extension readme):\n' +
            e.message
        );
      }
      if (e.message.includes('open()')) {
        vscode.window.showErrorMessage(
          'hdfmonkey put failed (possible path to Next img file):\n' + e.message
        );
      } else {
        vscode.window.showErrorMessage(
          'hdfmonkey put failed (possible bad path to hdfmonkey):\n' + e.message
        );
      }
      return;
    }

    commandLine = `${hdfmonkey} put "${nextImagePath}" ${join(
      extensionPath,
      sep,
      'autoexec-pre-compiled.bas'
    )} /nextzxos/autoexec.bas`;

    await exec(commandLine, { cwd: extensionPath });

    const files = readdirSync(workspaceRoot);

    await Promise.all(
      files.map((path) => {
        const cmd = `${hdfmonkey} put "${nextImagePath}" ${join(
          workspaceRoot,
          sep,
          path
        )} /devel/${path}`;
        return exec(cmd, { cwd: extensionPath });
      })
    );

    if (platform() === 'win32') {
      commandLine = `${cspect} ${cspectOptions} -mmc=${nextImagePath}`;
    } else {
      commandLine = `mono ${cspect} ${cspectOptions} -mmc=${nextImagePath}`;
    }

    try {
      await exec(commandLine, { cwd: extensionPath });
    } catch (e) {
      vscode.window.showErrorMessage('cspect exec failed: ' + e);
      return;
    }
  });
}
