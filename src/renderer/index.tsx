import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import Storage from "redux-state-save";
import thunk from "redux-thunk";
import App from "./component/App";
import Config from "./config";
import rootReducer from "./reducers/index";
import createUserDataFolder from "./utils/initialUserDataFolder";

const storage = new Storage();

storage.setConfig({
    storage_type: "file_storage",
    file_path: Config.PATH_USER,
    file_name: "user.jspn",
    filter_type: "blacklist"
});

let store = createStore(rootReducer, applyMiddleware(thunk, createUserDataFolder(), storage.saveState()));

store = storage.loadState(store);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);
