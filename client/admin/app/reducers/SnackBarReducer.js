import {
    OPEN_SNACKBAR_SIMPLE,
    CLOSE_SNACKBAR_SIMPLE,
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

const defaultSnackBar = () => {
    return {
        snackBarOpen: false,
        message: ''
    }
};

const SnackBarReducer = (state = defaultSnackBar(), action) => {
    switch (action.type) {
        case OPEN_SNACKBAR_SIMPLE:
            return update(state, {
                snackBarOpen: {$set: true},
                message: {$set: action.message}
            });
        case CLOSE_SNACKBAR_SIMPLE:
            return update(state, {
                snackBarOpen: {$set: false},
                message: {$set: ''}
            });

        default:
            return state;

    }
};

export default SnackBarReducer;

