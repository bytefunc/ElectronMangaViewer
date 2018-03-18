import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateViewer from "../../../actions/stateViewer";

// components
import ActionsBar from "../ActionsBar";

// scss
const styles = require("./index.scss");

interface Props {
    stateViewer: {
        itemsUid: string;
        imgs: any[];
        imgsIdxs: number[];
        allImgSize: number;
        actionsBar: boolean;
    };
    setViewerActionsBar: (actionsBar: boolean) => void;
    setImageIndex: (idx: number, viewerMode?: string) => void;
}

interface State {
    initLoadImages: boolean;
    resizeImages: boolean;
    updatePsition: boolean;
}

class AllPage extends React.Component<Props, State> {
    private imageBoxAll: HTMLDivElement;

    constructor(props) {
        super(props);

        this.state = {
            initLoadImages: false,
            resizeImages: false,
            updatePsition: false
        };
    }

    componentDidMount() {
        let timeoutId: number;
        this.imageBoxAll.addEventListener("scroll", () => {
            if (timeoutId) {
                return;
            }

            timeoutId = window.setTimeout(() => {
                this.positionImageIndex();
                timeoutId = 0;
            }, 300);
        });
    }

    componentWillReceiveProps(nextProps: Props) {
        const { itemsUid: nextItemsUid, imgsIdxs: nextImgsIdxs } = nextProps.stateViewer;
        const { itemsUid, imgsIdxs } = this.props.stateViewer;

        const { updatePsition } = this.state;
        if (updatePsition) {
            // scroll
            this.setState({ updatePsition: false });
        } else if (imgsIdxs[0] !== nextImgsIdxs[0]) {
            // update new  images indexs
            this.scrollToImage(nextImgsIdxs[0]);
        } else if (itemsUid !== nextItemsUid) {
            // new items
            this.setState({
                initLoadImages: false
            });
            this.invisibleImages();
            this.scrollToImageTop();
        }

        this.resizeImagesPositionBefore(nextProps);
    }

    componentDidUpdate() {
        this.resizeImagesPosition();
    }

    scrollToImageTop = () => {
        this.imageBoxAll.scrollTop = 0;
    };

    scrollToImage = (imgsIdx: number) => {
        const $images: any = document.querySelectorAll(".js-all-page-image");
        let top = 0;
        for (let i = 0; i < imgsIdx; i++) {
            top += $images[i].offsetHeight;
        }
        this.imageBoxAll.scrollTop = top;
    };

    visibleImages = () => {
        this.imageBoxAll.style.visibility = "visible";
    };

    invisibleImages = () => {
        this.imageBoxAll.style.visibility = "hidden";
    };

    positionImageIndex = () => {
        const { imgsIdxs } = this.props.stateViewer;
        const $images: any = document.querySelectorAll(".js-all-page-image");

        let idx = -1;
        for (let i = 0; i < $images.length; i++) {
            if ($images[i].offsetTop + $images[i].offsetHeight / 2 - this.imageBoxAll.scrollTop >= 0) {
                idx = i;
                break;
            }
        }

        if (imgsIdxs[0] !== idx) {
            this.setState({ updatePsition: true });
            this.props.setImageIndex(idx);
        }
    };

    resizeImagesPositionBefore = (nextProps: Props) => {
        const { allImgSize } = this.props.stateViewer;
        const { allImgSize: nextAllImgSize } = nextProps.stateViewer;

        if (allImgSize !== nextAllImgSize) {
            this.invisibleImages();
            this.setState({ resizeImages: true });
        }
    };

    resizeImagesPosition = () => {
        const { resizeImages } = this.state;
        const { imgsIdxs } = this.props.stateViewer;

        if (resizeImages) {
            this.visibleImages();
            this.setState({ resizeImages: false });
            this.scrollToImage(imgsIdxs[0]);
        }
    };

    render(): JSX.Element {
        const { allImgSize, imgs, imgsIdxs, actionsBar } = this.props.stateViewer;
        const { initLoadImages } = this.state;
        const style: React.CSSProperties = {
            visibility: "hidden"
        };

        return (
            <div className={styles.imageBox}>
                <ActionsBar />
                <div className={styles.tooltipImagesIndexs}>{`${imgsIdxs[0] + 1} / ${imgs.length}`}</div>
                <div
                    className={styles.imageBoxAll + " custom-scrollbar"}
                    ref={elm => {
                        this.imageBoxAll = elm;
                    }}
                    style={style}
                    onClick={() => {
                        this.props.setViewerActionsBar(actionsBar === false);
                    }}
                >
                    {imgs.map((img, i) => {
                        const fullPath = img.path + encodeURIComponent(img.name);

                        return (
                            <div key={i}>
                                <img
                                    className="js-all-page-image"
                                    src={"file:///" + fullPath}
                                    style={{
                                        width: allImgSize + "%"
                                    }}
                                    data-image-idx={i}
                                    onLoad={() => {
                                        if (!initLoadImages && imgs.length === i + 1) {
                                            this.setState({
                                                initLoadImages: true
                                            });
                                            this.scrollToImage(imgsIdxs[0]);
                                            this.visibleImages();
                                        }
                                    }}
                                />
                            </div>
                        );
                    })}
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
        setViewerActionsBar: bindActionCreators(stateViewer.setViewerActionsBar, dispatch),
        setImageIndex: bindActionCreators(stateViewer.setImageIndex, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllPage);
