import * as React from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Resize, ResizeHorizon } from "react-resize-layout";
import { bindActionCreators } from "redux";

// components
import LeftContent from "./LeftContent";
import MainViewFavos from "./MainViewFavos";
import MainViewImage from "./MainViewImage";

// HOC components
import alert from "./common/alert";
import contextmenuCommon from "./common/contextmenu/contextmenuCommon";

/* documentにドラッグされた場合 / ドロップされた場合 */
document.ondragover = document.ondrop = e => {
    e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
    return false;
};

class App extends React.Component {
    render(): JSX.Element {
        return (
            <Resize handleWidth="5px" handleColor="#777">
                <ResizeHorizon className="left-content" width="230px" minWidth="120px">
                    <LeftContent />
                </ResizeHorizon>
                <ResizeHorizon className="main-content" minWidth="5px">
                    <MainViewFavos />
                    <MainViewImage />
                </ResizeHorizon>
            </Resize>
        );
    }
}

export default alert(contextmenuCommon(DragDropContext(HTML5Backend)(App)));
