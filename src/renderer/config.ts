import { remote } from "electron";
const app = remote.app;
const PathUser = app.getAppPath() + "\\" + "UserData";
const PathThumbnail = PathUser + "\\" + "thumbnail";

export default {
    PATH_USER: PathUser,
    PATH_THUMBNAIL: PathThumbnail + "\\"
};
