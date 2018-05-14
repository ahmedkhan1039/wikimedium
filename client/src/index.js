import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import WikiMedium from './app/WikiMedium';
import { Provider } from 'react-redux';
import store from './app/store/store';

const App = props => {
    return(
        <Provider store={store}>
            <WikiMedium title={props.match.params.title}/>
        </Provider>
    );
}

ReactDOM.render(
    <Router>
        <Route exact path="/wiki/:title" component={App} />
    </Router>,
    document.getElementById('root')
);
