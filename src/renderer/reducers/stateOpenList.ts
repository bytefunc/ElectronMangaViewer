import * as ActionType from "../actions/stateOpenList";

interface State {
    favosIdx: number;
    listsIdx: number;
}

const initialState: State = {
    favosIdx: -1,
    listsIdx: -1
};

export default function stateOpenList(state: State = initialState, { type, payload }): State {
    switch (type) {
        case "SHOW_OPEN_LIST":
            return {
                ...state,
                favosIdx: payload.favosIdx,
                listsIdx: payload.listsIdx
            };
        case "CLOSE_OPEN_LIST":
            return {
                ...state,
                favosIdx: -1,
                listsIdx: -1
            };
        default:
            return state;
    }
}
