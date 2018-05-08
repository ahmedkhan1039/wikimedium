import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchArticle } from '../../actions/fetchActions';

class ArticleContent extends Component {
    constructor() {
        super();
        this.state = {
            loaderStyle: {
                display: 'block',
                position: 'absolute',
                left: '42%'
            }
        }
    }

    componentDidMount() {
        this.props.fetchArticle(this.props.title);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loaded) {
            this.setState({
                loaderStyle: {
                    display: 'none',
                    position: 'absolute'
                }
            });
        }
      }

    render() {
        return (<div className='article'>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <CircularProgress style={this.state.loaderStyle} size={300} thickness={10} />
            </MuiThemeProvider>
            <h1>{this.props.article.title}</h1>
            {ReactHtmlParser(this.props.article.extract)}</div>);
    }
}

ArticleContent.propTypes = {
    fetchArticle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    article: PropTypes.object,
    loaded: PropTypes.bool
};

const mapStateToProps = state => ({
    article: state.articleReducer.article,
    loaded: state.articleReducer.loaded
});

export default connect(mapStateToProps, { fetchArticle })(ArticleContent);