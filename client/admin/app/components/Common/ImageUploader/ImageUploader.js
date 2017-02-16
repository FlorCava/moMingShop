import React, {Component, PropTypes} from 'react';

// Components
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PhotoIcon from 'material-ui/svg-icons/editor/insert-photo';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

// Stores & Actions
import CommonActionCreators from '../../../actions/CommonActionCreators';

const styles = {
    fileInput: {
        display: 'none',
        opacity: 0,
    },

    row: {
        display: 'flex'
    },

    growItem: {
        flex: '1 1 auto'
    },
    newButton: {
        margin: '5px'
    }
};

class ImageUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            src: '',
            title: '',
            fileName: '',
            fileSize: '',
            fileType: ''
        };

        this.handleOpen = () => this._handleOpen();
        this.setTitle = (e) => this._setTitle(e);
        this.handleFiles = (e) => this._handleFiles(e);
        this.insertImage = () => this._insertImage();
        this.handleClose = () => this._handleClose();
        this.openFileDialog = () => this._openFileDialog();
    }

    _handleOpen() {
        this.setState({
            open: true
        });
    }

    _handleClose() {
        this.setState({
            open: false
        });
    }

    _setTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    _handleFiles(e) {
        const imageFile = e.target.files[0];
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //     this.setState({
        //         src: e.target.result,
        //         fileName: imageFile.name,
        //         fileSize: imageFile.size,
        //         fileType: imageFile.type,
        //         title: imageFile.name,
        //     }, () => this.refs['img-title'].focus());
        // };
        // reader.readAsDataURL(imageFile);
        this.setState({
            src: imageFile,
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
            title: imageFile.name,
        });
    }

    _insertImage() {
        const {src, title, fileSize, fileType} = this.state;
        // this.props.handleImageFile(imageFile, (src) => {
        //     console.log(src);
        //     this.setState({
        //         src,
        //         fileName: imageFile.name,
        //         title: imageFile.name,
        //     }, () => this.refs['img-title'].focus());
        // });
        this.props.handleImageFile(src, title, fileSize, fileType);
        this.handleClose();
    }

    _openFileDialog() {
        this.refs['image-file-input'].click();
    }

    render() {
        const actions = [
            <FlatButton
                label="确认"
                primary={true}
                onTouchTap={this.insertImage}
            />,
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];
        return (
            <span>
                <RaisedButton
                    label="上传图片"
                    labelPosition="before"
                    style={styles.newButton}
                    onTouchTap={this.handleOpen}
                    secondary={true}
                    icon={<PhotoIcon/>}
                />
                <Dialog
                    title="添加图片"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <input
                        ref="image-file-input"
                        type="file"
                        onChange={this.handleFiles}
                        accept="image/*"
                        max="1"
                        style={styles.fileInput}
                    />
                    <div style={styles.row}>
                        <TextField
                            name="filename"
                            ref="img-path"
                            style={styles.growItem}
                            value={this.state.fileName}
                            disabled
                        />
                        <FlatButton
                            label="选择图片"
                            labelPosition="before"
                            icon={<UploadIcon />}
                            onTouchTap={this.openFileDialog}
                        />
                    </div>
                    <TextField
                        ref="img-title"
                        hintText="输入图片名称"
                        onChange={this.setTitle}
                        fullWidth={true}
                        value={this.state.title}
                        onKeyDown={this.confirmTitle}
                    />
                </Dialog>
            </span>
        );
    }
}
ImageUploader.contextTypes = {
    muiTheme: PropTypes.object
};

ImageUploader.propTypes = {
    onImageAdd: React.PropTypes.func,
    handleImageFile: React.PropTypes.func.isRequired
};

ImageUploader.defaultProps = {
    onImageAdd: () => {
    }
};

export default ImageUploader;