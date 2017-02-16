import {
    GO_TO_BRAND_EDIT,
    RECEIVE_BRAND_LIST,
    RECEIVE_BRAND,
    UPDATE_BRAND_DRAFT,
    RECEIVE_CREATE_BRAND,
    RECEIVE_UPDATE_BRAND
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

const defaultBrand = () => {
    return {
        errors: '',
        brandsPage: 0,
        brandsPages: 0,
        brandDialogOpen: true,
        brands: [],
        currentBrand: {
            _id: '',
            brand_id: '',
            name: '',
            description: ''
        },
    }
};

const BrandReducer = (state = defaultBrand(), action) => {
    switch (action.type) {
        case GO_TO_BRAND_EDIT:
            return update(state, {
                errors: {$set: ''},
                currentBrand: {
                    $set: {
                        _id: '',
                        brand_id: '',
                        name: '',
                        description: ''
                    }
                }
            });
        case RECEIVE_BRAND_LIST:
            return update(state, {
                brands: {$set: action.brands.brands},
                brandsPage: {$set: action.brands.page},
                brandsPages: {$set: action.brands.pages}
            });
        case RECEIVE_BRAND:
            if (action.currentBrand) {
                return update(state, {
                    currentBrand: {$set: action.currentBrand}
                });
            }
            return state;
        case UPDATE_BRAND_DRAFT:
            return update(state, {
                currentBrand: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case RECEIVE_CREATE_BRAND:
            if (action.success) {
                return update(state, {
                    currentBrand: {$set: action.currentBrand}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_BRAND:
            if (!action.success) {
                return update(state, {
                    errors: {$set: action.error.errors}
                });
            }
            return state;

        default:
            return state;

    }
};

export default BrandReducer;

