import * as React from "react";
import { ConnectDragSource, ConnectDropTarget, DragDropContext, DragSource, DropTarget } from "react-dnd";
import Config from "../../../config";

// scss
const styles = require("./index.scss");

// HOC components
import contextmenuList from "../../common/contextmenu/contextmenuList";
import eventDragItems from "../../common/eventDragItems";

interface Props {
    index: number;
    active: boolean;
    favosUid: string;
    favosIdx: number;
    list: {
        uid: string;
        name: string;
        items: any[];
    };
    imgSize: React.CSSProperties;
    titleWidth: React.CSSProperties;
    openList: {
        favosIdx: number;
        listsIdx: number;
    };
    backgroundColor: string;
    showOpenList: (favosIdx: number, listIdx: number) => void;
    closeOpenList: () => void;
    dragMove: (dragIndex: any, hoverIndex: any) => void;
    dragEnd: () => void;

    // DropTarget and DragSource
    isDragging?: boolean;
    connectDragSource?: ConnectDragSource;
    connectDropTarget?: ConnectDropTarget;
}

class List extends React.Component<Props, {}> {
    render(): JSX.Element {
        const {
            isDragging,
            connectDragSource,
            connectDropTarget,

            index: listIdx,
            favosIdx,
            list,
            imgSize,
            titleWidth,
            openList,
            showOpenList,
            closeOpenList,
            backgroundColor
        } = this.props;

        const opacity = isDragging ? 0 : 1;
        let listImage = <div className={styles.listEmpty} style={imgSize} />;
        if (list.items.length >= 1) {
            listImage = <img src={Config.PATH_THUMBNAIL + list.items[0].thumbnail} style={imgSize} alt="" />;
        }

        return connectDropTarget(
            connectDragSource(
                <div
                    className={styles.list + " js-list-box"}
                    style={{ opacity, backgroundColor }}
                    title={list.name}
                    data-lists-uid={list.uid}
                    onClick={() => {
                        if (favosIdx === openList.favosIdx && listIdx === openList.listsIdx) {
                            closeOpenList();
                        } else {
                            showOpenList(favosIdx, listIdx);
                        }
                    }}
                >
                    <div>
                        {listImage}
                        <p className={styles.listTitle} style={titleWidth}>
                            {list.name}
                        </p>
                    </div>
                </div>
            )
        );
    }
}

const eventSource = {
    beginDrag(props: Props) {
        props.closeOpenList();
        return {
            listUid: props.list.uid,
            index: props.index
        };
    },

    endDrag(props: Props, monitor) {
        props.dragEnd();
    },

    isDragging(props: Props, monitor) {
        const { uid: overUid } = props.list;
        const { listUid } = monitor.getItem();

        return listUid === overUid;
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

let List2 = DropTarget("list", eventTarget, connect => {
    return {
        connectDropTarget: connect.dropTarget()
    };
})(List);

List2 = DragSource("list", eventSource, (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
})(List2);

export default eventDragItems(contextmenuList(List2));
