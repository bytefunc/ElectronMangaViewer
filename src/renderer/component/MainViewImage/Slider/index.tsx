import RcSlider, { Range } from "rc-slider";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateViewer from "../../../actions/stateViewer";

// scss
const styles = require("./index.scss");
const stylesRcSlide = require("rc-slider/assets/index.css");

interface Props {
    stateViewer: {
        imgs: any[];
        imgsIdxs: number[];
    };
    setImageIndex: (idx: number, viewerMode?: string) => void;
}

interface State {
    slideValue: number;
}

class Slider extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const { imgsIdxs } = props.stateViewer;
        this.state = {
            slideValue: -imgsIdxs[0]
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        const { imgsIdxs } = nextProps.stateViewer;
        this.setState({
            slideValue: -imgsIdxs[0]
        });
    }

    onSliderChange = (value: string) => {
        this.setState({
            slideValue: Number(value)
        });
    };

    onAfterChange = (value: string) => {
        this.props.setImageIndex(Number(value) * -1);
    };

    render(): JSX.Element {
        const { imgs, imgsIdxs } = this.props.stateViewer;
        const { slideValue } = this.state;

        const hidden = imgs.length > 1 ? "" : styles.hidden;

        return (
            <div className={styles.slider + " " + hidden}>
                <RcSlider
                    min={-(imgs.length - 1)}
                    max={0}
                    value={slideValue}
                    trackStyle={{ backgroundColor: "#3FB8AF", height: 10 }}
                    handleStyle={{
                        borderColor: "#D3D3D3",
                        height: 20,
                        width: 20,
                        marginLeft: -14,
                        marginTop: -5,
                        backgroundColor: "#fff"
                    }}
                    railStyle={{ backgroundColor: "#fff", height: 10 }}
                    onChange={this.onSliderChange}
                    onAfterChange={this.onAfterChange}
                />
                <span className={styles.sliderStatus}>
                    <span>{imgsIdxs[0] + 1}</span>
                    <span>/</span>
                    <span>{imgs.length}</span>
                </span>
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
        setImageIndex: bindActionCreators(stateViewer.setImageIndex, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
