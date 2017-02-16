import {
    GO_TO_GOODS_EDIT,
    REQUEST_GOODS_LIST,
    RECEIVE_GOODS_LIST,
    REQUEST_GOODS,
    RECEIVE_GOODS,
    UPDATE_GOODS_DRAFT,
    REQUEST_CREATE_GOODS,
    RECEIVE_CREATE_GOODS,
    REQUEST_UPDATE_GOODS,
    RECEIVE_UPDATE_GOODS,
    REQUEST_DELETE_GOODS,
    RECEIVE_DELETE_GOODS
} from '../utils/constants';

import AppApi from '../api/AppApi';

import {push, goBack} from 'react-router-redux';

let GoodsActionCreators = {
    goToGoodsList(){
        return (dispatch) => {
            dispatch(this.fetchGoodsList());
            dispatch(goBack());
        }
    },
    goToGoodsEdit(url){
        return (dispatch) => {
            dispatch({type: GO_TO_GOODS_EDIT});
            dispatch(push(url));
        }
    },
    fetchGoodsList(page){
        if (!page) {
            page = 1;
        }
        return (dispatch) => {
            dispatch({type: REQUEST_GOODS_LIST});
            AppApi.fetchGoodsList(page).then(
                (goods) => dispatch({type: RECEIVE_GOODS_LIST, success: true, goods}),
                (error) => dispatch({type: RECEIVE_GOODS_LIST, success: false, error})
            );
        };
    },
    fetchGoods(goodsId){
        return (dispatch) => {
            dispatch({type: REQUEST_GOODS, goodsId: goodsId});
            if (goodsId) {
                AppApi.fetchGoods(goodsId).then(
                    (currentGoods) => dispatch({type: RECEIVE_GOODS, success: true, currentGoods}),
                    (error) => dispatch({type: RECEIVE_GOODS, success: false, error})
                );
            } else {
                dispatch({type: RECEIVE_GOODS, success: true, currentGoods: null});
            }
        };
    },
    addGoods(goods){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_GOODS, goods});
            AppApi.addGoods(goods).then(
                (receiveNewGoods) => {
                    dispatch({type: RECEIVE_CREATE_GOODS, success: true, currentGoods: receiveNewGoods});
                    dispatch(this.goToGoodsList());
                },
                (error) => dispatch({type: RECEIVE_CREATE_GOODS, success: false, goods, error})
            );
        };
    },
    updateGoods(goodsId, goodsDraft){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_GOODS, goods: goodsDraft});
            AppApi.updateGoods(goodsId, goodsDraft).then(
                () => {
                    dispatch({type: RECEIVE_UPDATE_GOODS, success: true});
                    dispatch(this.goToGoodsList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_GOODS, success: false, goodsDraft, error})
            );
        };
    },
    deleteGoods(goodsId){
        return (dispatch) => {
            dispatch({type: REQUEST_DELETE_GOODS, goodsId: goodsId});
            AppApi.deleteGoods(goodsId).then(
                (message) => {
                    dispatch({type: RECEIVE_DELETE_GOODS, success: true, message: message});
                    dispatch(this.fetchGoodsList());
                },
                (error) => dispatch({type: RECEIVE_DELETE_GOODS, success: false, error})
            );
        };
    },
    updateGoodsDraft(field, value) {
        return {type: UPDATE_GOODS_DRAFT, field, value};
    },
};

export default GoodsActionCreators;