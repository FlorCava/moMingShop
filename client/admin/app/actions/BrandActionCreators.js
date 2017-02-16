import {
    GO_TO_BRAND_EDIT,
    REQUEST_BRAND_LIST,
    RECEIVE_BRAND_LIST,
    REQUEST_BRAND,
    RECEIVE_BRAND,
    UPDATE_BRAND_DRAFT,
    REQUEST_CREATE_BRAND,
    RECEIVE_CREATE_BRAND,
    REQUEST_UPDATE_BRAND,
    RECEIVE_UPDATE_BRAND,
    REQUEST_DELETE_BRAND,
    RECEIVE_DELETE_BRAND,
} from '../utils/constants';
import AppApi from '../api/AppApi';

import {push, goBack} from 'react-router-redux';

let BrandActionCreators = {
    goToBrandList(){
        return (dispatch) => {
            dispatch(this.fetchBrandList());
            dispatch(goBack());
        }
    },
    goToBrandEdit(url){
        return (dispatch) => {
            dispatch({type: GO_TO_BRAND_EDIT});
            dispatch(push(url));
        }
    },
    fetchBrandList(page){
        if (!page) {
            page = 1;
        }
        return (dispatch) => {
            dispatch({type: REQUEST_BRAND_LIST});
            AppApi.fetchBrandList(page).then(
                (brands) => dispatch({type: RECEIVE_BRAND_LIST, success: true, brands}),
                (error) => dispatch({type: RECEIVE_BRAND_LIST, success: false, error})
            );
        };
    },
    fetchBrand(brandId){
        return (dispatch) => {
            dispatch({type: REQUEST_BRAND, brandId: brandId});
            if (brandId) {
                AppApi.fetchBrand(brandId).then(
                    (currentBrand) => dispatch({type: RECEIVE_BRAND, success: true, currentBrand}),
                    (error) => dispatch({type: RECEIVE_BRAND, success: false, error})
                );
            } else {
                dispatch({type: RECEIVE_BRAND, success: true, currentBrand: null});
            }
        };
    },
    addBrand(brand){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_BRAND, brand});
            AppApi.addBrand(brand).then(
                (receiveNewBrand) => {
                    dispatch({type: RECEIVE_CREATE_BRAND, success: true, currentBrand: receiveNewBrand});
                    dispatch(this.goToBrandList());
                },
                (error) => dispatch({type: RECEIVE_CREATE_BRAND, success: false, brand, error})
            );
        };
    },
    updateBrand(brandId, brandDraft){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_BRAND, brand: brandDraft});
            AppApi.updateBrand(brandId, brandDraft).then(
                () => {
                    dispatch({type: RECEIVE_UPDATE_BRAND, success: true});
                    dispatch(this.goToBrandList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_BRAND, success: false, brandDraft, error})
            );
        };
    },
    deleteBrand(brandId){
        return (dispatch) => {
            dispatch({type: REQUEST_DELETE_BRAND, brandId: brandId});
            AppApi.deleteBrand(brandId).then(
                (message) => {
                    dispatch({type: RECEIVE_DELETE_BRAND, success: true, message: message});
                    dispatch(this.fetchBrandList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_BRAND, success: false, error})
            );
        };
    },
    updateBrandDraft(field, value) {
        return {type: UPDATE_BRAND_DRAFT, field, value};
    }
};

export default BrandActionCreators;