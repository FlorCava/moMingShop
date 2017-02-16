
import {fullWhite,cyan500} from 'material-ui/styles/colors';

export const styles = {
    menuButton: {
        color: fullWhite
    },
    avatar: {
        // backgroundImage: `url(${this.getFallBackAvatar()})`,
        backgroundSize: '40px 40px',
        // top: 'calc(50% - 20px)'
    },
    avatarButton: {
        padding: 0
    },
    betaBadge: {
        color: '#fff',
        fontWeight: 600,
        paddingLeft: 10,
        paddingTop: 5
    },
    topToolbar: {
        background: cyan500,
        height: 50,
        padding: 0,
        // justifyContent: 'flex-start'
    },
    logotypeContainer: {
        paddingLeft: 5,
        height: '100%',
        // width: 256,
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'initial'
    },
    logo: {
        height: 20
    },
    toolbarGroup: {
        marginLeft: -5,
        height: '100%',
        flex: 1,
        // justifyContent: 'flex-end'
    },
    toolbarList: {
        padding: '0 24px',
        display: 'flex'
    },
    toolbarListItem: {
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer'
    },
    accountKeyIcon: {
        zIndex: -1
    },
    listItemInnerDiv: {
        padding: 0
    }
};