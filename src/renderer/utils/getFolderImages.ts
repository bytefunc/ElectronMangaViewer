import sort from "alphanum-sort";
import * as fs from "fs";

/**
 * get all image files from a specified directory
 */
export function getFolderImages(dir: string) {
    return new Promise<number[]>((resolve, reject) => {
        const permission = ["jpeg", "jpg", "png", "gif"]; // 取得するファイル拡張子
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(new Error("not find"));
                return;
            }

            const imgs = [];
            if (files) {
                files.forEach(f => {
                    const extention = getFileExtension(f);
                    if (permission.indexOf(extention) >= 0) {
                        imgs.push(f);
                    }
                });
            }

            resolve(sort(imgs));
        });
    });
}

/**
 * get the extention from a file name
 */
function getFileExtension(filename: string): string {
    const e = filename.split(".");
    if (e.length === 1) {
        return "";
    }
    return e.pop();
}
