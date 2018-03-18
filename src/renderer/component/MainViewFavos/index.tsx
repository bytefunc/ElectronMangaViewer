import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateApp from "../../actions/stateApp";
import * as stateThumbnailSize from "../../actions/stateThumbnailSize";

// components
import Lists from "./Lists";

// scss
const styles = require("./index.scss");

interface Props {
    stateApp: {
        naviFavosUid: string;
        naviFavosIdx: number;
        favos: any[];
    };
    stateThumbnailSize: {
        listsSize: number;
    };
    removeFavos: (favosUid: string) => void;
    renameFavos: (favosUid: string, favosName: string) => void;
    setThumbnailSizeLists: (listsSize: string) => void;
}

interface State {
    inputFavoName: string;
}

class MainViewFavos extends React.Component<Props, State> {
    state = { inputFavoName: "" };

    componentDidMount() {
        this.setStateFavos(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setStateFavos(nextProps);
    }

    setStateFavos = (props: Props) => {
        const { naviFavosIdx, favos } = props.stateApp;
        let inputFavoName: string = "";
        if (favos[naviFavosIdx]) {
            inputFavoName = favos[naviFavosIdx].name;
        }
        this.setState({
            inputFavoName
        });
    };

    confirmRmFavos = () => {
        const { naviFavosUid } = this.props.stateApp;
        if (window.confirm("本当にこのお気に入りを削除しますか？")) {
            this.props.removeFavos(naviFavosUid);
        }
    };

    changeListsImgSize = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.setThumbnailSizeLists(e.currentTarget.value);
    };

    changeFavosName = (e: React.FormEvent<HTMLInputElement>) => {
        const { naviFavosUid } = this.props.stateApp;
        this.setState({ inputFavoName: e.currentTarget.value });
        this.props.renameFavos(naviFavosUid, e.currentTarget.value);
    };

    render(): JSX.Element {
        const { inputFavoName } = this.state;
        const { naviFavosIdx: favosIdx, naviFavosUid, favos } = this.props.stateApp;
        const { listsSize } = this.props.stateThumbnailSize;

        // empty page
        if (!favos[favosIdx]) {
            return (
                <div className={styles.mainViewFavos}>
                    <div className={styles.favosBoxEmpty} />
                </div>
            );
        }

        return (
            <div className={styles.mainViewFavos + " custom-scrollbar"}>
                <div className={styles.favosTitle}>
                    <input
                        type="text"
                        className=""
                        maxLength={25}
                        onChange={this.changeFavosName}
                        value={inputFavoName}
                    />
                </div>
                <Lists />
                <input
                    type="range"
                    className={styles.listsImgResize}
                    min="100"
                    max="500"
                    onChange={this.changeListsImgSize}
                    value={listsSize}
                    title="画像サイズ"
                />
                <div className={styles.buttonBox}>
                    <button
                        className="btn btn-large btn-default"
                        title="お気に入りの削除"
                        onClick={this.confirmRmFavos}
                    >
                        <span className="icon icon-cancel" />
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        stateApp: state.stateApp,
        stateThumbnailSize: state.stateThumbnailSize
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeFavos: bindActionCreators(stateApp.removeFavos, dispatch),
        renameFavos: bindActionCreators(stateApp.renameFavos, dispatch),
        setThumbnailSizeLists: bindActionCreators(stateThumbnailSize.setThumbnailSizeLists, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainViewFavos);
