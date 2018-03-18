import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateApp from "../../../actions/stateApp";
import * as stateOpenList from "../../../actions/stateOpenList";
import * as stateThumbnailSize from "../../../actions/stateThumbnailSize";
import * as stateViewer from "../../../actions/stateViewer";

// components
import Item from "../Item";

// HOC components
import contextmenuList from "../../common/contextmenu/contextmenuList";
import eventDragItems from "../../common/eventDragItems";

// scss
const styles = require("./index.scss");

interface Props {
    backgroundColor: string;
    stateApp: {
        naviFavosUid: string;
        naviFavosIdx: number;
        favos: any[];
    };
    stateThumbnailSize: {
        itemsSize: number;
    };
    stateOpenList: {
        favosIdx: number;
        listsIdx: number;
    };
    removeFavosLists: (favosUid: string, listsUid: string) => void;
    renameFavosLists: (favosUid: string, listsUid: string, listName: string) => void;
    clickAddFolder: (favosUid: string, listsUid: string) => void;
    setFavos: (favos: any[]) => void;
    setImage: (favosUid: string, listsUid: string, itemsUid: string, lastPage?: boolean) => void;
    setThumbnailSizeItems: (itemsSize: number) => void;
    closeOpenList: () => void;
}

interface State {
    favos: any[];
    favosIdx: number;
    favosUid: string;
    listsIdx: number;
    inputListName: string;
}

class Items extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            favos: null,
            favosIdx: -1,
            favosUid: "",
            listsIdx: -1,
            inputListName: ""
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.props.closeOpenList);
    }

    componentWillMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.updateState(nextProps);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.props.closeOpenList);
    }

    updateState = (props: Props) => {
        const { favos, naviFavosUid, naviFavosIdx } = props.stateApp;
        const { listsIdx } = props.stateOpenList;

        const list = favos[naviFavosIdx].lists[listsIdx];

        this.setState({
            favos,
            favosIdx: naviFavosIdx,
            favosUid: naviFavosUid,
            listsIdx,
            inputListName: list.name
        });
    };

    changeListName = (favosUid: string, listsUid: string, e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ inputListName: e.currentTarget.value });
        this.props.renameFavosLists(favosUid, listsUid, e.currentTarget.value);
    };

    confirmRmLists = (favosUid: string, listsUid: string) => {
        if (window.confirm("本当にこのリストを削除しますか？")) {
            this.props.closeOpenList();
            this.props.removeFavosLists(favosUid, listsUid);
        }
    };

    clickImages = (favosUid: string, listUid: string, itemUid: string) => {
        this.props.setImage(favosUid, listUid, itemUid);
    };

    getArrowIconMargin = () => {
        const { listsIdx } = this.props.stateOpenList;

        const $list: any = document.getElementsByClassName("js-list-box")[listsIdx];
        return $list.offsetLeft + $list.offsetWidth / 2;
    };

    // drag & drop (react-dnd)
    dragMove = (dragIndex: number, hoverIndex: number) => {
        const { favos, favosIdx, listsIdx } = this.state;
        const dragItem = favos[favosIdx].lists[listsIdx].items[dragIndex];

        this.state.favos[favosIdx].lists[listsIdx].items.splice(dragIndex, 1);
        this.state.favos[favosIdx].lists[listsIdx].items.splice(hoverIndex, 0, dragItem);
        this.setState(this.state);
    };

    // drag & drop (react-dnd)
    dragEnd = () => {
        const favos = this.state.favos;
        this.props.setFavos(favos);
    };

    render(): JSX.Element {
        const { backgroundColor, stateOpenList: openList } = this.props;
        const { favos, naviFavosUid, naviFavosIdx } = this.props.stateApp;
        const { itemsSize } = this.props.stateThumbnailSize;
        const { inputListName } = this.state;

        const list = favos[naviFavosIdx].lists[openList.listsIdx];

        const imgSize: React.CSSProperties = {
            width: itemsSize * 0.7 + "px",
            height: itemsSize * 1.0 + "px"
        };

        return (
            <div className={styles.itemsBox + " items-open"} data-lists-uid={list.uid} style={{ backgroundColor }}>
                <div className={styles.iconArrow} style={{ left: this.getArrowIconMargin() + "px" }} />
                <input
                    type="range"
                    className={styles.imgResize}
                    min="100"
                    max="400"
                    onChange={e => {
                        this.props.setThumbnailSizeItems(Number(e.target.value));
                    }}
                    value={itemsSize}
                    title="画像サイズ"
                />
                <div className={styles.buttonBox}>
                    <button
                        className="btn btn-default"
                        title="フォルダーの追加"
                        onClick={() => {
                            this.props.clickAddFolder(naviFavosUid, list.uid);
                        }}
                    >
                        <span className="icon icon-plus" />
                    </button>
                    <button
                        className="btn btn-default"
                        title="リストの削除"
                        onClick={() => {
                            this.confirmRmLists(naviFavosUid, list.uid);
                        }}
                    >
                        <span className="icon icon-cancel" />
                    </button>
                </div>
                <div className={styles.listTitle}>
                    <input
                        type="text"
                        className=""
                        maxLength={25}
                        value={inputListName}
                        onChange={this.changeListName.bind(this, naviFavosUid, list.uid)}
                    />
                </div>
                <div className={styles.item}>
                    {list.items.map((item, i) => {
                        return (
                            <Item
                                key={item.uid}
                                index={i}
                                favosUid={naviFavosUid}
                                listUid={list.uid}
                                item={item}
                                imgSize={imgSize}
                                dragMove={this.dragMove}
                                dragEnd={this.dragEnd}
                                clickImages={this.clickImages}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        stateApp: state.stateApp,
        stateThumbnailSize: state.stateThumbnailSize,
        stateOpenList: state.stateOpenList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeFavosLists: bindActionCreators(stateApp.removeFavosLists, dispatch),
        renameFavosLists: bindActionCreators(stateApp.renameFavosLists, dispatch),
        clickAddFolder: bindActionCreators(stateApp.addFavosItemsDialog, dispatch),
        setFavos: bindActionCreators(stateApp.setFavos, dispatch),
        setImage: bindActionCreators(stateViewer.setImage, dispatch),
        setThumbnailSizeItems: bindActionCreators(stateThumbnailSize.setThumbnailSizeItems, dispatch),
        closeOpenList: bindActionCreators(stateOpenList.closeOpenList, dispatch)
    };
};

export default eventDragItems(contextmenuList(connect(mapStateToProps, mapDispatchToProps)(Items)));
