import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Components
import {Row} from 'react-flexbox-grid';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    TableFooter
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MainContainer from '../MainContainer';
import Pagination from '../Common/Pagination/Pagination';
import Confirm from '../Common/ConfirmDialog/Confirm';
import {CommonStyles} from '../CommonStyles';

// Stores & Actions
import ProductActionCreators from '../../actions/ProductActionCreators';
import SnackBarActionCreators from '../../actions/SnackBarActionCreators';


class ProductList extends Component {

    handlePageChange(value) {
        this.props.fetchProductList(value);
    }

    handleDeleteOnClick(id) {
        Confirm('确定删除该数据？').then(() => {
            this.props.productDeleteTap(id);
            this.props.openSnackBarSimple('数据已经删除！');
        }, () => {
        })
    }

    componentDidMount() {
        this.props.fetchProductList(1);
    }

    render() {
        let products = this.props.products.map((product) => {
            return (
                <TableRow key={product._id}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.productUpdateTap.bind(this, product._id)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.handleDeleteOnClick.bind(this, product._id)}/>
                    </TableRowColumn>
                    <TableRowColumn>{product.product_name}<br/>{product.second_title}</TableRowColumn>
                    <TableRowColumn>{product.categoryName}</TableRowColumn>
                    <TableRowColumn>{product.brandName}</TableRowColumn>
                    <TableRowColumn>{product.thumbnail}</TableRowColumn>
                </TableRow>
            )
        });
        return (
            <MainContainer>
                <Row>
                    <RaisedButton label="新增商品" secondary={true} style={CommonStyles.newButton}
                                  onTouchTap={this.props.productNewTap}/>
                </Row>
                <Row>
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>操作</TableHeaderColumn>
                                <TableHeaderColumn>名称</TableHeaderColumn>
                                <TableHeaderColumn>分类</TableHeaderColumn>
                                <TableHeaderColumn>品牌</TableHeaderColumn>
                                <TableHeaderColumn>缩略图</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {products}
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow>
                                <TableRowColumn colSpan="5" style={{textAlign: 'right'}}>
                                    <Pagination
                                        currentPage={this.props.productsPage}
                                        totalPages={this.props.productsPages}
                                        onChange={this.handlePageChange.bind(this)}/>
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Row>
                {this.props.children}
            </MainContainer>
        );
    }
}

ProductList.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        products: state.Product.products,
        productsPage: state.Product.productsPage,
        productsPages: state.Product.productsPages
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProductList: () => dispatch(ProductActionCreators.fetchProductList()),
        productNewTap: () => dispatch(ProductActionCreators.goToProductEdit()),// dispatch(push('products/new')),
        productUpdateTap: (productId) => dispatch(ProductActionCreators.goToProductEdit(productId)),// dispatch(push(`products/edit/${productId}`)),
        productDeleteTap: (productId) => dispatch(ProductActionCreators.deleteProduct(productId)),
        openSnackBarSimple: (message) => dispatch(SnackBarActionCreators.openSnackBarSimple(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
