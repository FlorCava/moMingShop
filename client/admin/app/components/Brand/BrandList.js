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
import BrandActionCreators from '../../actions/BrandActionCreators';
import SnackBarActionCreators from '../../actions/SnackBarActionCreators';

class BrandList extends Component {

    handlePageChange(value) {
        this.props.fetchBrandList(value);
    }

    handleDeleteOnClick(id) {
        Confirm('确定删除该数据？').then(() => {
            this.props.brandDeleteTap(id);
            this.props.openSnackBarSimple('数据已经删除！');
        }, () => {
        })
    }

    componentDidMount() {
        this.props.fetchBrandList(1);
    }

    render() {
        let brands = this.props.brands.map((brand) => {
            return (
                <TableRow key={brand._id}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.brandUpdateTap.bind(this, brand._id)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.handleDeleteOnClick.bind(this, brand._id)}/>
                    </TableRowColumn>
                    <TableRowColumn>{brand.name}</TableRowColumn>
                    <TableRowColumn>{brand.description}</TableRowColumn>
                </TableRow>
            )
        });
        return (
            <MainContainer>
                <Row>
                    <RaisedButton label="新增品牌" secondary={true} style={CommonStyles.newButton}
                                  onTouchTap={this.props.brandNewTap}/>
                </Row>
                <Row>
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>操作</TableHeaderColumn>
                                <TableHeaderColumn>名称</TableHeaderColumn>
                                <TableHeaderColumn>描述</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {brands}
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow>
                                <TableRowColumn colSpan="3" style={{textAlign: 'right'}}>
                                    <Pagination
                                        currentPage={this.props.brandsPage}
                                        totalPages={this.props.brandsPages}
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

BrandList.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        brands: state.Brand.brands,
        brandsPage: state.Brand.brandsPage,
        brandsPages: state.Brand.brandsPages
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBrandList: (page) => dispatch(BrandActionCreators.fetchBrandList(page)),
        brandNewTap: () => dispatch(BrandActionCreators.goToBrandEdit('brands/new')),
        brandUpdateTap: (brandId) => dispatch(BrandActionCreators.goToBrandEdit(`brands/edit/${brandId}`)),
        brandDeleteTap: (brandId) => dispatch(BrandActionCreators.deleteBrand(brandId)),
        openSnackBarSimple: (message) => dispatch(SnackBarActionCreators.openSnackBarSimple(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BrandList);
