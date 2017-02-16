import React from 'react';
import classNames from 'classnames/bind';
import {styles} from './styles';

// const classNamesWithStyles = classNames.bind(styles);

class StyleButton extends React.Component {
    constructor(props) {
        super(props);
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        // const className = classNamesWithStyles(styles.styleButton, {
        //     activeButton: this.props.active
        // });
        const style = this.props.active ? styles.styleActiveButton : styles.styleButton;
        return (
            <span style={style} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

StyleButton.propTypes = {
    active: React.PropTypes.bool,
    label: React.PropTypes.string,
    onToggle: React.PropTypes.func,
    style: React.PropTypes.string.isRequired
};

StyleButton.defaultProps = {
    active: false,
    onToggle: () => {}
};

export default StyleButton;
