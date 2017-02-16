import React from 'react';
import {connect} from 'react-redux';

// Components
import Snackbar from 'material-ui/Snackbar';

// Stores & Actions
import SnackBarActionCreators from '../../../actions/SnackBarActionCreators';

class SnackBarSimple extends React.Component {

    render() {
        return (
            <div>
                <Snackbar
                    open={this.props.snackBarOpen}
                    message={this.props.message}
                    autoHideDuration={2000}
                    onRequestClose={this.props.closeSnackBarSimple.bind(this)}
                    bodyStyle={{ backgroundColor: '#0097A7', color: 'coral',textAlign:'center' }}
                    style={{marginBottom:'5px'}}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        snackBarOpen: state.SnackBar.snackBarOpen,
        message: state.SnackBar.message,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        closeSnackBarSimple: () => dispatch(SnackBarActionCreators.closeSnackBarSimple()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SnackBarSimple);