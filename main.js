const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, Menu ,ipcMain} = require("electron")

const path_ = path.join(process.env.Home , "AppData/Local/LopHocApp/cookie.json");


function createMainWindow() {
    const mainWin = new BrowserWindow({
        title: "lop hoc",
        autoHideMenuBar: true,
        width: 1000,
        height: 600,
        minWidth: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    ipcMain.on("setTitle", (sender, title) => {
        mainWin.setTitle(title);
    })

    ipcMain.on("set_cookie", (sender, data) => {
        let rawdata = fs.readFileSync(path_);
        let cookie = JSON.parse(rawdata);
        cookie[data.key] = data.value;
        let str = JSON.stringify(cookie);
        fs.writeFileSync(path_, str);
    })

    ipcMain.handle("get_cookie", (event, key) => {
        let rawdata = fs.readFileSync(path_);
        let cookie = JSON.parse(rawdata);
        return cookie[key];
    })

    ipcMain.handle("get_all_cookie", (event) => {
        let rawdata = fs.readFileSync(path_);
        let cookie = JSON.parse(rawdata);
        return cookie;
    })

    mainWin.loadFile(path.join(__dirname, "./renderer/html/home.html"));
}

app.whenReady().then(() => { createMainWindow(); });

app.on('window-all-closed', () => {
    let str = JSON.stringify({});
        fs.writeFileSync(path_, str);
    if (process.platform !== 'darwin') app.quit()
})