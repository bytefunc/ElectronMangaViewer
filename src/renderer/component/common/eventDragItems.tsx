/*  HOC  */

import Sort from "alphanum-sort";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// actions
import * as stateApp from "../../actions/stateApp";

interface Props {
    favosUid: string;
    listsUid: string;
    addFavosItems: (avosUid: string, listsUid: string, folderPaths: any[]) => void;
}

interface State {
    backgroundColor: string;
}

export default function eventDragItems(WrappedComponent) {
    class EventDragItems extends React.Component<Props, State> {
        static displayName = `eventDragItems(${WrappedComponent.displayName || WrappedComponent.name})`;

        state = { backgroundColor: "" };

        private item: HTMLDivElement;

        componentDidMount() {
            this.eventDragDrop();
        }

        componentDidUpdate(prevProps: Props) {
            if (this.props.listsUid !== prevProps.listsUid) {
                this.removeEventDragDrop();
                this.eventDragDrop();
            }
        }

        componentWillUnmount() {
            this.removeEventDragDrop();
        }

        biginDrag = () => {
            this.setState({
                backgroundColor: "#ce4141"
            });
        };

        endDrag = () => {
            this.setState({
                backgroundColor: ""
            });
        };

        // event addEventListener
        eventDragover = e => {
            e.stopPropagation();
            e.preventDefault();

            if (e.dataTransfer.types.includes("Files")) {
                e.dataTransfer.dropEffect = "copy";
                this.biginDrag();
            }
        };

        // event addEventListener
        eventDragleave = () => {
            this.endDrag();
        };

        // event addEventListener
        eventDrop = e => {
            const { favosUid, listsUid } = this.props;
            e.stopPropagation();
            e.preventDefault();

            this.endDrag();

            let files: any[] = e.dataTransfer.files;
            if (files.length === 0) {
                return false;
            }
            files = this.FilesSort(files);

            const paths = [];
            for (const file of files) {
                paths.push(file + "\\");
            }

            this.props.addFavosItems(favosUid, listsUid, paths);
        };

        eventDragDrop = () => {
            ReactDOM.findDOMNode(this.item).addEventListener("dragover", this.eventDragover, false);
            ReactDOM.findDOMNode(this.item).addEventListener("dragleave", this.eventDragleave, false);
            ReactDOM.findDOMNode(this.item).addEventListener("drop", this.eventDrop, false);
        };

        removeEventDragDrop = () => {
            ReactDOM.findDOMNode(this.item).removeEventListener("dragover", this.eventDragover, false);
            ReactDOM.findDOMNode(this.item).removeEventListener("dragleave", this.eventDragleave, false);
            ReactDOM.findDOMNode(this.item).removeEventListener("drop", this.eventDrop, false);
        };

        FilesSort = (files: any[]) => {
            const sortFile = [];
            for (const file of files) {
                if (file.type === "") {
                    sortFile.push(file.path);
                }
            }
            return Sort(sortFile).reverse();
        };

        render(): JSX.Element {
            const { backgroundColor } = this.state;

            return (
                <WrappedComponent
                    ref={elm => {
                        this.item = elm;
                    }}
                    {...this.props}
                    backgroundColor={backgroundColor}
                />
            );
        }
    }

    const mapStateToProps = state => {
        return {};
    };

    const mapDispatchToProps = dispatch => {
        return {
            addFavosItems: bindActionCreators(stateApp.addFavosItems, dispatch)
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(EventDragItems);
}
