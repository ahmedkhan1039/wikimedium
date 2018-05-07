import React, { Component } from 'react';
import './Comment.css';

export default class Comment extends Component{
    render(){
        return(
        <div id="commentNotes" style={this.props.commentBoxLocStyle} className="comment">
            <div id="header"><i className="fa fa-comment"></i> PRIVATE COMMENT 
            <button id="saveComment" onClick={() => this.props.saveComment(document.getElementById('commentContent').innerText)}>Save Comment</button></div>
            <div contentEditable placeholder="Write Note Here" id="commentContent">{this.props.currentText}</div>          
        </div>);
    }
}