import {
    GO_TO_CATEGORY_EDIT,
    RECEIVE_CATEGORY_LIST,
    RECEIVE_CATEGORY_PARENT_LIST,
    RECEIVE_CATEGORY,
    UPDATE_CATEGORY_DRAFT,
    RECEIVE_CREATE_CATEGORY,
    RECEIVE_UPDATE_CATEGORY
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

const defaultCategory = () => {
    return {
        errors: '',
        categoriesPage: 0,
        categoriesPages: 0,
        categoryDialogOpen: true,
        categories: [],
        parent_categories: [],
        currentCategory: {
            _id: '',
            category_id: '',
            name: '',
            parentId: '',
            sort_order: 0,
            description: ''
        }
    }
};

const CategoryReducer = (state = defaultCategory(), action) => {
    switch (action.type) {
        case GO_TO_CATEGORY_EDIT:
            return update(state, {
                errors: {$set: ''},
                currentCategory: {
                    $set: {
                        _id: '',
                        category_id: '',
                        name: '',
                        parentId: '',
                        sort_order: 0,
                        description: ''
                    }
                }
            });
        case RECEIVE_CATEGORY_LIST:
            return update(state, {
                categories: {$set: action.categories.categories},
                categoriesPage: {$set: action.categories.page},
                categoriesPages: {$set: action.categories.pages}
            });
        case RECEIVE_CATEGORY_PARENT_LIST:
            return update(state, {
                parent_categories: {$set: action.parent_categories}
            });
        case RECEIVE_CATEGORY:
            if (action.currentCategory) {
                return update(state, {
                    currentCategory: {$set: action.currentCategory}
                });
            }
            return state;
        case UPDATE_CATEGORY_DRAFT:
            return update(state, {
                currentCategory: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case RECEIVE_CREATE_CATEGORY:
            if (action.success) {
                return update(state, {
                    currentCategory: {$set: action.currentCategory}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_CATEGORY:
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

export default CategoryReducer;

