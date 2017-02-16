import {
    OPEN_SNACKBAR_SIMPLE,
    CLOSE_SNACKBAR_SIMPLE,
} from '../utils/constants';

let SnackBarActionCreators = {
    openSnackBarSimple(message){
        return (dispatch) => {
            dispatch({type: OPEN_SNACKBAR_SIMPLE, message});
        }
    },
    closeSnackBarSimple(){
        return (dispatch) => {
            dispatch({type: CLOSE_SNACKBAR_SIMPLE});
        }
    }
};

export default SnackBarActionCreators;