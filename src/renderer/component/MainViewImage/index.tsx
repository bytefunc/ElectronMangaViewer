import * as React from "react";
import { connect } from "react-redux";

// actions
import * as stateApp from "../../actions/stateApp";

// components
import AllPage from "./AllPage";
import NormalPage from "./NormalPage";

// scss
const styles = require("./index.scss");

interface Props {
    stateApp: {
        mainMode: string;
    };
    stateViewer: {
        viewerMode: string;
    };
}

class MainViewImage extends React.Component<Props, {}> {
    render(): JSX.Element | null {
        const { mainMode } = this.props.stateApp;
        const { viewerMode } = this.props.stateViewer;

        if (mainMode === "favos") {
            return null;
        }

        const main = viewerMode === "all" ? <AllPage /> : <NormalPage />;
        return <div className={styles.mainViewImage}>{main}</div>;
    }
}

const mapStateToProps = state => {
    return {
        stateApp: state.stateApp,
        stateViewer: state.stateViewer
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainViewImage);
