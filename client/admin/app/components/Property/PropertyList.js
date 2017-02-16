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
import PropertyActionCreators from '../../actions/PropertyActionCreators';
import SnackBarActionCreators from '../../actions/SnackBarActionCreators';

class PropertyList extends Component {

    handlePageChange(value) {
        this.props.fetchPropertyList(value);
    }

    handleDeleteOnClick(id) {
        Confirm('确定删除该数据？').then(() => {
            this.props.propertyDeleteTap(id);
            this.props.openSnackBarSimple('数据已经删除！');
        }, () => {
        })
    }

    componentWillMount() {
        this.props.fetchPropertyList(1);
    }

    render() {
        let properties = this.props.properties.map((property) => {
            return (
                <TableRow key={property._id}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.propertyUpdateTap.bind(this, property._id)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.handleDeleteOnClick.bind(this, property._id)}/>
                    </TableRowColumn>
                    <TableRowColumn>{property.name}</TableRowColumn>
                    <TableRowColumn>{property.categoryName}</TableRowColumn>
                    <TableRowColumn>{property.description}</TableRowColumn>
                </TableRow>
            )
        });
        return (
            <MainContainer>
                <Row>
                    <RaisedButton label="新增属性" secondary={true} style={CommonStyles.newButton}
                                  onTouchTap={this.props.propertyNewTap}/>
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
                            {properties}
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow>
                                <TableRowColumn colSpan="4" style={{textAlign: 'right'}}>
                                    <Pagination
                                        currentPage={this.props.propertiesPage}
                                        totalPages={this.props.propertiesPages}
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

PropertyList.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        properties: state.Property.properties,
        propertiesPage: state.Property.propertiesPage,
        propertiesPages: state.Property.propertiesPages
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchPropertyList: () => dispatch(PropertyActionCreators.fetchPropertyList()),
        propertyNewTap: () => dispatch(PropertyActionCreators.goToPropertyEdit('properties/new')),
        propertyUpdateTap: (propertyId) => dispatch(PropertyActionCreators.goToPropertyEdit(`properties/edit/${propertyId}`)),
        propertyDeleteTap: (propertyId) => dispatch(PropertyActionCreators.deleteProperty(propertyId)),
        openSnackBarSimple: (message) => dispatch(SnackBarActionCreators.openSnackBarSimple(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PropertyList);
