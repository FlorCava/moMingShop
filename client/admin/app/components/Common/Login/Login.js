import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Components
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid';

// Stores & Actions
import CommonActionCreators from '../../../actions/CommonActionCreators';

class Login extends Component {
    handleChange(field, e) {
        this.props.updateLoginDraft(field, e.target.value);
    }

    handleSubmit(e) {
        e.preventDefault();
        const redirectRoute = this.props.location.query.redirect || '/login';
        this.props.auth(this.props.loginName, this.props.loginPassword, redirectRoute);
    }

    render() {
        return (
            <Grid fluid>
                <Row style={{textAlign: 'center', marginTop: '20px'}}>
                    <Col md={4}/>
                    <Col md={4}>
                        <Paper rounded={false}>
                            <Row>
                                <Col md={12}>
                                    <p>MarsPlus</p>
                                </Col>
                                <Col md={12}>
                                    <TextField
                                        id="loginName"
                                        key="loginName"
                                        hintText="输入登录用户名"
                                        floatingLabelText="登录名"
                                        value={this.props.loginName}
                                        onChange={this.handleChange.bind(this, 'loginName')}
                                    />
                                </Col>
                                <Col md={12}>
                                    <TextField
                                        id="loginPassword"
                                        hintText="输入登录密码"
                                        floatingLabelText="密 码"
                                        type="password"
                                        value={this.props.loginPassword}
                                        onChange={this.handleChange.bind(this, 'loginPassword')}
                                    />
                                </Col>
                                <Col md={12}>
                                    <FlatButton label="登录" onTouchTap={this.handleSubmit.bind(this)}>
                                    </FlatButton>

                                    <p>{this.props.token}</p>
                                </Col>
                            </Row>
                        </Paper>
                    </Col>
                    <Col md={4}/>
                </Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginName: state.Common.loginName,
        loginPassword: state.Common.loginPassword,
        token: state.Common.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateLoginDraft: (field, value) => dispatch(CommonActionCreators.updateLoginDraft(field, value)),
        auth: (name, password, redirectTo) => dispatch(CommonActionCreators.auth(name, password, redirectTo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);