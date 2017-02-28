'use babel';

import path from 'path';
import fs from 'fs';
import url from 'url';
import { BufferedProcess, CompositeDisposable } from 'atom';
import { remote } from 'electron';
import JSON5 from 'json5';

const packagePath = atom.packages.resolvePackagePath('atom-live-server');
const liveServer = path.join(packagePath, '/node_modules/live-server/live-server.js');
const node = path.resolve(process.env.NODE_PATH, '../../app/apm/bin/node');

let serverProcess;
let disposeMenu;
let noBrowser;

function addStartMenu() {
  disposeMenu = atom.menu.add(
    [{
      label: 'Packages',
      submenu : [{
        label: 'atom-live-server',
        submenu : [{
          label: 'Start server',
          command: `atom-live-server:startServer`
        }]
      }]
    }]
  );
}

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-live-server:start-3000': () => this.startServer(3000),
      'atom-live-server:start-4000': () => this.startServer(4000),
      'atom-live-server:start-5000': () => this.startServer(5000),
      'atom-live-server:start-8000': () => this.startServer(8000),
      'atom-live-server:start-9000': () => this.startServer(9000),
      'atom-live-server:startServer': () => this.startServer(),
      'atom-live-server:stopServer': () => this.stopServer()
    }));

    addStartMenu();
  },

  deactivate() {
    this.stopServer();
    this.subscriptions.dispose();
  },

  startServer(port = 3000) {
    if (serverProcess) {
      return;
    }

    const targetPath = atom.project.getPaths()[0];

    if (!targetPath) {
      atom.notifications.addWarning('[Live Server] You haven\'t opened a Project, you must open one.')
      return;
    }

    noBrowser = false;
    const args = [];
    const stdout = output => {
      if (output.indexOf('Serving ') === 0) {
        const serverUrl = output.split(' at ')[1];
        const port = url.parse(serverUrl).port;
        const disposeStartMenu = disposeMenu;
        disposeMenu = atom.menu.add(
          [{
            label: 'Packages',
            submenu : [{
              label: 'atom-live-server',
              submenu : [{
                label: output.replace('Serving ', 'Stop '),
                command: `atom-live-server:stopServer`
              }]
            }]
          }]
        );

        disposeStartMenu.dispose();

        if (noBrowser) {
          atom.notifications.addSuccess(`[Live Server] Live server started at ${serverUrl}.`);
        }
      }

      console.log(`[Live Server] ${output}`);
    };

    const exit = code => {
      console.info(`[Live Server] Exited with code ${code}`);
      this.stopServer();
    }

    fs.open(path.join(targetPath, '.atom-live-server.json'), 'r', (err, fd) => {
      if (!err) {
        const userConfig = JSON5.parse(fs.readFileSync(fd, 'utf8'));

        Object.keys(userConfig).forEach(key => {
          if (key === 'no-browser') {
            if (userConfig[key] === true) {
              args.push(`--${key}`);
              noBrowser = true;
            }
          }
          else if (key === 'root') {
              args.unshift(`${userConfig[key]}`)
            }
          else {
              args.push(`--${key}=${userConfig[key]}`);
          }
        });
      }

      if (!args.length) {
        args.push(`--port=${port}`);
      }

      args.unshift(liveServer);

      serverProcess = new BufferedProcess({
        command: node,
        args,
        stdout,
        exit,
        options: {
          cwd: targetPath,
        }
      });

      console.info(`[Live Server] live-server ${args.join(' ')}`);
    });
  },

  stopServer() {
    try {
      serverProcess.kill();
    } catch (e) {
      console.error(e);
    }

    serverProcess = null;
    const disposeStopMenu = disposeMenu;
    addStartMenu();
    disposeStopMenu && disposeStopMenu.dispose();
    atom.notifications.addSuccess('[Live Server] Live server is stopped.');
  }
};
