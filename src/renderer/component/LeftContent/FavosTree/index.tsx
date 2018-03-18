import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateApp from "../../../actions/stateApp";
import * as stateOpenList from "../../../actions/stateOpenList";
import * as stateViewer from "../../../actions/stateViewer";

// components
import FavosTreeItem from "../FavosTreeItem";

// scss
const styles = require("./index.scss");

interface Props {
    stateApp: {
        favos: any[];
        naviFavosUid: string;
    };
    setFavos: (favos: any[]) => void;
    addFavos: (favosName: string) => void;
    closeOpenList: () => void;
    setMainMode: (mainMode: string) => void;
    setNaviFavos: (naviFavosUid: string) => void;
    setViewerActionsBar: (actionsBar: boolean) => void;
}

interface State {
    favos: any[];
    inputFavoName: string;
}

class FavosTree extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const { favos } = props.stateApp;
        this.state = {
            favos,
            inputFavoName: ""
        };
    }

    changeInput = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ inputFavoName: e.currentTarget.value });
    };

    submitFavos = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { inputFavoName } = this.state;
        const favoName = inputFavoName === "" ? "お気に入り" : inputFavoName;
        this.props.addFavos(favoName);
        this.setState({ inputFavoName: "" });
    };

    clickFavos = (favosUid: string) => {
        this.props.closeOpenList();
        this.props.setMainMode("favos");
        this.props.setNaviFavos(favosUid);
        this.props.setViewerActionsBar(false);
    };

    // drag & drop (react-dnd)
    dragMove = (dragIndex: number, hoverIndex: number) => {
        const { favos } = this.state;
        const dragItem = favos[dragIndex];

        this.state.favos.splice(dragIndex, 1);
        this.state.favos.splice(hoverIndex, 0, dragItem);
        this.setState(this.state);
    };

    // drag & drop (react-dnd)
    dragEnd = () => {
        const favos = this.state.favos;
        this.props.setFavos(favos);
    };

    render(): JSX.Element {
        const { naviFavosUid, favos } = this.props.stateApp;
        const { inputFavoName } = this.state;

        return (
            <div className={styles.favosTree}>
                <form className={styles.favosTreeForm} onSubmit={this.submitFavos}>
                    <input
                        className={styles.input + " form-control"}
                        type="text"
                        placeholder="お気に入りの追加"
                        maxLength={25}
                        onChange={this.changeInput}
                        value={inputFavoName}
                    />
                </form>
                <h5 className={styles.title}>お気に入り</h5>
                {favos.map((favo, i) => {
                    return (
                        <FavosTreeItem
                            key={favo.uid}
                            active={naviFavosUid === favo.uid}
                            favo={favo}
                            favoUid={favo.uid}
                            index={i}
                            clickFavos={this.clickFavos}
                            dragMove={this.dragMove}
                            dragEnd={this.dragEnd}
                        />
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        stateApp: state.stateApp
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setMainMode: bindActionCreators(stateApp.setMainMode, dispatch),
        setNaviFavos: bindActionCreators(stateApp.setNaviFavos, dispatch),
        setFavos: bindActionCreators(stateApp.setFavos, dispatch),
        addFavos: bindActionCreators(stateApp.addFavos, dispatch),
        setViewerActionsBar: bindActionCreators(stateViewer.setViewerActionsBar, dispatch),
        closeOpenList: bindActionCreators(stateOpenList.closeOpenList, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavosTree);
