// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import * as fs from 'fs'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('fs', fs)
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)