export const LISTS_SIZE = "LISTS_SIZE";
export const ITEMS_SIZE = "ITEMS_SIZE";

export function setThumbnailSizeLists(listsSize: number) {
    return {
        type: LISTS_SIZE,
        payload: {
            listsSize
        }
    };
}

export function setThumbnailSizeItems(itemsSize: number) {
    return {
        type: ITEMS_SIZE,
        payload: {
            itemsSize
        }
    };
}
