import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'

import Common from './CommonReducer';
import SnackBar from './SnackBarReducer';
import Brand from './BrandReducer';
import Category from './CategoryReducer';
import Property from './PropertyReducer';
import Goods from './GoodsReducer';
import Specification from './SpecificationReducer';
import Product from './ProductReducer';

const rootReducer = combineReducers({
    Common,
    SnackBar,
    Brand,
    Category,
    Property,
    Goods,
    Specification,
    Product,
    routing: routerReducer
});

export default rootReducer;
