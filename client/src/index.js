import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import ToolTip from './components/ToolTip/ToolTipComponent';
import ArticleContent from './components/ArticleContent/ArticleContentComponent';
import Comment from './components/Comment/CommentComponent';
import './index.css';


class WikiMedium extends Component {
    constructor(){
        super();

        this.state = {
            activeElement:{},
            lastSelection:{},
            toolTipLocStyle : {
                opacity:0
            },
            commentBoxLocStyle : {
                opacity:0
            },
            selectedRanges : [],
            currentText : null
        };
    }

    render() {
        return (
            <div className="wiki-medium">
                <div className="header">
                    <h1>Wiki-Medium</h1>
                </div>
                <hr/>
                <div className="articleContent">
                    <Comment commentBoxLocStyle = {this.state.commentBoxLocStyle} currentText={this.state.currentText} saveComment={(t)=>this.saveComment(t)} />
                    <ToolTip toolTipLocStyle= {this.state.toolTipLocStyle} onHighLight={() => this.onHighlight()} onComment={() => this.onComment()}/>
                    <div onMouseUp={(e) => this.handleMouseUp(e)} onClick={(e)=>this.onHighlightSelect(e)}>
                        <ArticleContent title={this.props.match.params.title}/>
                    </div>
                </div>
            </div>
        );
    }

    handleMouseUp(e){
        if(e.target.className !== 'highlight'){
            setTimeout(function (){
                var lastSelection = null;
                var toolTipLocStyle = {
                    display:'none',
                    opacity: 0
                };
                if(document.getSelection() && document.getSelection().toString() !== ''){
                    lastSelection = document.getSelection().getRangeAt(0);
                    toolTipLocStyle = this.positionToolTip(document.getSelection());
                }
        
                this.setState({
                    lastSelection:lastSelection,
                    activeElement:null,
                    toolTipLocStyle :toolTipLocStyle
                    ,commentBoxLocStyle : {
                        opacity:0
                    }
                });
            }.bind(this),2);
        }
    }

    positionToolTip(selection){
        var scrollPosition = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var selectionRange = selection.getRangeAt(0).getBoundingClientRect();
        var top = selectionRange.top - 80;
        var left = ((selectionRange.left + selectionRange.right) / 2) - 60;

        return {
            top : top + scrollPosition + "px",
            left: left + "px",
            opacity: 1
        }
    }

    onHighlight(){
        this.highlightSelection();
    }

    highlightSelection(selection) {
        var userSelectedRanges = this.state.selectedRanges;
        if(this.state.activeElement){
            var newNode = document.createTextNode(this.state.activeElement.innerText);
            this.state.activeElement.parentNode.replaceChild(newNode,this.state.activeElement);

            var updatedSelectedRanges = [];
            for (let i = 0; i < userSelectedRanges.length; i++) {
                if(i !== this.state.activeElement.id){
                    updatedSelectedRanges.push(userSelectedRanges[i]);
                }
            }

            this.setState({
                toolTipLocStyle : {
                    opacity: 0,
                    display: 'none'
                },
                selectedRanges : updatedSelectedRanges
            });

            return;
        }
        else{
            var userSelection = selection == null ? window.getSelection().getRangeAt(0) : selection;
            var safeRanges = this.getSafeRanges(userSelection);
            var maxId = 1;
            var Ids = [];
            if(userSelectedRanges.length > 0)
                maxId = userSelectedRanges[userSelectedRanges.length - 1].id + 1;
            
            for (var i = 0; i < safeRanges.length; i++) {
                Ids.push(maxId);
                this.highlightRange(safeRanges[i],maxId);
                userSelectedRanges.push({
                    id : maxId,
                    range: safeRanges[i],
                    comment: null
                });
                maxId++;
            }

            this.setState({
                selectedRanges : userSelectedRanges
            });
        
            return Ids;
        }

        
    }

    onHighlightSelect(e){
        if(e.target.className === 'highlight'){
            this.setState({
                activeElement: e.target,
                toolTipLocStyle : this.positionToolTip(document.getSelection())
            });
        }
    }

    onComment(){
        var commentText = null;
        if(this.state.activeElement && this.state.activeElement.className === 'highlight'){
            var userSelectedRanges = this.state.selectedRanges;
            var selectedRangeIndex = userSelectedRanges.indexOf(
                userSelectedRanges.find(i => i.id === parseInt(this.state.activeElement.id)));
            commentText = userSelectedRanges[selectedRangeIndex].comment;
        }
        var scrollPosition = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var selectionRange = document.getSelection().getRangeAt(0).getBoundingClientRect();
        var top = selectionRange.top - 30;
        this.setState({
            commentBoxLocStyle : {
                top : top + scrollPosition + "px",
                opacity: 1
            },
            currentText: commentText
        });
    }

   
    saveComment(commentText){
        var userSelectedRanges = this.state.selectedRanges;
        if(this.state.activeElement && this.state.activeElement.className === 'highlight'){
            var selectedRangeIndex = userSelectedRanges.indexOf(
                userSelectedRanges.find(i => i.id === parseInt(this.state.activeElement.id)));
            userSelectedRanges[selectedRangeIndex].comment = commentText;
        }else{
            var Ids = this.highlightSelection(this.state.lastSelection);
            Ids.forEach(element => {
                var selectedRangeIndex = userSelectedRanges.indexOf(
                    userSelectedRanges.find(i => i.id === element));
                userSelectedRanges[selectedRangeIndex].comment = commentText;
            });
        }

        this.setState({
            selectedRanges: userSelectedRanges
        });
    }

    highlightRange(range,id) {
        var newNode = document.createElement("span");
        newNode.setAttribute(
            "class",
            "highlight"
         );
         newNode.setAttribute(
            "id", id
         );
        range.surroundContents(newNode);
    }

    getSafeRanges(dangerous) {
        var a = dangerous.commonAncestorContainer;

        var s = new Array(0), rs = new Array(0);
        if (dangerous.startContainer !== a)
            for(var i = dangerous.startContainer; i !== a; i = i.parentNode)
                s.push(i)
        ;
        if (0 < s.length) for(var j = 0; j < s.length; j++) {
            var xs = document.createRange();
            if (j) {
                xs.setStartAfter(s[j-1]);
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
    
        var e = new Array(0), re = new Array(0);
        if (dangerous.endContainer !== a)
            for(var k = dangerous.endContainer; k !== a; k = k.parentNode)
                e.push(k)
        ;
        if (0 < e.length) for(var m = 0; m < e.length; m++) {
            var xe = document.createRange();
            if (m) {
                xe.setStartBefore(e[m].firstChild);
                xe.setEndBefore(e[m-1]);
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

        if ((0 < s.length) && (0 < e.length)) {
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

ReactDOM.render(
    <Router history={createBrowserHistory}>
        <Route exact path="/wiki/:title" component={WikiMedium} />
    </Router>,
    document.getElementById('root')
);
