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
import GoodsActionCreators from '../../actions/GoodsActionCreators';
import SnackBarActionCreators from '../../actions/SnackBarActionCreators';

class GoodsList extends Component {

    handlePageChange(value) {
        this.props.fetchGoodsList(value);
    }

    handleDeleteOnClick(id) {
        Confirm('确定删除该数据？').then(() => {
            this.props.goodsDeleteTap(id);
            this.props.openSnackBarSimple('数据已经删除！');
        }, () => {
        })
    }

    componentWillMount() {
        this.props.fetchGoodsList(1);
    }

    render() {
        let goods = this.props.goods.map((good) => {
            return (
                <TableRow key={good._id}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.goodsUpdateTap.bind(this, good._id)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.handleDeleteOnClick.bind(this, good._id)}/>
                    </TableRowColumn>
                    <TableRowColumn>{good.name}</TableRowColumn>
                    <TableRowColumn>{good.description}</TableRowColumn>
                </TableRow>
            )
        });
        return (
            <MainContainer>
                <Row>
                    <RaisedButton label="新增货品" secondary={true} style={CommonStyles.newButton}
                                  onTouchTap={this.props.goodsNewTap}/>
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
                            {goods}
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow>
                                <TableRowColumn colSpan="3" style={{textAlign: 'right'}}>
                                    <Pagination
                                        currentPage={this.props.goodsPage}
                                        totalPages={this.props.goodsPages}
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

GoodsList.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        goods: state.Goods.goods,
        goodsPage: state.Goods.goodsPage,
        goodsPages: state.Goods.goodsPages
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGoodsList: (page) => dispatch(GoodsActionCreators.fetchGoodsList(page)),
        goodsNewTap: () => dispatch(GoodsActionCreators.goToGoodsEdit('goods/new')),
        goodsUpdateTap: (goodsId) => dispatch(GoodsActionCreators.goToGoodsEdit(`goods/edit/${goodsId}`)),
        goodsDeleteTap: (goodsId) => dispatch(GoodsActionCreators.deleteGoods(goodsId)),
        openSnackBarSimple: (message) => dispatch(SnackBarActionCreators.openSnackBarSimple(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GoodsList);
