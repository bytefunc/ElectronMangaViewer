import * as React from "react";
import { Resize, ResizeVertical } from "react-resize-layout";

// components
import FavosTree from "./FavosTree";
import FileTree from "./FileTree";

class LeftContent extends React.Component {
    render(): JSX.Element {
        return (
            <Resize handleWidth="5px" handleColor="#777">
                <ResizeVertical className="custom-scrollbar" height="300px" minHeight="50px" overflow="auto">
                    <FavosTree />
                </ResizeVertical>
                <ResizeVertical className="custom-scrollbar" minHeight="50px" overflow="auto">
                    <FileTree />
                </ResizeVertical>
            </Resize>
        );
    }
}

export default LeftContent;
