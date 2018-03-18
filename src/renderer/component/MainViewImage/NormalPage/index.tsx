import { addResizeListener, removeResizeListener } from "detect-resize";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../../config";

// actions
import * as stateViewer from "../../../actions/stateViewer";

// components
import ActionsBar from "../ActionsBar";
import Slider from "../Slider";

// scss
const styles = require("./index.scss");

// mouse position
let mouseX = 0;
let mouseY = 0;

interface Props {
    stateViewer: {
        zoom: boolean;
        imgs: any[];
        imgsIdxs: number[];
        imgsPaths: string[];
        imgsDuble: boolean;
        actionsBar: boolean;
    };
    setViewerActionsBar: (actionsBar: boolean) => void;
    setViewerZoom: (zoom: boolean) => void;
    setImage: (favosUid: string, listsUid: string, itemsUid: string, lastPage?: boolean) => void;
    nextImage: (moveP1: boolean) => void;
    prevImage: (moveP1: boolean) => void;
    nextItem: () => void;
    prevItem: () => void;
}

interface State {
    intervalID: number;
}

class NormalPage extends React.Component<Props, State> {
    private imageBox: HTMLDivElement;
    private zoom: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private imageBoxSingle: HTMLDivElement;
    private imageBoxDubleLeft: HTMLDivElement;
    private imageBoxDubleRight: HTMLDivElement;
    private imgSingle: HTMLImageElement;
    private imgDubleLeft: HTMLImageElement;
    private imgDubleRight: HTMLImageElement;

    constructor(props) {
        super(props);

        this.state = {
            intervalID: null
        };
    }

    componentDidMount() {
        const intervalID: number = window.setInterval(this.eventZoom, 15);
        this.setState({
            intervalID
        });

        document.addEventListener("keydown", this.eventKeydown);
        document.addEventListener("mousemove", this.mousePosition);

        this.imageBox.addEventListener("mousewheel", this.eventMouseWheel);
        this.imageBox.addEventListener("contextmenu", this.eventClickRightBtn);
        addResizeListener(this.imageBox, this.eventWindowResize);

        this.eventWindowResize();
    }

    componentDidUpdate(prevProps, prevState) {
        this.prepareZoom();
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);

        document.removeEventListener("keydown", this.eventKeydown);
        document.removeEventListener("mousemove", this.mousePosition);

