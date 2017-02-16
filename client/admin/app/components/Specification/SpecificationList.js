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
import SpecificationActionCreators from '../../actions/SpecificationActionCreators';
import SnackBarActionCreators from '../../actions/SnackBarActionCreators';

class SpecificationList extends Component {

    handlePageChange(value) {
        this.props.fetchSpecificationList(value);
    }

    handleDeleteOnClick(id) {
        Confirm('确定删除该数据？').then(() => {
            this.props.specificationDeleteTap(id);
            this.props.openSnackBarSimple('数据已经删除！');
        }, () => {
        })
    }

    componentWillMount() {
        this.props.fetchSpecificationList(1);
    }

    render() {
        let specifications = this.props.specifications.map((specification) => {
            return (
                <TableRow key={specification._id}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.specificationUpdateTap.bind(this, specification._id)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.handleDeleteOnClick.bind(this, specification._id)}/>
                    </TableRowColumn>
                    <TableRowColumn>{specification.name}</TableRowColumn>
                    <TableRowColumn>{specification.goodsName}</TableRowColumn>
                    <TableRowColumn>{specification.description}</TableRowColumn>
                </TableRow>
            )
        });
        return (
            <MainContainer>
                <Row>
                    <RaisedButton label="新增规格" secondary={true} style={CommonStyles.newButton}
                                  onTouchTap={this.props.specificationNewTap}/>
                </Row>
                <Row>
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>操作</TableHeaderColumn>
                                <TableHeaderColumn>名称</TableHeaderColumn>
                                <TableHeaderColumn>所属分类</TableHeaderColumn>
                                <TableHeaderColumn>描述</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {specifications}
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow>
                                <TableRowColumn colSpan="4" style={{textAlign: 'right'}}>
                                    <Pagination
                                        currentPage={this.props.specificationsPage}
                                        totalPages={this.props.specificationsPages}
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

SpecificationList.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        specifications: state.Specification.specifications,
        specificationsPage: state.Specification.specificationsPage,
        specificationsPages: state.Specification.specificationsPages
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSpecificationList: () => dispatch(SpecificationActionCreators.fetchSpecificationList()),
        specificationNewTap: () => dispatch(SpecificationActionCreators.goToSpecificationEdit('specifications/new')),
        specificationUpdateTap: (specificationId) => dispatch(SpecificationActionCreators.goToSpecificationEdit(`specifications/edit/${specificationId}`)),
        specificationDeleteTap: (specificationId) => dispatch(SpecificationActionCreators.deleteSpecification(specificationId)),
        openSnackBarSimple: (message) => dispatch(SnackBarActionCreators.openSnackBarSimple(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SpecificationList);
