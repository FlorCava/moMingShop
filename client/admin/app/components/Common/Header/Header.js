import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';

// Components
import Sticky from 'react-stickydiv';
import Menu from 'material-ui/Menu';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import PowerSettingNew from 'material-ui/svg-icons/action/power-settings-new';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import {styles} from './styles';

// Stores & Actions
import CommonActionCreators from '../../../actions/CommonActionCreators';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuOfficeOpen: false,
            menuCatalogOpen: false,
            menuSettingsOpen: false,
        };
    }

    getFallBackAvatar() {
        return `${location.protocol}//${location.hostname}:${location.port}/assets/img/fox.png`;
    }

    getLogo() {
        return `${location.protocol}//${location.hostname}:${location.port}/assets/img/logo.png`;
    }

    renderIconButton() {
        return (<IconButton iconStyle={styles.avatar} style={styles.avatarButton}>
                <Avatar src={this.getFallBackAvatar()}/>
            </IconButton>
        );
    }

    handleOfficeTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            menuOfficeOpen: true,
            menuOfficeAnchorEl: event.currentTarget,
        });
    };

    handleOfficeRequestClose = () => {
        this.setState({
            menuOfficeOpen: false,
        });
    };

    handleCatalogTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            menuCatalogOpen: true,
            menuCatalogAnchorEl: event.currentTarget,
        });
    };

    handleCatalogRequestClose = () => {
        this.setState({
            menuCatalogOpen: false,
        });
    };

    handleSettingsTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            menuSettingsOpen: true,
            menuSettingsAnchorEl: event.currentTarget,
        });
    };

    handleSettingsRequestClose = () => {
        this.setState({
            menuSettingsOpen: false,
        });
    };

    render() {
        return (
            <Sticky zIndex={12}>
                <Toolbar style={styles.topToolbar}>
                    <ToolbarGroup style={styles.logotypeContainer}>
                        <Link to="/"><img src={this.getLogo()} width={50} height={50}/></Link>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <FlatButton
                            label="数据分析"
                            style={styles.menuButton}
                        >
                        </FlatButton>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <FlatButton
                            onTouchTap={this.handleOfficeTouchTap}
                            label="订单中心"
                            style={styles.menuButton}
                        />
                        <Popover
                            open={this.state.menuOfficeOpen}
                            anchorEl={this.state.menuOfficeAnchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.handleOfficeRequestClose}
                        >
                            <Menu>
                                <MenuItem value={1} primaryText="订单管理"/>
                                <MenuItem value={2} primaryText="客户管理"/>
                                <MenuItem value={3} primaryText="数据分析"/>
                            </Menu>
                        </Popover>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <FlatButton
                            onTouchTap={this.handleCatalogTouchTap}
                            label="资源管理"
                            style={styles.menuButton}
                        />
                        <Popover
                            open={this.state.menuCatalogOpen}
                            anchorEl={this.state.menuCatalogAnchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.handleCatalogRequestClose}
                        >
                            <Menu>
                                <MenuItem value={3} primaryText="货品管理"
                                          onTouchTap={this.props.menuItemTap.bind(this, 'goods')}/>
                                <MenuItem value={1} primaryText="商品管理"
                                          onTouchTap={this.props.menuItemTap.bind(this, 'products')}/>
                                <MenuItem value={2} primaryText="品牌管理"
                                          onTouchTap={this.props.menuItemTap.bind(this, 'brands')}/>
                                <MenuItem value={3} primaryText="商品分类管理"
                                          onTouchTap={this.props.menuItemTap.bind(this, 'categories')}/>
                                <MenuItem value={3} primaryText="商品属性管理"
                                          onTouchTap={this.props.menuItemTap.bind(this, 'properties')}/>
                                <MenuItem value={3} primaryText="商品规格管理"
                                          onTouchTap={this.props.menuItemTap.bind(this, 'specifications')}/>
                            </Menu>
                        </Popover>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <FlatButton
                            onTouchTap={this.handleSettingsTouchTap}
                            label="系统设置"
                            style={styles.menuButton}
                        />
                        <Popover
                            open={this.state.menuSettingsOpen}
                            anchorEl={this.state.menuSettingsAnchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.handleSettingsRequestClose}
                        >
                            <Menu>
                                <MenuItem value={1} primaryText="用户管理"/>
                                <MenuItem value={2} primaryText="权限管理"/>
                            </Menu>
                        </Popover>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconMenu
                            iconButtonElement={this.renderIconButton()}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'middle'
                            }}
                            targetOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem
                                leftIcon={this.renderIconButton()}
                                //onTouchTap={this.goToAccountDetails}
                                primaryText={this.props.userName}
                            />
                            <Divider />
                            <MenuItem
                                onTouchTap={this.props.logoutAndRedirect}
                                leftIcon={<PowerSettingNew/>}
                                primaryText="注销"
                            />
                        </IconMenu>
                    </ToolbarGroup>
                </Toolbar>
            </Sticky>
        );
    }
}
Header.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.Common.isAuthenticated,
        userName: state.Common.userName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logoutAndRedirect: () => dispatch(CommonActionCreators.logoutAndRedirect()),
        menuItemTap: (route) => dispatch(push(`/${route}`))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);