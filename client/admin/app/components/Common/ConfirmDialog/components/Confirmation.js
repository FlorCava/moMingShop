import React, {Component, PropTypes}  from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Confirmable from '../Confirmable';

class Confirmation extends Component {

    render() {
        const {
            okLabel = '确定',
            cancelLabel = '取消',
            title,
            confirmation,
            show,
            proceed,
            dismiss,
            cancel,
            modal,
        } = this.props;

        const actions = [
            <FlatButton
                label={okLabel}
                primary={true}
                onClick={proceed}
            />,
            <FlatButton
                label={cancelLabel}
                secondary={true}
                onClick={cancel}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={title}
                    actions={actions}
                    modal={modal}
                    open={show}
                    onRequestClose={dismiss}
                >
                    {confirmation}
                </Dialog>
            </div>
        );
    }
}

export default Confirmable(Confirmation);