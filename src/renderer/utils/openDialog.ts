import { remote } from "electron";

const browserWindow = remote.BrowserWindow;
const dialog = remote.dialog;

/**
 * get folder path from the Dialog
 */
export function openDialog() {
    return new Promise<string>((resolve, reject) => {
        dialog.showOpenDialog(
            browserWindow.getFocusedWindow(),
            {
                properties: ["openDirectory"]
            },
            directories => {
                if (directories) {
                    directories.forEach(dir => {
                        resolve(dir + "\\");
                    });
                }
            }
        );
    });
}
