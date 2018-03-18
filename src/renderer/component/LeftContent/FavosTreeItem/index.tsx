import * as React from "react";
import { ConnectDragSource, ConnectDropTarget, DragSource, DropTarget } from "react-dnd";

// scss
const styles = require("./index.scss");

interface Props {
    index: number;
    active: boolean;
    favo: any;
    favoUid: string;
    clickFavos: (favosUid: string) => void;
    dragMove: (dragIndex: any, hoverIndex: any) => void;
    dragEnd: () => void;

    // DropTarget and DragSource
    isDragging?: boolean;
    connectDragSource?: ConnectDragSource;
    connectDropTarget?: ConnectDropTarget;
}

class FavosTreeItem extends React.Component<Props, {}> {
    render(): JSX.Element {
        const { active, favo, isDragging, clickFavos, connectDragSource, connectDropTarget } = this.props;

        const opacity = isDragging ? 0 : 1;
        const classActive = active ? styles.active : "";

        return connectDragSource(
            connectDropTarget(
                <a
                    className={styles.treeItem + " " + classActive}
                    style={{ opacity }}
                    onClick={() => {
                        clickFavos(favo.uid);
                    }}
                >
                    <span className="icon icon-star" />
                    <span className={styles.itemName}>{favo.name} </span>
                </a>
            )
        );
    }
}

const eventSource = {
    beginDrag(props: Props) {
        return {
            favoUid: props.favoUid,
            index: props.index
        };
    },

    endDrag(props: Props, monitor) {
        props.dragEnd();
    },

    isDragging(props: Props, monitor) {
        const { favoUid: overUid } = props;
        const { favoUid } = monitor.getItem();

        return favoUid === overUid;
    }
};

const eventTarget = {
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

let FavosTreeItem2 = DropTarget("favos", eventTarget, connect => {
    return {
        connectDropTarget: connect.dropTarget()
    };
})(FavosTreeItem);

FavosTreeItem2 = DragSource("favos", eventSource, (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
})(FavosTreeItem2);

export default FavosTreeItem2;