        this.imageBox.removeEventListener("mousewheel", this.eventMouseWheel);
        removeResizeListener(this.imageBox, this.eventWindowResize);
    }

    // next image show
    showImageNext = (moveP1: boolean) => {
        if (this.checkLastPage()) {
            this.props.nextItem();
        } else {
            this.props.nextImage(moveP1);
        }
    };

    // previous image show
    showImagePrev = (moveP1: boolean) => {
        if (this.checkFirstPage()) {
            this.props.prevItem();
        } else {
            this.props.prevImage(moveP1);
        }
    };

    checkLastPage = () => {
        const { imgs, imgsIdxs } = this.props.stateViewer;

        if (imgs.length - 1 === Math.max.apply(null, imgsIdxs)) {
            return true;
        }
        return false;
    };

    checkFirstPage = () => {
        const { imgsIdxs } = this.props.stateViewer;

        if (0 === Math.min.apply(null, imgsIdxs)) {
            return true;
        }
        return false;
    };

    prepareZoom = () => {
        const { imgsDuble, imgsPaths } = this.props.stateViewer;

        if (this.canvas && imgsPaths.length > 0) {
            if (imgsDuble) {
                this.canvas.setAttribute("src_r", imgsPaths[0]);
                this.canvas.setAttribute("src_l", imgsPaths[1]);
            } else {
                this.canvas.setAttribute("src", imgsPaths[0]);
            }
        }
    };

    eventZoom = () => {
        const { zoom, imgsDuble } = this.props.stateViewer;
        if (!zoom) {
            return;
        }
        const zoomTime = 1.8;
        const zoomMargin = 50;
        const rect = this.imageBox.getBoundingClientRect();

        // Calculate the distance from the upper left
        const offsetX = mouseX - rect.left + window.pageXOffset;
        const offsetY = mouseY - rect.top + window.pageYOffset;

        //
        this.zoom.style.left = offsetX + 2 + "px";
        this.zoom.style.top = offsetY + 2 + "px";

        const context = this.canvas.getContext("2d");

        // single image zoom
        if (!imgsDuble) {
            const $img = this.imgSingle;
            const image = new Image();
            image.src = this.canvas.getAttribute("src");

            image.addEventListener(
                "load",
                e => {
                    const rectImg = $img.getBoundingClientRect();

                    // margin calculation
                    const margin = (rect.width - rectImg.width) * zoomTime / 2;
                    const margin2 = (rect.height - rectImg.height) * zoomTime / 2;

                    context.clearRect(0, 0, image.width * zoomTime, image.height * zoomTime);
                    context.save();
                    context.translate(-(offsetX * zoomTime), -(offsetY * zoomTime));
                    context.drawImage(
                        image,
                        margin - zoomMargin,
                        margin2 - zoomMargin,
                        rectImg.width * zoomTime,
                        rectImg.height * zoomTime
                    );
                    context.restore();
                },
                false
            );
        } else if (imgsDuble) {
            // double image zoom
            const $imgL = this.imgDubleLeft;
            const $imgR = this.imgDubleRight;
            const image = new Image();
            const image2 = new Image();
            image.src = this.canvas.getAttribute("src_l"); // left image　src
            image2.src = this.canvas.getAttribute("src_r"); // right image　src

            image.addEventListener(
                "load",
                e => {
                    const rectL = $imgL.getBoundingClientRect();
                    const rectR = $imgR.getBoundingClientRect();

                    // margin calculation
                    const marginL = (rect.width / 2 - rectL.width) * zoomTime;
                    const marginL2 = (rect.height - rectL.height) * zoomTime / 2;
                    const marginR = rect.width / 2 * zoomTime;
                    const marginR2 = (rect.height - rectR.height) * zoomTime / 2;

                    context.clearRect(0, 0, image.width * zoomTime, image.height * zoomTime);
                    context.save();
                    context.translate(-(offsetX * zoomTime), -(offsetY * zoomTime));
                    context.drawImage(
                        image,
                        marginL - zoomMargin,
                        marginL2 - zoomMargin,
                        rectL.width * zoomTime,
                        rectL.height * zoomTime
                    );
                    context.drawImage(
                        image2,
                        marginR - zoomMargin,
                        marginR2 - zoomMargin,
                        rectR.width * zoomTime,
                        rectR.height * zoomTime
                    );
                    context.restore();
                },
                false
            );
        }
    };

    // event mouse wheel
    eventMouseWheel = (e: WheelEvent) => {
        const delta = e.deltaY ? -e.deltaY : e.wheelDelta ? e.wheelDelta : -e.detail;
        // wheel down
        if (delta < 0) {
            this.showImageNext(false);
        } else if (delta > 0) {
            // wheel up
            this.showImagePrev(false);
        }
    };

    // event keyboard
    eventKeydown = (e: KeyboardEvent) => {
        // ↑
        if (e.keyCode === 38) {
            this.showImagePrev(false);
        } else if (e.keyCode === 40) {
            // ↓
            this.showImageNext(false);
        } else if (e.keyCode === 37) {
            // ←
            this.showImageNext(true);
        } else if (e.keyCode === 39) {
            // →
            this.showImagePrev(true);
        }
    };

    // event window resize
    eventWindowResize = () => {
        const { imgsIdxs } = this.props.stateViewer;

        if (!this.imageBox) {
            return;
        }

        if (imgsIdxs.length === 1) {
            const $imageSChil: any = this.imageBoxSingle.firstChild;
            const size = this.calculateAspectRatioFit(
                $imageSChil.naturalWidth,
                $imageSChil.naturalHeight,
                this.imageBoxSingle.clientWidth,
                this.imageBoxSingle.clientHeight
            );
            $imageSChil.style.height = size.height + "px";
            $imageSChil.style.width = size.width + "px";
        } else if (imgsIdxs.length === 2) {
            const $imageR = this.imageBoxDubleRight;
            const $imageRChil: any = $imageR.firstChild;
            const size = this.calculateAspectRatioFit(
                $imageRChil.naturalWidth,
                $imageRChil.naturalHeight,
                $imageR.clientWidth,
                $imageR.clientHeight
            );
            $imageRChil.style.height = size.height + "px";
            $imageRChil.style.width = size.width + "px";

            const $imageL = this.imageBoxDubleLeft;
            const $imageLChil: any = $imageL.firstChild;
            const size2 = this.calculateAspectRatioFit(
                $imageLChil.naturalWidth,
                $imageLChil.naturalHeight,
                $imageL.clientWidth,
                $imageL.clientHeight
            );
            $imageLChil.style.height = size2.height + "px";
            $imageLChil.style.width = size2.width + "px";
        }
    };

    eventClickRightBtn = () => {
        const { zoom } = this.props.stateViewer;
        this.props.setViewerZoom(zoom === false);
    };

    calculateAspectRatioFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number) {
        const ratio: number[] = [maxWidth / srcWidth, maxHeight / srcHeight];
        const min: number = Math.min(ratio[0], ratio[1]);
        return { width: srcWidth * min - 1, height: srcHeight * min };
    }

    mousePosition(e: MouseEvent) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    }

    render(): JSX.Element {
        const { zoom, imgsPaths, imgsDuble, actionsBar } = this.props.stateViewer;

        const styleImg: React.CSSProperties = {
            width: "0px",
            height: "0px",
            display: !imgsDuble ? "inline-block" : "none"
        };

        const styleImgDuble: React.CSSProperties = {
            width: "0px",
            height: "0px",
            display: imgsDuble ? "inline-block" : "none"
        };

        const styleZoom: React.CSSProperties = {
            display: zoom ? "block" : "none"
        };

        const styleCanvas: React.CSSProperties = {
            width: "300px",
            height: "300px"
        };

        return (
            <React.Fragment>
                <div
                    className={styles.imageBox}
                    ref={elm => {
                        this.imageBox = elm;
                    }}
                >
                    <div
                        className={styles.zoom}
                        ref={elm => {
                            this.zoom = elm;
                        }}
                        style={styleZoom}
                    >
                        <canvas
                            ref={elm => {
                                this.canvas = elm;
                            }}
                            style={styleCanvas}
                        />
                    </div>

                    <ActionsBar />
                    <div className={styles.navigationAction}>
                        <div
                            className={styles.navigationActionLeft}
                            onClick={() => {
                                this.showImageNext(false);
                            }}
                        />
                        <div
                            className={styles.navigationActionCenter}
                            onClick={() => {
                                this.props.setViewerActionsBar(actionsBar === false);
                            }}
                        />
                        <div
                            className={styles.navigationActionRight}
                            onClick={() => {
                                this.showImagePrev(false);
                            }}
                        />
                    </div>
                    <div
                        className={styles.imageBoxSingle}
                        ref={elm => {
                            this.imageBoxSingle = elm;
                        }}
                    >
                        <img
                            ref={elm => {
                                this.imgSingle = elm;
                            }}
                            src={(() => {
                                if (!imgsDuble && imgsPaths.length > 0) {
                                    return "file:///" + imgsPaths[0];
                                }
                            })()}
                            style={styleImg}
                            onLoad={() => {
                                this.eventWindowResize();
                            }}
                        />
                    </div>
                    <div
                        className={styles.imageBoxDubleLeft}
                        ref={elm => {
                            this.imageBoxDubleLeft = elm;
                        }}
                    >
                        <img
                            ref={elm => {
                                this.imgDubleLeft = elm;
                            }}
                            src={(() => {
                                if (imgsDuble && imgsPaths.length > 0) {
                                    return "file:///" + imgsPaths[1];
                                }
                            })()}
                            style={styleImgDuble}
                            onLoad={() => {
                                this.eventWindowResize();
                            }}
                        />
                    </div>
                    <div
                        className={styles.imageBoxDubleRight}
                        ref={elm => {
                            this.imageBoxDubleRight = elm;
                        }}
                    >
                        <img
                            ref={elm => {
                                this.imgDubleRight = elm;
                            }}
                            src={(() => {
                                if (imgsDuble && imgsPaths.length > 0) {
                                    return "file:///" + imgsPaths[0];
                                }
                            })()}
                            style={styleImgDuble}
                            onLoad={() => {
                                this.eventWindowResize();
                            }}
                        />
                    </div>
                </div>
                <Slider />
            </React.Fragment>
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
        setViewerZoom: bindActionCreators(stateViewer.setViewerZoom, dispatch),
        setImage: bindActionCreators(stateViewer.setImage, dispatch),
        nextImage: bindActionCreators(stateViewer.nextImage, dispatch),
        prevImage: bindActionCreators(stateViewer.prevImage, dispatch),
        nextItem: bindActionCreators(stateViewer.nextItem, dispatch),
        prevItem: bindActionCreators(stateViewer.prevItem, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NormalPage);
