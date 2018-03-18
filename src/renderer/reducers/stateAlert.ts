import * as ActionType from "../actions/stateAlert";

interface State {
    message: string;
    data: string;
}

const initialState: State = {
    message: "",
    data: ""
};

export default function stateAlert(state: State = initialState, { type, payload }): State {
    switch (type) {
        case "SET_ALERT":
            return {
                ...state,
                message: payload.message,
                data: payload.data
            };
        case "RESET_ALERT":
            return {
                ...state,
                message: "",
                data: ""
            };
        default:
            return state;
    }
}
