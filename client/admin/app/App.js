import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux'

import injectTapEventPlugin from 'react-tap-event-plugin';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {requireAuthentication} from './utils';

// Stores & Actions
import AppStore from './store/AppStore';
import CommonActionCreators from './actions/CommonActionCreators';

// Components
import Home from './components/Home/Home';
import Login from './components/Common/Login/Login';
// 商品品牌
import BrandList from './components/Brand/BrandList';
import BrandDialog from './components/Brand/BrandDialog';

// 商品分类
import CategoryList from './components/Category/CategoryList';
import CategoryDialog from './components/Category/CategoryDialog';

// 商品属性
import PropertyList from './components/Property/PropertyList';
import PropertyDialog from './components/Property/PropertyDialog';

// 货品
import GoodsList from './components/Goods/GoodsList';
import GoodsDialog from './components/Goods/GoodsDialog';

// 商品规格
import SpecificationList from './components/Specification/SpecificationList';
import SpecificationDialog from './components/Specification/SpecificationDialog';

// 商品
import ProductList from './components/Product/ProductList';
import ProductDialog from './components/Product/ProductDialog';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

let token = localStorage.getItem('token');
if (token !== null) {
    AppStore.dispatch(CommonActionCreators.loginUserSuccess(token));
}

const history = syncHistoryWithStore(hashHistory, AppStore);

render((
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Provider store={AppStore}>
                <Router history={history}>
                    <Route path="login" component={Login}>
                    </Route>
                    <Route path="/" component={Home}/>
                    <Route path="brands" component={BrandList}>
                        <Route path="new" component={BrandDialog}/>
                        <Route path="edit/:brandId" component={BrandDialog}/>
                    </Route>
                    <Route path="categories" component={CategoryList}>
                        <Route path="new" component={CategoryDialog}/>
                        <Route path="edit/:categoryId" component={CategoryDialog}/>
                    </Route>
                    <Route path="properties" component={PropertyList}>
                        <Route path="new" component={PropertyDialog}/>
                        <Route path="edit/:propertyId" component={PropertyDialog}/>
                    </Route>
                    <Route path="goods" component={GoodsList}>
                        <Route path="new" component={GoodsDialog}/>
                        <Route path="edit/:goodsId" component={GoodsDialog}/>
                    </Route>
                    <Route path="specifications" component={SpecificationList}>
                        <Route path="new" component={SpecificationDialog}/>
                        <Route path="edit/:specificationId" component={SpecificationDialog}/>
                    </Route>
                    <Route path="products" component={ProductList}>
                        <Route path="new" component={ProductDialog}/>
                        <Route path="edit/:productId" component={ProductDialog}/>
                    </Route>
                    {/*<Route path="/" component={requireAuthentication(MySceneList)}>*/}
                    {/*</Route>*/}
                    {/*<Route path="edit/:scene_id" component={SceneEditor}>*/}
                    {/*<Route path="edit/:element_id" component={Option}/>*/}
                    {/*<Route path="library/music" component={LibraryMusic}/>*/}
                    {/*<Route path="library/page" component={LibraryPage}/>*/}
                    {/*<Route path="library/pic" component={LibraryPic}/>*/}
                    {/*<Route path="library/scene" component={LibraryScene}/>*/}
                    {/*</Route>*/}
                </Router>
            </Provider>
        </MuiThemeProvider>
    ),
    document.getElementById('root')
);