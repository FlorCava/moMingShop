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
import CategoryActionCreators from '../../actions/CategoryActionCreators';
import SnackBarActionCreators from '../../actions/SnackBarActionCreators';

class CategoryList extends Component {

    handlePageChange(value) {
        this.props.fetchCategoryList(value);
    }

    handleDeleteOnClick(id) {
        Confirm('确定删除该数据？').then(() => {
            this.props.categoryDeleteTap(id);
            this.props.openSnackBarSimple('数据已经删除！');
        }, () => {
        })
    }

    componentDidMount() {
        this.props.fetchCategoryList(1);
    }

    render() {
        let categories = this.props.categories.map((category) => {
            return (
                <TableRow key={category._id}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.categoryUpdateTap.bind(this, category._id)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.handleDeleteOnClick.bind(this, category._id)}/>
                    </TableRowColumn>
                    <TableRowColumn>{category.name}</TableRowColumn>
                    <TableRowColumn>{category.parentId}</TableRowColumn>
                    <TableRowColumn>{category.description}</TableRowColumn>
                </TableRow>
            )
        });
        return (
            <MainContainer>
                <Row>
                    <RaisedButton label="新增分类" secondary={true} style={CommonStyles.newButton}
                                  onTouchTap={this.props.categoryNewTap}/>
                </Row>
                <Row>
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>操作</TableHeaderColumn>
                                <TableHeaderColumn>名称</TableHeaderColumn>
                                <TableHeaderColumn>上级分类</TableHeaderColumn>
                                <TableHeaderColumn>描述</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {categories}
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow>
                                <TableRowColumn colSpan="4" style={{textAlign: 'right'}}>
                                    <Pagination
                                        currentPage={this.props.categoriesPage}
                                        totalPages={this.props.categoriesPages}
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

CategoryList.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        categories: state.Category.categories,
        categoriesPage: state.Category.categoriesPage,
        categoriesPages: state.Category.categoriesPages
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCategoryList: (page) => dispatch(CategoryActionCreators.fetchCategoryList(page)),
        categoryNewTap: () => dispatch(CategoryActionCreators.goToCategoryEdit('categories/new')),
        categoryUpdateTap: (categoryId) => dispatch(CategoryActionCreators.goToCategoryEdit(`categories/edit/${categoryId}`)),
        categoryDeleteTap: (categoryId) => dispatch(CategoryActionCreators.deleteCategory(categoryId)),
        openSnackBarSimple: (message) => dispatch(SnackBarActionCreators.openSnackBarSimple(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
