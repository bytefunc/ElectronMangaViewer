import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateApp from "../../../actions/stateApp";
import * as stateViewer from "../../../actions/stateViewer";

// scss
const styles = require("./index.scss");

interface Props {
    stateViewer: {
        viewerMode: string;
        imgsIdxs: number[];
        zoom: boolean;
        actionsBar: boolean;
        allImgSize: number;
    };
    setMainMode: (mainMode: string) => void;
    setViewerMode: (viewerMode: string) => void;
    setViewerZoom: (zoom: boolean) => void;
    setViewerAllImgSize: (allImageSize: number) => void;
    setImageIndex: (idx: number, viewerMode: string) => void;
}

class ActionsBar extends React.Component<Props, {}> {
    clickViewMode = (viewerMode: string) => {
        const { imgsIdxs } = this.props.stateViewer;
        this.props.setViewerMode(viewerMode);
        this.props.setImageIndex(imgsIdxs[0], viewerMode);
    };

    render(): JSX.Element {
        const { viewerMode, zoom, actionsBar, allImgSize } = this.props.stateViewer;

        const viewP1 = viewerMode === "p1" ? styles.active : "";
        const viewP2 = viewerMode === "p2" ? styles.active : "";
        const viewAuto = viewerMode === "auto" ? styles.active : "";
        const viewAll = viewerMode === "all" ? styles.active : "";
        const zoomActive = zoom ? styles.active : "";
        const displayActionsBar = actionsBar ? "block" : "none";

        let btnZoom = null;
        let imageRange = null;
        if (viewerMode !== "all") {
            btnZoom = (
                <button
                    className={"btn btn-large btn-default " + zoomActive}
                    title="ルーペ拡大"
                    onClick={() => {
                        this.props.setViewerZoom(zoom === false);
                    }}
                >
                    <span className={styles.icon + " icon icon-search"} />
                </button>
            );
        } else {
            imageRange = (
                <input
                    type="range"
                    className="image-range"
                    min="20"
                    max="150"
                    onChange={e => {
                        this.props.setViewerAllImgSize(Number(e.target.value));
                    }}
                    value={allImgSize}
                    title="ページの表示サイズ"
                />
            );
        }

        return (
            <div className={styles.actionsBar} style={{ display: displayActionsBar }}>
                <div className={styles.actionsBarInner}>
                    <div className={styles.actionsBarLeft}>
                        <button
                            className={"btn btn-large btn-default"}
                            onClick={() => {
                                this.props.setMainMode("favos");
                            }}
                        >
                            <span className="icon icon-back icon-text" />
                            お気に入りに戻る
                        </button>
                    </div>
                    <div className={styles.actionsBarCenter}>
                        {btnZoom}
                        {imageRange}
                    </div>
                    <div className={styles.actionsBarRight}>
                        <div className="btn-group">
                            <button
                                className={"btn btn-large btn-default " + viewP1}
                                title="１ページ表示"
                                onClick={() => {
                                    this.clickViewMode("p1");
                                }}
                            >
                                <span className={styles.icon + " icon icon-doc-text"} />
                            </button>
                            <button
                                className={"btn btn-large btn-default " + viewP2}
                                title="2ページ表示"
                                onClick={() => {
                                    this.clickViewMode("p2");
                                }}
                            >
                                <span className={styles.icon + " icon icon-book-open"} />
                            </button>
                            <button
                                className={"btn btn-large btn-default " + viewAuto}
                                title="自動見開き表示"
                                onClick={() => {
                                    this.clickViewMode("auto");
                                }}
                            >
                                <span className={styles.icon + " icon icon-book-open icon-text"} />
                                AUTO
                            </button>
                            <button
                                className={"btn btn-large btn-default " + viewAll}
                                title="すべてのページを表示"
                                onClick={() => {
                                    this.clickViewMode("all");
                                }}
                            >
                                <span className={styles.icon + " icon icon-docs"} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        stateViewer: state.stateViewer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setMainMode: bindActionCreators(stateApp.setMainMode, dispatch),
        setViewerMode: bindActionCreators(stateViewer.setViewerMode, dispatch),
        setViewerZoom: bindActionCreators(stateViewer.setViewerZoom, dispatch),
        setViewerAllImgSize: bindActionCreators(stateViewer.setViewerAllImgSize, dispatch),
        setImageIndex: bindActionCreators(stateViewer.setImageIndex, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsBar);
