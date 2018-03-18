import * as ActionType from "../actions/stateApp";

type MainMode = "favos" | "viewer";

interface State {
    mainMode: MainMode;
    naviFavosUid: string;
    naviFavosIdx: number;
    favos: any[];
}

const initialState: State = {
    mainMode: "favos",
    naviFavosUid: "f1",
    naviFavosIdx: 0,
    favos: [
        {
            uid: "f1",
            name: "お気に入り",
            folderThumbnail: "default",
            lists: [
                {
                    uid: "l1",
                    name: "新しいリスト",
                    items: []
                }
            ]
        }
    ]
};

export default function stateApp(state: State = initialState, { type, payload }): State {
    switch (type) {
        case "SET_MAIN_MODE":
            return {
                ...state,
                mainMode: payload.mainMode
            };
        case "SET_NAVI_FAVOS":
            return {
                ...state,
                naviFavosUid: payload.naviFavosUid,
                naviFavosIdx: payload.naviFavosIdx
            };
        case "UPDATE_FAVOS":
            return {
                ...state,
                favos: payload.favos
            };
        default:
            return state;
    }
}
