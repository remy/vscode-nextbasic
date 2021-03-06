const vscode = require('vscode');
const cp = require('child_process');
const { tmpdir, platform } = require('os');
const { sep, join, dirname } = require('path');
const { writeFileSync, readdirSync } = require('fs');
const { file2bas, validateTxt } = require('txt2bas');
const parseError = require('./parse-error');

let subProcess = null;
let launching = false;

module.exports = main;

function exec(command, options) {
  return new Promise((resolve, reject) => {
    subProcess = cp.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        if (!command.includes('mkdir')) {
          console.log('exec fail', error);
        }
        reject(new Error(`${stderr.trim()}\n\n${stdout.trim()}`));
      }
      resolve({ stdout, stderr });
    });
  });
}

function main(extensionPath) {
  return vscode.commands.registerCommand('nextbasic.run', async () => {
    try {
      const editor = vscode.window.activeTextEditor;
      const document = editor.document;

      launching = true;

      // try to stop previous instance of cspect
      try {
        process.kill(subProcess.pid, 9);
      } catch (e) {}

      const {
        cspect,
        nextImagePath,
        hdfmonkeyPath: hdfmonkey,
        cspectOptions,
        copyLimit: limit,
      } = vscode.workspace.getConfiguration('nextbasic');

      let commandLine = `${hdfmonkey} mkdir "${nextImagePath}" /devel`;
      try {
        await exec(commandLine, { cwd: extensionPath }, false);
      } catch (e) {
        // ignore if exists
      }

      // push file into sdcard
      const filename = tmpdir() + '/index.bas';
      let text = document.getText().replace(/\r/g, '');
      let autostartAdded = false;
      if (!text.includes('#autostart')) {
        text = `#autostart\n` + text;
        autostartAdded = true;
      }

      // first make a backup of their autoexec
      let autoexec = tmpdir() + '/autoexec.bas';
      commandLine = `${hdfmonkey} get "${nextImagePath}" /nextzxos/autoexec.bas "${autoexec}"`;

      try {
        await exec(commandLine, { cwd: extensionPath });

        // getting this far means the file exists, so let's back it up.
      } catch (e) {
        if (
          e.message.toLowerCase().includes('error opening file: file not found')
        ) {
          // cspect worked but there's no autoexec.bas
          autoexec = null;
        } else if (e.message.includes('CYGWIN')) {
          vscode.window.showErrorMessage(
            'hdfmonkey failed (possibly using cygwin build - use hdfmonkey version linked in this extension readme):\n' +
              e.message
          );
        } else if (e.message.includes('open()')) {
          vscode.window.showErrorMessage(
            'hdfmonkey failed (possible path to Next img file):\n' + e.message
          );
        } else {
          vscode.window.showErrorMessage(
            'hdfmonkey failed (possible bad path to hdfmonkey):\n' + e.message
          );
        }

        // this means that the problem wasn't that the file was missing, but a fatal
        // cspect exec problem - so we bail.
        if (autoexec) {
          return;
        }
      }

      commandLine = `${hdfmonkey} put "${nextImagePath}" "${join(
        extensionPath,
        sep,
        'autoexec-pre-compiled.bas'
      )}" /nextzxos/autoexec.bas`;

      await exec(commandLine, { cwd: extensionPath });

      const root = dirname(document.fileName);
      let cwd = extensionPath;

      if (root && root !== '.') {
        cwd = root;
        const files = readdirSync(root);

        if (files.length > limit) {
          console.error(
            `Not copying files from ${root}, too many files: ${files.length}`
          );
          vscode.window.showErrorMessage(
            `Not copying files from ${root} to cspect image, too many files: ${files.length} (limit is user configured to ${limit})`
          );
        } else {
          const commands = files
            .filter((_) => !_.startsWith('.') && !_.includes(' ')) // skip space files, no worth the hassle
            .map((path) => {
              return `${hdfmonkey} put "${nextImagePath}" "${join(
                root,
                sep,
                path
              )}" /devel/`;
            });

          console.log(`Copying ${commands.length} files across`);
          for (let i = 0; i < commands.length; i++) {
            await exec(commands[i], { cwd: extensionPath });
            // console.log(commands[i]);
          }
        }
      }

      const errors = validateTxt(text);

      if (errors.length) {
        vscode.window
          .showWarningMessage(
            'Some errors found in your NextBASIC',
            ...errors[0].split('\n').filter((_) => _.startsWith('>'))
          )
          .then((selected) => {
            if (selected) {
              const e = parseError(selected);
              if (autostartAdded) {
                e.line -= 1;
              }
              const start = new vscode.Position(e.line, e.start);
              const end = new vscode.Position(e.line, e.end);
              var newSelection = new vscode.Selection(start, end);
              editor.selection = newSelection;
            }
          });
      }

      // finally send the source
      writeFileSync(
        filename,
        file2bas(text, { validate: false, defines: true }),
        'utf8'
      );
      commandLine = `"${hdfmonkey}" put "${nextImagePath}" "${join(
        tmpdir(),
        sep,
        'index.bas'
      )}" /devel/index.bas`;

      await exec(commandLine, { cwd: extensionPath });

      if (platform() === 'win32') {
        commandLine = `"${cspect}" ${cspectOptions} -mmc=${nextImagePath}`;
      } else {
        commandLine = `mono "${cspect}" ${cspectOptions} -mmc=${nextImagePath}`;
      }

      try {
        launching = false;
        await exec(commandLine, { cwd });

        console.log(`restoring ${autoexec}`);

        // now put their original autoexec back
        if (autoexec) {
          commandLine = `${hdfmonkey} put "${nextImagePath}" "${autoexec}" /nextzxos/autoexec.bas`;
          await exec(commandLine, { cwd: extensionPath });
        }
      } catch (e) {
        if (!launching) {
          if (e.message.includes('Error loading ROM')) {
            vscode.window.showErrorMessage(
              'cspect failed - error loading ROM. Ensure the ROM is in the same directory your Next .img file.'
            );
            return;
          }
          if (nextImagePath.includes(' ')) {
            vscode.window.showErrorMessage(
              'cspect failed - try moving the Next image path to a directory *without* spaces.'
            );
            return;
          }

          // this was an exec error, not a forced shutdown
          console.log(e.stack);
          vscode.window.showErrorMessage('cspect exec failed: ' + e);
        }
        return;
      }
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  });
}
