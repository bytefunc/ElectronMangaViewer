import { getFolderImages } from "../utils/getFolderImages";
import { getFavosIndexs, getNextViewImage, getPrevViewImage, getViewImage } from "./functions";
import { setAlert } from "./stateAlert";
import { setMainMode } from "./stateApp";

export const SET_VIEWER_MODE = "SET_VIEWER_MODE";
export const SET_ACTIONS_BAR = "SET_ACTIONS_BAR";
export const SET_ZOOM = "SET_ZOOM";
export const SET_ALL_IMG_SIZE = "SET_ALL_IMG_SIZE";
export const SET_IMAGE = "SET_IMAGE";
export const SET_IMAGE_INDEX = "SET_IMAGE_INDEX";

export type ViewMode = "p1" | "p2" | "auto" | "all";

export function setViewerMode(viewerMode: ViewMode) {
    return {
        type: SET_VIEWER_MODE,
        payload: {
            viewerMode
        }
    };
}

export function setViewerActionsBar(actionsBar: boolean) {
    return {
        type: SET_ACTIONS_BAR,
        payload: {
            actionsBar
        }
    };
}

export function setViewerZoom(zoom: boolean) {
    return {
        type: SET_ZOOM,
        payload: {
            zoom
        }
    };
}

export function setViewerAllImgSize(allImgSize: number) {
    return {
        type: SET_ALL_IMG_SIZE,
        payload: {
            allImgSize
        }
    };
}

export function setImage(favosUid: string, listsUid: string, itemsUid: string, lastPage?: boolean) {
    return (dispatch, getState) => {
        const { stateApp, stateViewer } = getState();
        const { favos } = stateApp;
        const { viewerMode } = stateViewer;

        const [favosIdx, listsIdx, itemsIdx] = getFavosIndexs(favos, favosUid, listsUid, itemsUid);
        const path = favos[favosIdx].lists[listsIdx].items[itemsIdx].path;

        getFolderImages(path)
            .then(getImgs => {
                const imgs = getImgs.map(name => {
                    return {
                        name,
                        path
                    };
                });

                const imgsIdxs = getViewImage(viewerMode, imgs, lastPage ? [imgs.length - 1] : [0]);

                dispatch({
                    type: SET_IMAGE,
                    payload: {
                        imgs,
                        imgsIdxs,
                        favosUid,
                        listsUid,
                        itemsUid
                    }
                });
                dispatch(setMainMode("viewer"));
            })
            .catch(err => {
                dispatch(setAlert("image not found", path));
            });
    };
}

export function setImageIndex(idx: number, viewerMode: ViewMode) {
    return (dispatch, getState) => {
        const { imgs, imgsIdxs, viewerMode: view } = getState().stateViewer;
        if (typeof viewerMode === "undefined") {
            viewerMode = view;
        }
        const idxs: number[] = idx >= 0 ? [idx] : imgsIdxs;

        dispatch({
            type: SET_IMAGE_INDEX,
            payload: {
                imgs,
                imgsIdxs: getViewImage(viewerMode, imgs, idxs)
            }
        });
    };
}

export function nextImage(moveP1: boolean) {
    return (dispatch, getState) => {
        const { viewerMode, imgs, imgsIdxs } = getState().stateViewer;
        dispatch({
            type: SET_IMAGE_INDEX,
            payload: {
                imgs,
                imgsIdxs: getNextViewImage(viewerMode, imgs, imgsIdxs, moveP1)
            }
        });
    };
}

export function prevImage(moveP1: boolean) {
    return (dispatch, getState) => {
        const { viewerMode, imgs, imgsIdxs } = getState().stateViewer;
        dispatch({
            type: SET_IMAGE_INDEX,
            payload: {
                imgs,
                imgsIdxs: getPrevViewImage(viewerMode, imgs, imgsIdxs, moveP1)
            }
        });
    };
}

export function nextItem() {
    return (dispatch, getState) => {
        const { stateApp, stateViewer } = getState();
        const { favos } = stateApp;
        const { favosUid, listsUid, itemsUid } = stateViewer;
        const [favosIdx, listsIdx, itemsIdx] = getFavosIndexs(favos, favosUid, listsUid, itemsUid);
        const list = favos[favosIdx].lists[listsIdx];

        let nextItemIdx: number = itemsIdx + 1;
        if (itemsIdx === list.items.length - 1) {
            nextItemIdx = 0;
        }

        dispatch(setImage(favosUid, listsUid, list.items[nextItemIdx].uid));
    };
}

export function prevItem() {
    return (dispatch, getState) => {
        const { stateApp, stateViewer } = getState();
        const { favos } = stateApp;
        const { favosUid, listsUid, itemsUid } = stateViewer;
        const [favosIdx, listsIdx, itemsIdx] = getFavosIndexs(favos, favosUid, listsUid, itemsUid);
        const list = favos[favosIdx].lists[listsIdx];

        let prevItemIdx: number = itemsIdx - 1;
        if (prevItemIdx < 0) {
            prevItemIdx = list.items.length - 1;
        }

        dispatch(setImage(favosUid, listsUid, list.items[prevItemIdx].uid, true));
    };
}
