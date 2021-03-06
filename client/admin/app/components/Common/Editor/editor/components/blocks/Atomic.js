import React from 'react';
import ReactDOM from 'react-dom';
import { Entity } from 'draft-js';
import Image from '../../components/media/Image';
import Types from '../../components/entities/constants/Types';
import Resizable from '../../container/resize/Resizable';
import Alignable from '../../container/align/Alignable';
import { valuesAsArray } from '../../utils/Utils';
import {styles} from './styles';

class AtomicBlock extends React.Component {

    constructor(props) {
        super(props);
        this.onResize = (width, height) => this._onResize(width, height);
        this.onAlign = (alignment) => this._onAlign(alignment);
        this.onDragStart = (e) => this._onDragStart(e);
    }

    componentDidMount() {
        this._updateAlignment();
    }

    componentDidUpdate() {
        this._updateAlignment();
    }

    _updateAlignment() {
        const parentNode = ReactDOM.findDOMNode(this).parentNode;
        valuesAsArray(styles).forEach(className => parentNode.classList.remove(className));
        const entity = Entity.get(this.props.block.getEntityAt(0));
        parentNode.classList.add(styles[entity.getData().alignment]);
    }

    _onResize(width, height) {
        const { editable } = this.props.blockProps;
        if (editable) {
            const entityKey = this.props.block.getEntityAt(0);
            Entity.mergeData(entityKey, { width, height });
        }
    }

    _onAlign(alignment) {
        const { editable } = this.props.blockProps;
        if (editable) {
            const entityKey = this.props.block.getEntityAt(0);
            Entity.mergeData(entityKey, { alignment });
        }
    }

    _onDragStart(e) {
        e.dataTransfer.effectAllowed = 'move'; // eslint-disable-line no-param-reassign
        e.dataTransfer.dropEffect = 'move'; // eslint-disable-line no-param-reassign
        e.dataTransfer.setData('block-key', this.props.block.key);
    }

    _renderComponent(Component, entityData) {
        const { editable } = this.props.blockProps;
        return editable ? (
            <Alignable onAlign={this.onAlign} alignment={entityData.alignment}>
                <Resizable onResize={this.onResize}>
                    {Component}
                </Resizable>
            </Alignable>
        ) : Component;
    }

    render() {
        const { editable } = this.props.blockProps;
        const entity = Entity.get(this.props.block.getEntityAt(0));
        const type = entity.getType();
        switch (type) {
            case Types.IMAGE: {
                const { src, title, width, height } = entity.getData();
                return this._renderComponent(
                    <Image
                        src={src}
                        title={title}
                        width={width}
                        height={height}
                        onDragStart={this.onDragStart}
                        draggable={editable}
                    />
                    , entity.getData());
            }
            default:
                return '';
        }
    }
}

AtomicBlock.propTypes = {
    block: React.PropTypes.object.isRequired,
    blockProps: React.PropTypes.object.isRequired
};

export default AtomicBlock;
