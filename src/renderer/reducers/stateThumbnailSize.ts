import * as ActionType from "../actions/stateThumbnailSize";

interface State {
    listsSize: number;
    itemsSize: number;
}

const initialState: State = {
    listsSize: 220,
    itemsSize: 220
};

export default function stateThumbnailSize(state: State = initialState, { type, payload }): State {
    switch (type) {
        case "LISTS_SIZE":
            return {
                ...state,
                listsSize: payload.listsSize
            };
        case "ITEMS_SIZE":
            return {
                ...state,
                itemsSize: payload.itemsSize
            };
        default:
            return state;
    }
}
