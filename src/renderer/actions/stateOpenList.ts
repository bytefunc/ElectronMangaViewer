export const SHOW_OPEN_LIST = "SHOW_OPEN_LIST";
export const CLOSE_OPEN_LIST = "CLOSE_OPEN_LIST";

export function showOpenList(favosIdx: number, listsIdx: number) {
    return {
        type: SHOW_OPEN_LIST,
        payload: {
            favosIdx,
            listsIdx
        }
    };
}

export function closeOpenList() {
    return {
        type: CLOSE_OPEN_LIST
    };
}
