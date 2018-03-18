import * as fs from "fs";
import Config from "../config";

export default function createUserDataFolder() {
    return ({ dispatch, getState }) => {
        return next => action => {
            fs.mkdir(Config.PATH_USER, err => {
                next(action);
            });
        };
    };
}
