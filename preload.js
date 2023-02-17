const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('Cookie', {
    set: (k , v) => {
        ipcRenderer.send("set_cookie" , {key: k, value: v});
    },
    get: (key) => {
        return ipcRenderer.invoke("get_cookie" , key);
    },

    all: () => {
        return ipcRenderer.invoke("get_all_cookie");
    }
})

contextBridge.exposeInMainWorld('mainWindow', {
    setTitle: (title) => {
     ipcRenderer.send("set_title" , title);
    }
});