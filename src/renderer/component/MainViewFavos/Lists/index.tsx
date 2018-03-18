import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateApp from "../../../actions/stateApp";
import * as stateOpenList from "../../../actions/stateOpenList";
import * as stateViewer from "../../../actions/stateViewer";

// components
import Items from "../Items";
import List from "../List";

// scss
const styles = require("./index.scss");

interface Props {
    stateApp: {
        naviFavosUid: string;
        naviFavosIdx: number;
        favos: any[];
    };
    stateOpenList: {
        favosIdx: number;
        listsIdx: number;
    };
    stateThumbnailSize: {
        listsSize: number;
    };
    setFavos: (favos: any[]) => void;
    addFavosLists: (favosUid: string, listName: string) => void;
    showOpenList: (favosIdx: number, listsIdx: number) => void;
    closeOpenList: () => void;
}

interface State {
    favos: any[];
    favosIdx: number;
    favosUid: string;
}

class Lists extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            favos: null,
            favosIdx: -1,
            favosUid: ""
        };
    }

    componentDidMount() {
        this.props.closeOpenList();
    }

    componentWillMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.updateState(nextProps);
    }

    updateState = (props: Props) => {
        const { favos, naviFavosIdx, naviFavosUid } = props.stateApp;

        this.setState({
            favos,
            favosIdx: naviFavosIdx,
            favosUid: naviFavosUid
        });
    };

    getOpenListInsertIndex = () => {
        const { naviFavosIdx } = this.props.stateApp;
        const { stateOpenList: openList } = this.props;

        if (openList.favosIdx === naviFavosIdx) {
            const listIdx: number = openList.listsIdx;
            const $lists: any = document.querySelectorAll(".js-list-box");
            if (!$lists[listIdx]) {
                return -1;
            }
            const $list: any = $lists[listIdx];

            const top = $list.offsetTop + window.pageYOffset;
            let insertIdx = $lists.length - 1;
            for (let i = 0; i < $lists.length; i++) {
                if (top < $lists[i].offsetTop + window.pageYOffset) {
                    insertIdx = i - 1;
                    break;
                }
            }
            return insertIdx;
        }
        return -1;
    };

    // drag & drop (react-dnd)
    dragMove = (dragIndex: number, hoverIndex: number) => {
        const { favos, favosIdx } = this.state;
        const dragItem = favos[favosIdx].lists[dragIndex];

        this.state.favos[favosIdx].lists.splice(dragIndex, 1);
        this.state.favos[favosIdx].lists.splice(hoverIndex, 0, dragItem);
        this.setState(this.state);
    };

    // drag & drop (react-dnd)
    dragEnd = () => {
        const favos = this.state.favos;
        this.props.setFavos(favos);
    };

    render(): JSX.Element {
        const { stateOpenList: openList } = this.props;
        const { listsSize } = this.props.stateThumbnailSize;
        const { favos, favosIdx, favosUid } = this.state;

        const imgSize: React.CSSProperties = {
            width: listsSize * 0.7 + "px",
            height: listsSize * 1.0 + "px"
        };
        const titleWidth: React.CSSProperties = {
            width: listsSize * 0.7 + 20 + "px"
        };

        const openInsertIdx = this.getOpenListInsertIndex();

        if (!favos[favosIdx]) {
            return null;
        }
        return (
            <div className={styles.favosListsBox}>
                {favos[favosIdx].lists.map((list, i) => {
                    return [
                        <List
                            key={list.uid}
                            index={i}
                            favosIdx={favosIdx}
                            favosUid={favosUid}
                            listsUid={list.uid}
                            list={list}
                            imgSize={imgSize}
                            titleWidth={titleWidth}
                            openList={openList}
                            showOpenList={this.props.showOpenList}
                            closeOpenList={this.props.closeOpenList}
                            dragMove={this.dragMove}
                            dragEnd={this.dragEnd}
                        />,
                        (() => {
                            if (openInsertIdx === i) {
                                const list2 = favos[favosIdx].lists[openList.listsIdx];
                                return <Items key={-1} favosUid={favosUid} listsUid={list2.uid} />;
                            }
                        })()
                    ];
                })}
                <div
                    className={styles.listsAadd + " js-list-box"}
                    onClick={() => {
                        this.props.addFavosLists(favosUid, "新しいリスト");
                    }}
                >
                    <div className={styles.listsAddIcon} style={imgSize} />
                    <p className={styles.listsAaddTitle} style={titleWidth}>
                        リストの追加
                    </p>
                </div>
                {(() => {
                    if (openInsertIdx === favos[favosIdx].lists.length) {
                        const list = favos[favosIdx].lists[openList.listsIdx];
                        return <Items favosUid={favosUid} listsUid={list.uid} />;
                    }
                })()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        stateApp: state.stateApp,
        stateViewer: state.stateViewer,
        stateThumbnailSize: state.stateThumbnailSize,
        stateOpenList: state.stateOpenList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setFavos: bindActionCreators(stateApp.setFavos, dispatch),
        addFavosLists: bindActionCreators(stateApp.addFavosLists, dispatch),
        showOpenList: bindActionCreators(stateOpenList.showOpenList, dispatch),
        closeOpenList: bindActionCreators(stateOpenList.closeOpenList, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lists);
