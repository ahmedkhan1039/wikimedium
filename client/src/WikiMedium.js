import React, { Component } from 'react';
import ToolTip from './components/ToolTip/ToolTipComponent';
import ArticleContent from './components/ArticleContent/ArticleContentComponent';
import rangy from 'rangy/lib/rangy-serializer';
import Comment from './components/Comment/CommentComponent';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchArticle } from './actions/fetchActions';
import './index.css';


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
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.storeStateToStorage);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loaded) {
            setTimeout(function () {
                var userSelectedRanges = JSON.parse(localStorage.getItem("CurrentSelectedRanges"));
                if (userSelectedRanges !== null) {
                    var articleRanges = userSelectedRanges.filter(i => i.title === this.props.title);
                    if (articleRanges !== null) {
                        for (let i = 0; i < articleRanges.length; i++) {
                            articleRanges[i].range = rangy.deserializeRange(articleRanges[i].range);
                            this.highlightSelection(articleRanges[i].range, articleRanges[i].comment);
                        }
                    }
                }
            }.bind(this), 20);
        }
    }

    storeStateToStorage() {
        var userSelectedRanges = this.state.selectedRanges;
        var updatedSelectedRanges = [];
        for (let i = 0; i < userSelectedRanges.length; i++) {
            updatedSelectedRanges.push(userSelectedRanges[i]);
        }
        localStorage.setItem("CurrentSelectedRanges", JSON.stringify(updatedSelectedRanges));
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

    handleMouseUp(e) {
        if (e.target.className !== 'highlight') {
            setTimeout(function () {
                var lastSelection = null;
                var toolTipLocStyle = {
                    display: 'none',
                    opacity: 0
                };
                if (document.getSelection() && document.getSelection().toString() !== '') {
                    lastSelection = document.getSelection().getRangeAt(0);
                    toolTipLocStyle = this.positionToolTip(document.getSelection());
                }

                this.setState({
                    lastSelection: lastSelection,
                    activeElement: null,
                    toolTipLocStyle: toolTipLocStyle
                    , commentBoxLocStyle: {
                        opacity: 0
                    }
                });
            }.bind(this), 2);
        }
    }

    positionToolTip(selection) {
        var scrollPosition = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var selectionRange = null;
        if (selection instanceof HTMLElement) {
            selectionRange = selection.getBoundingClientRect();
        }
        else {
            var selectionRange = selection.getRangeAt(0).getBoundingClientRect();
        }

        var top = selectionRange.top - 80;
        var left = ((selectionRange.left + selectionRange.right) / 2) - 60;

        return {
            top: top + scrollPosition + "px",
            left: left + "px",
            opacity: 1
        }
    }

    onHighlight() {
        this.highlightSelection();
    }

    highlightSelection(selection, commentText) {
        var userSelectedRanges = this.state.selectedRanges;
        if (this.state.activeElement) {
            var id = this.state.activeElement.id;
            while (document.getElementById(id) != null) {
                var newNode = document.createTextNode(document.getElementById(id).innerText);
                document.getElementById(id).parentNode.replaceChild(newNode, document.getElementById(id));
            }

            var updatedSelectedRanges = [];
            for (let i = 0; i < userSelectedRanges.length; i++) {
                if (userSelectedRanges[i].title === this.props.title && userSelectedRanges[i].id !== parseInt(this.state.activeElement.id)) {
                    updatedSelectedRanges.push(userSelectedRanges[i]);
                }
            }

            this.setState({
                toolTipLocStyle: {
                    opacity: 0,
                    display: 'none'
                },
                selectedRanges: updatedSelectedRanges
            });

            return;
        }
        else {
            var userSelection = selection == null ? window.getSelection().getRangeAt(0) : selection;
            var maxId = 1;
            var Ids = [];
            if (userSelectedRanges.length > 0) {
                var articleRanges = userSelectedRanges.filter(i => i.title === this.props.title);
                if (articleRanges.length > 0) {
                    articleRanges = articleRanges.sort(i => i.id);
                    maxId = articleRanges[0].id + 1;
                }
            }

            var serializedSelection = rangy.serializeRange(userSelection, true);
            var safeRanges = this.getSafeRanges(userSelection);


            for (var i = 0; i < safeRanges.length; i++) {
                this.highlightRange(safeRanges[i], maxId);
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
                toolTipLocStyle: this.positionToolTip(document.getElementById(e.target.id))
            });
        }
    }

    onComment() {
        var commentText = null;
        var selectionRange = null;
        if (this.state.activeElement && this.state.activeElement.className === 'highlight') {
            var userSelectedRanges = this.state.selectedRanges;
            var selectedRangeIndex = userSelectedRanges.indexOf(
                userSelectedRanges.find(i => i.id === parseInt(this.state.activeElement.id) && i.title === this.props.title));
            commentText = userSelectedRanges[selectedRangeIndex].comment;
            selectionRange = document.getElementById(this.state.activeElement.id).getBoundingClientRect();
        }
        else {
            selectionRange = document.getSelection().getRangeAt(0).getBoundingClientRect();
        }
        var scrollPosition = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var top = selectionRange.top - 30;
        this.setState({
            commentBoxLocStyle: {
                top: top + scrollPosition + "px",
                opacity: 1
            },
            currentText: commentText
        });
    }


    saveComment(commentText) {
        var userSelectedRanges = this.state.selectedRanges;
        var Id = parseInt(this.state.activeElement.id)
        if (!(this.state.activeElement && this.state.activeElement.className === 'highlight')) {
            Id = this.highlightSelection(this.state.lastSelection);
        }

        var selectedRangeIndex = userSelectedRanges.indexOf(
            userSelectedRanges.find(i => i.id === Id && i.title === this.props.title));
        userSelectedRanges[selectedRangeIndex].comment = commentText;

        this.setState({
            selectedRanges: userSelectedRanges
        });
    }

    highlightRange(range, id) {
        var clonedRange = range.cloneRange();
        var newNode = document.createElement("span");
        newNode.setAttribute(
            "class",
            "highlight"
        );
        newNode.setAttribute(
            "id", id
        );
        clonedRange.surroundContents(newNode);
    }

    getSafeRanges(dangerous) {
        var a = dangerous.commonAncestorContainer;

        var s = new Array(0), rs = new Array(0);
        if (dangerous.startContainer !== a)
            for (var i = dangerous.startContainer; i !== a; i = i.parentNode)
                s.push(i);


        if (s.length > 0) {
            for (var j = 0; j < s.length; j++) {
                var xs = document.createRange();
                if (j) {
                    xs.setStartAfter(s[j - 1]);
                    xs.setEndAfter(s[j].lastChild);
                }
                else {
                    xs.setStart(s[j], dangerous.startOffset);
                    xs.setEndAfter(
                        (s[j].nodeType === Node.TEXT_NODE)
                            ? s[j] : s[j].lastChild
                    );
                }
                rs.push(xs);
            }
        }

        var e = new Array(0)
        var re = new Array(0);
        if (dangerous.endContainer !== a)
            for (var k = dangerous.endContainer; k !== a; k = k.parentNode)
                e.push(k);


        if (e.length > 0) {
            for (var m = 0; m < e.length; m++) {
                var xe = document.createRange();
                if (m) {
                    xe.setStartBefore(e[m].firstChild);
                    xe.setEndBefore(e[m - 1]);
                }
                else {
                    xe.setStartBefore(
                        (e[m].nodeType === Node.TEXT_NODE)
                            ? e[m] : e[m].firstChild
                    );
                    xe.setEnd(e[m], dangerous.endOffset);
                }
                re.unshift(xe);
            }
        }


        if ((s.length > 0) && (e.length > 0)) {
            var xm = document.createRange();
            xm.setStartAfter(s[s.length - 1]);
            xm.setEndBefore(e[e.length - 1]);
        }
        else {
            return [dangerous];
        }

        rs.push(xm);
        var response = rs.concat(re);

        return response;
    }
}

WikiMedium.propTypes = {
    fetchArticle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    loaded: PropTypes.bool
};

const mapStateToProps = state => ({
    loaded: state.articleReducer.loaded
});

export default connect(mapStateToProps, { fetchArticle })(WikiMedium);