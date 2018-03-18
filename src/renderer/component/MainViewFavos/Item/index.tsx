import * as React from "react";
import { ConnectDragSource, ConnectDropTarget, DragDropContext, DragSource, DropTarget } from "react-dnd";
import Config from "../../../config";

// componet
import contextmenuItem from "../../common/contextmenu/contextmenuItem";

// scss
const styles = require("./index.scss");

interface Props {
    index: number;
    favosUid: string;
    listUid: string;
    item: {
        uid: string;
        path: string;
        thumbnail: string;
    };
    imgSize: React.CSSProperties;
    clickImages: (favosUid: string, listsUid: string, itemsUid: string) => void;
    removeFavosItems: (favosUid: string, listsUid: string, itemsUid: string) => void;
    dragMove: (dragIndex: any, hoverIndex: any) => void;
    dragEnd: () => void;

    // DropTarget and DragSource
    isDragging?: boolean;
    connectDragSource?: ConnectDragSource;
    connectDropTarget?: ConnectDropTarget;
}

class Item extends React.Component<Props, {}> {
    getFolderName(path: string): string {
        return path.match(/([^\\]*)\\*$/)[1];
    }

    render(): JSX.Element {
        const {
            isDragging,
            connectDragSource,
            connectDropTarget,

            favosUid,
            listUid,
            item,
            imgSize,
            clickImages,
            removeFavosItems
        } = this.props;

        const opacity = isDragging ? 0 : 1;

        return connectDropTarget(
            <div className={styles.item} style={{ opacity }}>
                {connectDragSource(
                    <img
                        src={Config.PATH_THUMBNAIL + item.thumbnail}
                        title={this.getFolderName(item.path)}
                        onClick={() => {
                            clickImages(favosUid, listUid, item.uid);
                        }}
                        style={imgSize}
                        alt=""
                    />
                )}
                <span
                    className={styles.itemClose}
                    title="削除する"
                    onClick={() => removeFavosItems(favosUid, listUid, item.uid)}
                />
            </div>
        );
    }
}

const eventSource = {
    beginDrag(props: Props) {
        return {
            itemUid: props.item.uid,
            index: props.index
        };
    },

    endDrag(props: Props, monitor) {
        props.dragEnd();
    },

    isDragging(props: Props, monitor) {
        const { uid: overUid } = props.item;
        const { itemUid } = monitor.getItem();

        return itemUid === overUid;
    }
};

const eventTarget = {
    canDrop() {
        return false;
    },

    hover(props: Props, monitor, component) {
        const { index: hoverIndex } = props;
        const { index: dragIndex } = monitor.getItem();

        if (dragIndex === hoverIndex) {
            return;
        }

        props.dragMove(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};

let Item2 = DropTarget("items", eventTarget, connect => {
    return {
        connectDropTarget: connect.dropTarget()
    };
})(Item);

Item2 = DragSource("items", eventSource, (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
})(Item2);

export default contextmenuItem(Item2);
