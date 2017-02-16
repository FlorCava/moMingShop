import React, {Component, PropTypes} from 'react';
import MainContainer from '../MainContainer';

const {Row, Col} = require('react-flexbox-grid');

const styles = {
    small: {
        width: 72,
        height: 72,
        padding: 16,
    },
    smallIcon: {
        width: 24,
        height: 24,
    }
};

class Home extends Component {
    // componentDidMount() {
    //     this.props.fetchMyScenes();
    // }

    render() {
        return (
            <MainContainer>
                <div style={{paddingTop:5}}>
                    <Row>
                    </Row>
                    <Row>
                    </Row>
                </div>
            </MainContainer>
        );
    }
}
// MySceneList.contextTypes = {
//     muiTheme: PropTypes.object
// };

// const mapStateToProps = (state) =>(
// {
//     my_scenes: state.my_scenes
// }
// );
//
// const mapDispatchToProps = (dispatch) => (
// {
//     fetchMyScenes: () => dispatch(MySceneActionCreators.fetchMyScenes())
// }
// );
//
//
// export default connect(mapStateToProps, mapDispatchToProps)(MySceneList);
export default Home;