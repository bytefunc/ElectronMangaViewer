export const SET_ALERT = "SET_ALERT";
export const RESET_ALERT = "RESET_ALERT";

export function setAlert(message: string, data: string) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_ALERT,
            payload: {
                message,
                data
            }
        });
    };
}

export function resetAlert() {
    return {
        type: RESET_ALERT
    };
}
