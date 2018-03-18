import { nativeImage } from "electron";
import imageSize from "fast-image-size";

/**
 * get the index from favos and lists index of favos and items index of lists
 */
export function getFavosIndexs(favos: any[], favosUid: string, listsUid?: string, itemsUid?: string): any[] {
    let favosIdx: number | null = null,
        listsIdx: number | null = null,
        itemsIdx: number | null = null;

    for (let i = 0; i < favos.length; i++) {
        if (favos[i].uid === favosUid) {
            favosIdx = i;
            if (listsUid) {
                const lists = favos[i].lists;
                for (let i2 = 0; i2 < lists.length; i2++) {
                    if (lists[i2].uid === listsUid) {
                        listsIdx = i2;
                        if (itemsUid) {
                            const items = lists[i2].items;
                            for (let i3 = 0; i3 < items.length; i3++) {
                                if (items[i3].uid === itemsUid) {
                                    itemsIdx = i3;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return [favosIdx, listsIdx, itemsIdx];
}

/**
 * get image inf and calculate for image indexes
 */
export function getViewImage(viewerMode: string, imgs: any[], idxs: number[]): number[] {
    if (imgs.length === 0) {
        return [];
    }

    if (viewerMode === "p2" || viewerMode === "auto") {
        if (imgs.length <= 1) {
            return [idxs[0]];
        }
        let p1: number = idxs[0];
        let p2: number = -1;

        // check page 1 spread (viewMode is auto)
        if (viewerMode === "auto" && isSpreadImage(imgs, p1)) {
            return [p1];
        }

        if (idxs.length === 2) {
            p2 = idxs[1];
        } else {
            if (idxs[0] + 1 >= imgs.length) {
                p1 = idxs[0] - 1;
                p2 = idxs[0];
            } else {
                p2 = idxs[0] + 1;
            }
        }

        // check page 2 spread (viewMode is auto)
        if (viewerMode === "auto" && isSpreadImage(imgs, p2)) {
            return [p1];
        }

        return [p1, p2];
    } else {
        // 1page mode view

        return [idxs[0]];
    }
}

/**
 * calculate for next image indexes
 */
export function getNextViewImage(viewerMode: string, imgs: any[], idxs: number[], moveP1: boolean): number[] {
    if (imgs.length === 0) {
        return [];
    }

    if (viewerMode === "p2" || viewerMode === "auto") {
        if (imgs.length === 1) {
            return [0];
        }

        let p1: number = idxs[0] + 1;
        let p2: number = idxs[0] + 2;

        if (!moveP1 && idxs.length === 2) {
            p1 = p1 + 1;
            p2 = p2 + 1;
        }

        // check over index
        if (p1 >= imgs.length) {
            p1 = imgs.length - 1;
        }
        if (p2 >= imgs.length) {
            p1 = imgs.length - 2;
            p2 = imgs.length - 1;
        }

        // 2page mode view
        if (viewerMode === "p2") {
            return [p1, p2];
        }

        // auto mode view
        if (viewerMode === "auto" && !isSpreadImage(imgs, p1) && !isSpreadImage(imgs, p2)) {
            // auto 2 page
            return [p1, p2];
        } else if (viewerMode === "auto" && p2 === imgs.length - 1) {
            return [imgs.length - 1];
        } else {
            return [p1];
        }
    } else {
        // 1page mode view

        const p1: number = idxs[0] + 1;
        if (imgs.length === 1 || p1 >= imgs.length) {
            return [0];
        }
        return [p1];
    }
}

/**
 * calculate for previous image indexes
 */
export function getPrevViewImage(viewerMode: string, imgs: any[], idxs: number[], moveP1: boolean): number[] {
    if (imgs.length === 0) {
        return [];
    }

    if (viewerMode === "p2" || viewerMode === "auto") {
        if (imgs.length === 1) {
            return [0];
        }

        let p1: number = idxs[0] - 1;
        let p2: number = idxs[0];

        if (imgs.length === 2) {
            p2 -= 1;
        }
        if (!moveP1) {
            p1 -= 1;
            p2 -= 1;
        }

        // check over index
        if (p1 < 0) {
            p1 = 0;
            p2 = 1;
        }

        // 2page mode view
        if (viewerMode === "p2") {
            return [p1, p2];
        }

        // auto mode view
        if (viewerMode === "auto" && !isSpreadImage(imgs, p1) && !isSpreadImage(imgs, p2)) {
            return [p1, p2];
        } else if (viewerMode === "auto" && idxs[0] === 1) {
            return [0];
        } else {
            return [p2];
        }
    } else {
        // 1page mode view

        const p1: number = idxs[0] - 1;
        if (imgs.length === 1 || p1 < 0) {
            return [imgs.length - 1];
        }
        return [p1];
    }
}

/**
 * check for an image spread
 */
function isSpreadImage(imgs: any[], pageIdx: number): boolean {
    if (!imgs[pageIdx]) {
        return false;
    }
    const size = getImageSize(imgs[pageIdx].path + imgs[pageIdx].name);

    if (size.height && size.height <= size.width * 1.3) {
        return true;
    }
    return false;
}

/**
 * get for image size
 * "image-size" function has bugs for jpg (buffer error) so instead use of nativeImage
 */
function getImageSize(pathImg: string) {
    try {
        const result = pathImg.match(/(jpg$|jpeg$)/gi);
        let size;
        if (result) {
            const image = nativeImage.createFromPath(pathImg);
            size = image.getSize();
        } else {
            size = imageSize(pathImg);
        }
        return {
            height: size.height,
            width: size.width
        };
    } catch (e) {
        return null;
    }
}
