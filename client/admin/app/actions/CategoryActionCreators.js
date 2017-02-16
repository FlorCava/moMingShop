import {
    GO_TO_CATEGORY_EDIT,
    REQUEST_CATEGORY_LIST,
    RECEIVE_CATEGORY_LIST,
    REQUEST_CATEGORY_PARENT_LIST,
    RECEIVE_CATEGORY_PARENT_LIST,
    REQUEST_CATEGORY,
    RECEIVE_CATEGORY,
    UPDATE_CATEGORY_DRAFT,
    REQUEST_CREATE_CATEGORY,
    RECEIVE_CREATE_CATEGORY,
    REQUEST_UPDATE_CATEGORY,
    RECEIVE_UPDATE_CATEGORY,
    REQUEST_DELETE_CATEGORY,
    RECEIVE_DELETE_CATEGORY,
} from '../utils/constants';

import AppApi from '../api/AppApi';

import {push, goBack} from 'react-router-redux';

let CategoryActionCreators = {
    goToCategoryList(){
        return (dispatch) => {
            dispatch(this.fetchCategoryList());
            dispatch(goBack());
        }
    },
    goToCategoryEdit(url){
        return (dispatch) => {
            dispatch({type: GO_TO_CATEGORY_EDIT});
            dispatch(push(url));
        }
    },
    fetchCategoryList(page){
        if (!page) {
            page = 1;
        }
        return (dispatch) => {
            dispatch({type: REQUEST_CATEGORY_LIST});
            AppApi.fetchCategoryList(page).then(
                (categories) => dispatch({type: RECEIVE_CATEGORY_LIST, success: true, categories}),
                (error) =>dispatch({type: RECEIVE_CATEGORY_LIST, success: false, error})
            );
        };
    },
    fetchCategoryParentList(){
        return (dispatch) => {
            dispatch({type: REQUEST_CATEGORY_PARENT_LIST});
            AppApi.fetchCategoryParentList().then(
                (parent_categories) => dispatch({type: RECEIVE_CATEGORY_PARENT_LIST, success: true, parent_categories}),
                (error) =>dispatch({type: RECEIVE_CATEGORY_PARENT_LIST, success: false, error})
            );
        };
    },
    fetchCategory(categoryId){
        return (dispatch) => {
            dispatch({type: REQUEST_CATEGORY, categoryId: categoryId});
            if (categoryId) {
                AppApi.fetchCategory(categoryId).then(
                    (currentCategory) => dispatch({type: RECEIVE_CATEGORY, success: true, currentCategory}),
                    (error) =>dispatch({type: RECEIVE_CATEGORY, success: false, error})
                );
            } else {
                dispatch({type: RECEIVE_CATEGORY, success: true, currentCategory: null});
            }
        };
    },
    addCategory(category){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_CATEGORY, category});
            AppApi.addCategory(category).then(
                (receiveNewCategory) => {
                    dispatch({type: RECEIVE_CREATE_CATEGORY, success: true, currentCategory: receiveNewCategory});
                    dispatch(this.goToCategoryList());
                },
                (error) => dispatch({type: RECEIVE_CREATE_CATEGORY, success: false, category, error})
            );
        };
    },
    updateCategory(categoryId, categoryDraft){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_CATEGORY, category: categoryDraft});
            AppApi.updateCategory(categoryId, categoryDraft).then(
                () => {
                    dispatch({type: RECEIVE_UPDATE_CATEGORY, success: true});
                    dispatch(this.goToCategoryList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_CATEGORY, success: false, categoryDraft, error})
            );
        };
    },
    deleteCategory(categoryId){
        return (dispatch) => {
            dispatch({type: REQUEST_DELETE_CATEGORY, categoryId: categoryId});
            AppApi.deleteCategory(categoryId).then(
                (message) => {
                    dispatch({type: RECEIVE_DELETE_CATEGORY, success: true, message: message});
                    dispatch(this.fetchCategoryList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_CATEGORY, success: false, error})
            );
        };
    },
    updateCategoryDraft(field, value) {
        return {type: UPDATE_CATEGORY_DRAFT, field, value};
    }
};

export default CategoryActionCreators;