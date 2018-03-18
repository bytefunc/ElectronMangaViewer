import { combineReducers } from "redux";
import stateAlert from "./stateAlert";
import stateApp from "./stateApp";
import stateOpenList from "./stateOpenList";
import stateThumbnailSize from "./stateThumbnailSize";
import stateViewer from "./stateViewer";

const rootReducer = combineReducers({
    stateApp,
    stateAlert,
    stateViewer,
    stateThumbnailSize,
    stateOpenList
});

export default rootReducer;
