/*  HOC  */

import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateAlert from "../../actions/stateAlert";

interface Props {
    stateAlert: {
        message: string;
        data: string;
    };
    resetAlert: () => void;
}

export default function alert(WrappedComponent) {
    class Alert extends React.Component<Props, {}> {
        static displayName = `alert(${WrappedComponent.displayName || WrappedComponent.name})`;

        alertViewImagesNotFound = () => {
            const { message, data } = this.props.stateAlert;

            if (stateAlert && message === "image not found") {
                this.props.resetAlert();
                window.alert('"' + data + '"\n\n' + "フォルダーが存在しません");
            }
        };

        render(): JSX.Element {
            this.alertViewImagesNotFound();
            return <WrappedComponent {...this.props} />;
        }
    }

    const mapStateToProps = state => {
        return { stateAlert: state.stateAlert };
    };

    const mapDispatchToProps = dispatch => {
        return {
            resetAlert: bindActionCreators(stateAlert.resetAlert, dispatch)
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(Alert);
}
