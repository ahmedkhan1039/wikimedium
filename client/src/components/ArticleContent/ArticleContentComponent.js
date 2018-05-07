import React, {Component} from 'react';
import ReactHtmlParser from 'react-html-parser';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default class ArticleContent extends Component{
    constructor(){
        super();
        this.state = {
            articleContent : {},
            loaderStyle : {
                display: 'block',
                position: 'absolute',
                left: '42%'
            }
        }
    }

    componentDidMount(){
        fetch("http://localhost:8080/api/article/".concat(this.props.title.replace("_"," ")))
        .then(data => data.json())
        .then(data => {
            this.setState({
                articleContent: data,
                loaderStyle : {
                    display: 'none',
                    position: 'absolute'
                }
            });
        })
    }


    render(){
        return (<div className='article'>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
                <CircularProgress style={this.state.loaderStyle} size={300} thickness={10} />
        </MuiThemeProvider>
        <h1>{this.state.articleContent.title}</h1>
        {ReactHtmlParser(this.state.articleContent.extract)}</div>);
    }
}