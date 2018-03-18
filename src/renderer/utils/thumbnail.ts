import electronImageResize from "electron-image-resize";
import * as fs from "fs";
import rimraf from "rimraf";
import shortid from "shortid";
import Config from "../config";

/**
 * create a thumbnail folder
 * @return {promise} return thumbnail folder path
 */
export function createThumbnailFolder(favosUid: string) {
    return new Promise<string>((resolve, reject) => {
        const saveDir = Config.PATH_THUMBNAIL;
        fs.mkdir(saveDir, err => {
            if (err && err.code !== "EEXIST") {
                reject(err);
                return;
            }
            fs.mkdir(saveDir + favosUid, err2 => {
                if (err2 && err2.code !== "EEXIST") {
                    reject(err2);
                    return;
                }
                resolve(saveDir + favosUid);
            });
        });
    });
}

/**
 * remove a thumbnail favos folder
 * @return {promise}
 */
export function removeThumbnailFolder(favosUid: string) {
    return new Promise<boolean>((resolve, reject) => {
        rimraf(Config.PATH_THUMBNAIL + favosUid, err => {
            resolve(true);
        });
    });
}

/**
 * write a thumbnail image to the thumbnail directory
 */
export function createThumbnail(favosUid: string, imgPath: string) {
    return new Promise<string>((resolve, reject) => {
        const saveDir = Config.PATH_THUMBNAIL + favosUid + "\\";
        const uniqueName = shortid.generate() + ".jpg";
        createThumbnailFolder(favosUid)
            .then(() => {
                electronImageResize({
                    url: "file://" + imgPath,
                    width: 250
                })
                    .then(img => {
                        fs.writeFileSync(saveDir + uniqueName, img.toJpeg(70));
                        resolve(favosUid + "\\" + uniqueName);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * remove a thumbnail image from the thumbnail directory
 */
export function removeThumbnail(pathThumbnail: string) {
    return new Promise<boolean>((resolve, reject) => {
        fs.unlink(Config.PATH_THUMBNAIL + pathThumbnail, err => {
            resolve(true);
        });
    });
}
