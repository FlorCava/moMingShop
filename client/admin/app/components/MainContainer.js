import React, {Component, PropTypes} from 'react';

// Components
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from './Common/Header/Header';
import SnackBarSimple from './Common/Snackbar/SnackBarSimple';

// Stores & Actions

class MainContainer extends Component {

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Header/>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                    </Col>
                    <Col md={10}>
                        {this.props.children}
                    </Col>
                </Row>
                <Row>
                    <SnackBarSimple/>
                </Row>
                <Row>
                    <div style={{margin:'0 auto'}}>
                        墨铭社 版权所有 © 2016
                    </div>
                </Row>
            </Grid>
        );
    }
}

MainContainer.contextTypes = {
    muiTheme: PropTypes.object
};

export default MainContainer;