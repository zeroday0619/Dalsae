import { remote } from 'electron';
// export interface Preload {
//   // asdf: () => void;
//   asdf2: () => void;
//   asdf3: () => void;
//   asdf4: () => void;
// }

export default class Preload {
  // constructor() {
  //   type PreloadWindow = typeof window & { preload: PreloadImpl };
  //   (window as PreloadWindow).preload = new PreloadImpl();
  // }
  // private static _instence: PreloadImpl;
  // static Instence() {
  //   if (!this._instence) {
  //   }
  // }
  ClickLink() {
    console.log('asdfasdf');
    const v = new remote.BrowserWindow({
      show: true,
      title: 'image-test',
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION
      }
    });
    // router.push()
    // v.loadURL(URL.format());
    v.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}/test`);
    v.webContents.openDevTools();
    v.on('ready-to-show', () => {
      console.log('show!');
      remote.ipcRenderer.send('Image', 'test');
      // console.log(ipcRenderer);
      // ipcRenderer.send('Image', 'test');
      // v.show();
    });
  }
  asdf2() {
    console.log('asdfasdf');
  }
  asdf3() {
    console.log('asdfasdf');
  }
  asdf4() {
    console.log('asdfasdf');
  }
}

type PreloadWindow = typeof window & { preload: Preload };
(window as PreloadWindow).preload = new Preload();

// export default new PreloadImpl();

//axios

// (window as any).asdf = () => {
//   console.log('happy birthday');
// };

// (window as any).create = () => {
//   const v = new remote.BrowserWindow();
//   v.show();
// };
