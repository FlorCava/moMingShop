import React from 'react';
import ReactDOM from 'react-dom';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const CreateConfirmation = (Component) => {
    return (props) => {
        const wrapper = document.body.appendChild(document.createElement('div'));

        const promise = new Promise((resolve, reject) => {
            try {
                ReactDOM.render(
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                        <Component
                            reject={reject}
                            resolve={resolve}
                            dispose={dispose}
                            {...props}
                        />
                    </MuiThemeProvider>,
                    wrapper
                );
            } catch (e) {
                console.error(e);
                throw e;
            }
        });

        function dispose() {
            setTimeout(() => {
                ReactDOM.unmountComponentAtNode(wrapper);
                setTimeout(() => wrapper.remove());
            }, 1000);
        }

        return promise.then((result) => {
            dispose();
            return result;
        }, (result) => {
            dispose();
            return Promise.reject(result);
        });
    }
};

export default CreateConfirmation;