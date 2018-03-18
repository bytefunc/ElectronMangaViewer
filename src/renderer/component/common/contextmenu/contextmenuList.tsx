/*  HOC  */

import { remote } from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const Menu = remote.Menu;

// actions
import * as stateApp from "../../../actions/stateApp";
import * as stateOpenList from "../../../actions/stateOpenList";

interface Props {
    favosUid: string;
    listsUid: string;
    addFavosItemsDialog: (favosUid: string, listsUid: string) => void;
    removeFavosLists: (favosUid: string, listsUid: string) => void;
    closeOpenList: () => void;
}

export default function contextmenuList(WrappedComponent) {
    class ContextmenuList extends React.Component<Props, {}> {
        static displayName = `contextmenuList(${WrappedComponent.displayName || WrappedComponent.name})`;

        private item: HTMLDivElement;

        componentDidMount() {
            ReactDOM.findDOMNode(this.item).addEventListener("contextmenu", this.eventContextmenu, false);
        }

        eventContextmenu = e => {
            e.stopPropagation();
            e.preventDefault();

            const { favosUid, listsUid } = this.props;
            const menu = Menu.buildFromTemplate([
                {
                    label: "フォルダーの追加",
                    click: () => {
                        this.props.addFavosItemsDialog(favosUid, listsUid);
                    }
                },
                {
                    label: "リストを削除する",
                    click: () => {
                        if (window.confirm("本当にこのリストを削除しますか？")) {
                            this.props.closeOpenList();
                            this.props.removeFavosLists(favosUid, listsUid);
                        }
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
            addFavosItemsDialog: bindActionCreators(stateApp.addFavosItemsDialog, dispatch),
            removeFavosLists: bindActionCreators(stateApp.removeFavosLists, dispatch),
            closeOpenList: bindActionCreators(stateOpenList.closeOpenList, dispatch)
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(ContextmenuList);
}
