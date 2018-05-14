import React, { Component } from 'react';
import { ToolTip } from './components/ToolTip/ToolTipComponent';
import ArticleContent from './components/ArticleContent/ArticleContentComponent';
import rangy from 'rangy/lib/rangy-serializer';
import { Comment } from './components/Comment/CommentComponent';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchArticle } from './actions/fetchActions';
import { getCurrentScrollPosition, positionToolTip, getSafeRanges } from './utility/UtilityFunction';
import './WikiMedium.css';


class WikiMedium extends Component {
    constructor() {
        super();

        this.state = {
            activeElement: null,
            lastSelection: {},
            toolTipLocStyle: {
                opacity: 0
            },
            commentBoxLocStyle: {
                opacity: 0
            },
            selectedRanges: [],
            currentText: null
        };

        this.storeStateToStorage = this.storeStateToStorage.bind(this);
        this.restoreStateFromStorage = this.restoreStateFromStorage.bind(this);
        this.showToolTip = this.showToolTip.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.storeStateToStorage);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loaded) {
            setTimeout(this.restoreStateFromStorage, 20);
        }
    }

    render() {
        return (
            <div className="wiki-medium">
                <div className="header">
                    <h1>Wiki-Medium</h1>
                </div>
                <hr />
                <div className="articleContent">
                    <Comment commentBoxLocStyle={this.state.commentBoxLocStyle} currentText={this.state.currentText} saveComment={(t) => this.saveComment(t)} />
                    <ToolTip toolTipLocStyle={this.state.toolTipLocStyle} onHighLight={() => this.onHighlight()} onComment={() => this.onComment()} />
                    <div onMouseUp={(e) => this.handleMouseUp(e)} onClick={(e) => this.onHighlightSelect(e)}>
                        <ArticleContent title={this.props.title} />
                    </div>
                </div>
            </div>
        );
    }

    onHighlight() {
        this.highlightSelection();
    }

    handleMouseUp(e) {
        if (e.target.className !== 'highlight') {
            setTimeout(this.showToolTip(), 2);
        }
    }

    showToolTip() {
        let lastSelection = null;
        let toolTipLocStyle = {
            display: 'none',
            opacity: 0
        };
        if (document.getSelection() && document.getSelection().toString() !== '') {
            lastSelection = document.getSelection().getRangeAt(0);
            toolTipLocStyle = positionToolTip(document.getSelection());
        }

        this.setState({
            lastSelection: lastSelection,
            activeElement: null,
            toolTipLocStyle: toolTipLocStyle
            , commentBoxLocStyle: {
                opacity: 0
            }
        });
    }

    highlightSelection(selection, commentText) {
        const userSelectedRanges = this.state.selectedRanges;
        if (this.state.activeElement) {
            const id = this.state.activeElement.id;
            while (document.getElementById(id) != null) {
                const newNode = document.createTextNode(document.getElementById(id).innerText);
                document.getElementById(id).parentNode.replaceChild(newNode, document.getElementById(id));
            }

            const updatedSelectedRanges = [];

            for (let range of userSelectedRanges) {
                if (range.title === this.props.title && range.id !== parseInt(this.state.activeElement.id, 10)) {
                    updatedSelectedRanges.push(range);
                }
            }

            this.setState({
                toolTipLocStyle: {
                    opacity: 0,
                    display: 'none'
                },
                selectedRanges: updatedSelectedRanges
            });
        }
        else {
            let userSelection = selection == null ? window.getSelection().getRangeAt(0) : selection;
            let maxId = 1;
            if (userSelectedRanges.length > 0) {
                let articleRanges = userSelectedRanges.filter(i => i.title === this.props.title);
                if (articleRanges.length > 0) {
                    articleRanges = articleRanges.sort(i => i.id);
                    maxId = articleRanges[0].id + 1;
                }
            }

            const serializedSelection = rangy.serializeRange(userSelection, true);
            const safeRanges = getSafeRanges(userSelection);


            for (let safeRange of safeRanges) {
                this.highlightRange(safeRange, maxId);
            }

            userSelectedRanges.push({
                title: this.props.title,
                id: maxId,
                range: serializedSelection,
                comment: commentText
            });

            this.setState({
                selectedRanges: userSelectedRanges
            });

            return maxId;
        }
    }

    onHighlightSelect(e) {
        if (e.target.className === 'highlight') {
            this.setState({
                activeElement: e.target,
                toolTipLocStyle: positionToolTip(document.getElementById(e.target.id))
            });
        }
    }

    onComment() {
        let commentText = null;
        let selectionRange = null;
        if (this.state.activeElement && this.state.activeElement.className === 'highlight') {
            const userSelectedRanges = this.state.selectedRanges;
            const selectedRangeIndex = userSelectedRanges.indexOf(
                userSelectedRanges.find(i => i.id === parseInt(this.state.activeElement.id, 10) && i.title === this.props.title));
            commentText = userSelectedRanges[selectedRangeIndex].comment;
            selectionRange = document.getElementById(this.state.activeElement.id).getBoundingClientRect();
        }
        else {
            selectionRange = document.getSelection().getRangeAt(0).getBoundingClientRect();
        }
        const scrollPosition = getCurrentScrollPosition();
        let top = selectionRange.top - 30;
        this.setState({
            commentBoxLocStyle: {
                top: top + scrollPosition + "px",
                opacity: 1
            },
            currentText: commentText
        });
    }


    saveComment(commentText) {
        const userSelectedRanges = this.state.selectedRanges;
        let Id = parseInt(this.state.activeElement.id, 10);
        if (!(this.state.activeElement && this.state.activeElement.className === 'highlight')) {
            Id = this.highlightSelection(this.state.lastSelection);
        }

        const selectedRangeIndex = userSelectedRanges.indexOf(
            userSelectedRanges.find(i => i.id === Id && i.title === this.props.title));
        userSelectedRanges[selectedRangeIndex].comment = commentText;

        this.setState({
            selectedRanges: userSelectedRanges
        });
    }

    highlightRange(range, id) {
        const newNode = document.createElement("span");
        newNode.setAttribute(
            "class",
            "highlight"
        );
        newNode.setAttribute(
            "id", id
        );
        range.surroundContents(newNode);
    }

    restoreStateFromStorage() {
        const userSelectedRanges = JSON.parse(localStorage.getItem("CurrentSelectedRanges"));
        if (userSelectedRanges !== null) {
            const articleRanges = userSelectedRanges.filter(i => i.title === this.props.title);
            if (articleRanges !== null) {
                for (let articleRange of articleRanges) {
                    articleRange.range = rangy.deserializeRange(articleRange.range);
                    this.highlightSelection(articleRange.range, articleRange.comment);
                }
            }
        }
    }

    storeStateToStorage() {
        localStorage.setItem("CurrentSelectedRanges", JSON.stringify(this.state.selectedRanges));
    }
}

WikiMedium.propTypes = {
    fetchArticle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    loaded: PropTypes.bool
};

const mapStateToProps = state => ({
    loaded: state.wikiReducer.loaded
});

export default connect(mapStateToProps, { fetchArticle })(WikiMedium);