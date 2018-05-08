import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import WikiMedium from './WikiMedium';
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {
    render(){
        return(
            <Provider store={store}>
                <WikiMedium title={this.props.match.params.title}/>
            </Provider>
        );
    }
}

ReactDOM.render(
    <Router history={createBrowserHistory}>
        <Route exact path="/wiki/:title" component={App} />
    </Router>,
    document.getElementById('root')
);
