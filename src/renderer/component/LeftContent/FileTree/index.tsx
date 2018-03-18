import { remote } from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateApp from "../../../actions/stateApp";
import * as stateViewer from "../../../actions/stateViewer";

// scss
const styles = require("./index.scss");

interface Props {
    stateApp: {
        favos: any[];
    };
    stateViewer: {
        favosUid: string;
        listsUid: string;
        itemsUid: string;
        imgs: any[];
        imgsIdxs: number[];
    };
    setMainMode: (mainMode: string) => void;
    setImageIndex: (imageIdx: number, viewerMode?: string) => void;
    setImage: (favosUid: string, listsUid: string, itemsUid: string) => void;
}

class FileTree extends React.Component<Props, {}> {
    clickFille = (imageIdx: number) => {
        this.props.setMainMode("viewer");
        this.props.setImageIndex(imageIdx);
    };

    getItems = (): any[] => {
        const { favos } = this.props.stateApp;
        const { favosUid, listsUid } = this.props.stateViewer;

        for (const favo of favos) {
            if (favo.uid === favosUid) {
                for (const list of favo.lists) {
                    if (list.uid === listsUid) {
                        return list.items;
                    }
                }
            }
        }
        return [];
    };

    changeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const itemsUid = e.currentTarget.value;
        const { favosUid, listsUid } = this.props.stateViewer;

        this.props.setImage(favosUid, listsUid, itemsUid);
    };

    getFolderName(path: string): string {
        if (!path) {
            return "";
        }
        return path.match(/([^\\]*)\\*$/)[1];
    }

    render(): JSX.Element {
        const { favos } = this.props.stateApp;
        const { imgs, imgsIdxs, itemsUid } = this.props.stateViewer;

        const items = this.getItems();

        if (items.length <= 0 && imgs.length <= 0) {
            return <div> </div>;
        }

        return (
            <div className={styles.fileTree}>
                <div className={styles.fileTreeLists}>
                    <select
                        className={styles.formControl + " form-control"}
                        value={itemsUid}
                        onChange={this.changeSelect}
                    >
                        {items.map((item, i) => {
                            return (
                                <option key={item.uid} value={item.uid}>
                                    {this.getFolderName(item.path)}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className={styles.fileTreeView} title={imgs[0].path}>
                    <img
                        className={styles.mangaImage}
                        src={(() => {
                            if (imgs[0]) {
                                return imgs[0].path + imgs[0].name;
                            }
                        })()}
                        alt=""
                    />
                    <div className={styles.mangaPath + " text"}>{this.getFolderName(imgs[0].path)}</div>
                </div>
                {imgs.map((img, i) => {
                    const class2 =
                        imgsIdxs.indexOf(i) >= 0 ? styles.fileTreeItem + " " + styles.select : styles.fileTreeItem;
                    return (
                        <p
                            key={i}
                            className={class2}
                            onClick={() => {
                                this.clickFille(i);
                            }}
                        >
                            {imgs[i].name}
                        </p>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        stateApp: state.stateApp,
        stateViewer: state.stateViewer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setMainMode: bindActionCreators(stateApp.setMainMode, dispatch),
        setImage: bindActionCreators(stateViewer.setImage, dispatch),
        setImageIndex: bindActionCreators(stateViewer.setImageIndex, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTree);
