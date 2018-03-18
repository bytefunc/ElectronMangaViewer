import shortid from "shortid";

import { getFolderImages } from "../utils/getFolderImages";
import { openDialog } from "../utils/openDialog";
import { createThumbnail, removeThumbnail, removeThumbnailFolder } from "../utils/thumbnail";
import { getFavosIndexs } from "./functions";

export const SET_MAIN_MODE = "SET_MAIN_MODE";
export const SET_NAVI_FAVOS = "SET_NAVI_FAVOS";
export const UPDATE_FAVOS = "UPDATE_FAVOS";

export function setMainMode(mainMode: "favos" | "viewer") {
    return {
        type: SET_MAIN_MODE,
        payload: {
            mainMode
        }
    };
}

export function setNaviFavos(naviFavosUid: string) {
    return (dispatch, getState) => {
        const { favos } = getState().stateApp;
        const [naviFavosIdx] = getFavosIndexs(favos, naviFavosUid);

        dispatch({
            type: SET_NAVI_FAVOS,
            payload: {
                naviFavosUid,
                naviFavosIdx
            }
        });
    };
}

export function setFavos(favos: any[]) {
    return (dispatch, getState) => {
        const { naviFavosUid } = getState().stateApp;

        const [naviFavosIdx] = getFavosIndexs(favos, naviFavosUid);

        dispatch({
            type: UPDATE_FAVOS,
            payload: {
                favos
            }
        });
        dispatch({
            type: SET_NAVI_FAVOS,
            payload: {
                naviFavosUid,
                naviFavosIdx
            }
        });
    };
}

export function addFavos(favosName: string) {
    return (dispatch, getState) => {
        const { naviFavosUid, favos } = getState().stateApp;
        const [naviFavosIdx] = getFavosIndexs(favos, naviFavosUid);

        favos.push({
            uid: shortid.generate(),
            name: favosName,
            lists: []
        });

        dispatch({
            type: UPDATE_FAVOS,
            payload: {
                favos
            }
        });
        dispatch({
            type: SET_NAVI_FAVOS,
            payload: {
                naviFavosUid,
                naviFavosIdx
            }
        });
    };
}

export function removeFavos(favosUid: string) {
    return (dispatch, getState) => {
        const { naviFavosUid, favos } = getState().stateApp;
        const [favosIdx] = getFavosIndexs(favos, favosUid);

        removeThumbnailFolder(favosUid).then(() => {
            favos.splice(favosIdx, 1);
            const [naviFavosIdx] = getFavosIndexs(favos, naviFavosUid);

            dispatch({
                type: UPDATE_FAVOS,
                payload: {
                    favos
                }
            });
            dispatch({
                type: SET_NAVI_FAVOS,
                payload: {
                    naviFavosUid,
                    naviFavosIdx
                }
            });
        });
    };
}

export function renameFavos(favosUid: string, favosName: string) {
    return (dispatch, getState) => {
        const { favos } = getState().stateApp;
        const [favosIdx] = getFavosIndexs(favos, favosUid);

        favos[favosIdx].name = favosName;

        dispatch({
            type: UPDATE_FAVOS,
            payload: {
                favos
            }
        });
    };
}

export function addFavosLists(favosUid: string, listName: string) {
    return (dispatch, getState) => {
        const { favos } = getState().stateApp;
        const [favosIdx] = getFavosIndexs(favos, favosUid);
        const uniqueId: shortid = shortid.generate();

        favos[favosIdx].lists.push({
            uid: uniqueId,
            name: listName,
            items: []
        });

        dispatch({
            type: UPDATE_FAVOS,
            payload: {
                favos
            }
        });
    };
}

export function removeFavosLists(favosUid: string, listsUid: string) {
    return (dispatch, getState) => {
        const { favos } = getState().stateApp;
        const [favosIdx, listsIdx] = getFavosIndexs(favos, favosUid, listsUid);
        const items = favos[favosIdx].lists[listsIdx].items;

        // delete thumbnail
        if (items) {
            const funcs = [];
            for (const item of items) {
                removeThumbnail(item.thumbnail);
            }
        }

        favos[favosIdx].lists.splice(listsIdx, 1);

        dispatch({
            type: UPDATE_FAVOS,
            payload: {
                favos
            }
        });
    };
}

export function renameFavosLists(favosUid: string, listsUid: string, listName: string) {
    return (dispatch, getState) => {
        const { favos } = getState().stateApp;
        const [favosIdx, listsIdx] = getFavosIndexs(favos, favosUid, listsUid);

        favos[favosIdx].lists[listsIdx].name = listName;

        dispatch({
            type: UPDATE_FAVOS,
            payload: {
                favos
            }
        });
    };
}

export function addFavosItems(favosUid: string, listsUid: string, folderPaths: any[]) {
    return (dispatch, getState) => {
        if (folderPaths.length === 0) {
            return;
        }
        const folderPath: string = folderPaths.pop();
        const uniqueId: shortid = shortid.generate();

        getFolderImages(folderPath)
            .then(imgs => {
                if (imgs.length === 0) {
                    return;
                }
                createThumbnail(favosUid, folderPath + imgs[0])
                    .then(thumbnail => {
                        const { favos } = getState().stateApp;
                        const [favosIdx, listsIdx] = getFavosIndexs(favos, favosUid, listsUid);

                        favos[favosIdx].lists[listsIdx].items.push({
                            uid: uniqueId,
                            thumbnail,
                            path: folderPath
                        });

                        dispatch({
                            type: UPDATE_FAVOS,
                            payload: {
                                favos
                            }
                        });
                        dispatch(addFavosItems(favosUid, listsUid, folderPaths));
                    })
                    .catch(reason => {
                        return;
                    });
            })
            .catch(reason => {
                return;
            });
    };
}

export function removeFavosItems(favosUid: string, listsUid: string, itemsUid: string) {
    return (dispatch, getState) => {
        const { favos } = getState().stateApp;
        const [favosIdx, listsIdx, itemsIdx] = getFavosIndexs(favos, favosUid, listsUid, itemsUid);
        const item = favos[favosIdx].lists[listsIdx].items[itemsIdx];

        favos[favosIdx].lists[listsIdx].items.splice(itemsIdx, 1);

        removeThumbnail(item.thumbnail).then(() => {
            dispatch({
                type: UPDATE_FAVOS,
                payload: {
                    favos
                }
            });
        });
    };
}

export function addFavosItemsDialog(favosUid: string, listsUid: string) {
    return dispatch => {
        openDialog().then(path => {
            dispatch(addFavosItems(favosUid, listsUid, [path]));
        });
    };
}
