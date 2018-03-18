/*  HOC  */

import { remote, shell } from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const Menu = remote.Menu;

// actions
import * as stateApp from "../../../actions/stateApp";

interface Props {
    favosUid: string;
    listUid: string;
    item: any;
    removeFavosItems: (favosUid: string, listsUid: string, itemsUid: string) => void;
}

export default function contextmenuItem(WrappedComponent) {
    class ContextmenuItem extends React.Component<Props, {}> {
        static displayName = `contextmenuItem(${WrappedComponent.displayName || WrappedComponent.name})`;

        private item: HTMLDivElement;

        componentDidMount() {
            ReactDOM.findDOMNode(this.item).addEventListener("contextmenu", this.eventContextmenu, false);
        }

        eventContextmenu = e => {
            e.stopPropagation();
            e.preventDefault();

            const { favosUid, listUid, item } = this.props;
            const menu = Menu.buildFromTemplate([
                {
                    label: "保存フォルダを開く",
                    click: () => {
                        if (!shell.openItem(item.path)) {
                            alert("保存フォルダが開けませんでした。");
                        }
                    }
                },
                {
                    label: "リストから削除する",
                    click: () => {
                        this.props.removeFavosItems(favosUid, listUid, item.uid);
                    }
                }
            ]);

            menu.popup(remote.getCurrentWindow(), {
                async: true
            });
        };

        render(): JSX.Element {
            return (
                <WrappedComponent
                    ref={elm => {
                        this.item = elm;
                    }}
                    {...this.props}
                />
            );
        }
    }

    const mapStateToProps = state => {
        return {};
    };

    const mapDispatchToProps = dispatch => {
        return {
            removeFavosItems: bindActionCreators(stateApp.removeFavosItems, dispatch)
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(ContextmenuItem);
}
