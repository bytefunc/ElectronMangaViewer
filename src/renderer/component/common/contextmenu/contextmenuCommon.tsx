/*  HOC  */

import { remote } from "electron";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const Menu = remote.Menu;

/* inputタグ用コンテキストメニュー */
const inputMenu = Menu.buildFromTemplate([
    {
        label: "切り取り",
        role: "cut"
    },
    {
        label: "コピー",
        role: "copy"
    },
    {
        label: "貼り付け",
        role: "paste"
    },
    {
        type: "separator"
    },
    {
        label: "すべて選択",
        role: "selectall"
    }
]);

/* calss="text"用コンテキストメニュー */
const textMenu = Menu.buildFromTemplate([
    {
        label: "コピー",
        role: "copy"
    },
    {
        type: "separator"
    },
    {
        label: "すべて選択",
        role: "selectall"
    }
]);

export default function contextmenuCommon(WrappedComponent) {
    class ContextmenuCommon extends React.Component {
        static displayName = `contextmenuCommon(${WrappedComponent.displayName || WrappedComponent.name})`;

        componentDidMount() {
            document.body.addEventListener("contextmenu", this.eventContextmenu, false);
        }

        eventContextmenu = e => {
            e.stopPropagation();
            e.preventDefault();

            let n = e.target;
            while (n) {
                if (n.nodeName.match(/^(input|textarea)$/i) || n.isContentEditable) {
                    inputMenu.popup(remote.getCurrentWindow(), {
                        async: true
                    });
                    break;
                } else if ((n.classList && n.classList.contains("text")) || n.isContentEditable) {
                    textMenu.popup(remote.getCurrentWindow(), {
                        async: true
                    });
                    break;
                }

                n = n.parentNode;
            }
        };

        render(): JSX.Element {
            return <WrappedComponent {...this.props} />;
        }
    }

    const mapStateToProps = state => {
        return {};
    };

    const mapDispatchToProps = dispatch => {
        return {};
    };

    return connect(mapStateToProps, mapDispatchToProps)(ContextmenuCommon);
}
