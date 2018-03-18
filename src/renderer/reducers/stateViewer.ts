import * as ActionType from "../actions/stateViewer";

type MainMode = "p1" | "p2" | "auto" | "all";

interface State {
    viewerMode: MainMode;
    actionsBar: boolean;
    zoom: boolean;
    allImgSize: number;

    imgs: any[];
    imgsIdxs: number[];
    imgsPaths: string[];
    imgsDuble: boolean;
    favosUid: string;
    listsUid: string;
    itemsUid: string;
}

const initialState: State = {
    viewerMode: "auto",
    actionsBar: false,
    zoom: false,
    allImgSize: 70,

    imgs: [],
    imgsIdxs: [],
    imgsPaths: [],
    imgsDuble: false,
    favosUid: "",
    listsUid: "",
    itemsUid: ""
};

export default function stateViewer(state: State = initialState, { type, payload }): State {
    switch (type) {
        case "SET_VIEWER_MODE":
            return {
                ...state,
                viewerMode: payload.viewerMode
            };
        case "SET_ACTIONS_BAR":
            return {
                ...state,
                actionsBar: payload.actionsBar
            };
        case "SET_ZOOM":
            return {
                ...state,
                zoom: payload.zoom
            };
        case "SET_ALL_IMG_SIZE":
            return {
                ...state,
                allImgSize: payload.allImgSize
            };
        case "SET_IMAGE":
            return {
                ...state,
                imgs: payload.imgs,
                imgsIdxs: payload.imgsIdxs,
                ...createImgData(payload.imgs, payload.imgsIdxs),
                favosUid: payload.favosUid,
                listsUid: payload.listsUid,
                itemsUid: payload.itemsUid
            };
        case "SET_IMAGE_INDEX":
            return {
                ...state,
                imgs: payload.imgs,
                imgsIdxs: payload.imgsIdxs,
                ...createImgData(payload.imgs, payload.imgsIdxs)
            };
        default:
            return state;
    }
}

function createImgData(imgs: any[], imgsIdxs: number[]) {
    const imgsPaths = [];
    for (const idx of imgsIdxs) {
        if (imgs[idx] && imgs[idx].name) {
            imgsPaths.push(imgs[idx].path + encodeURIComponent(imgs[idx].name));
        }
    }

    return {
        imgsPaths,
        imgsDuble: imgsPaths.length === 2
    };
}
