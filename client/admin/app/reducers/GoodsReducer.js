import {
    GO_TO_GOODS_EDIT,
    RECEIVE_GOODS_LIST,
    RECEIVE_GOODS,
    UPDATE_GOODS_DRAFT,
    RECEIVE_CREATE_GOODS,
    RECEIVE_UPDATE_GOODS,
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

const defaultGoods = () => {
    return {
        errors: '',
        goodsPage: 0,
        goodsPages: 0,
        goodsDialogOpen: true,
        goods: [],
        currentGoods: {
            _id: '',
            goods_id: '',
            name: '',
            description: ''
        },
    }
};

const GoodsReducer = (state = defaultGoods(), action) => {
    switch (action.type) {
        case GO_TO_GOODS_EDIT:
            return update(state, {
                errors: {$set: ''},
                currentGoods: {
                    $set: {
                        _id: '',
                        goods_id: '',
                        name: '',
                        description: ''
                    }
                }
            });
        case RECEIVE_GOODS_LIST:
            return update(state, {
                goods: {$set: action.goods.goods},
                goodsPage: {$set: action.goods.page},
                goodsPages: {$set: action.goods.pages}
            });
        case RECEIVE_GOODS:
            if (action.currentGoods) {
                return update(state, {
                    currentGoods: {$set: action.currentGoods}
                });
            }
            return state;
        case UPDATE_GOODS_DRAFT:
            return update(state, {
                currentGoods: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case RECEIVE_CREATE_GOODS:
            if (action.success) {
                return update(state, {
                    currentGoods: {$set: action.currentGoods}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_GOODS:
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

export default GoodsReducer;

