import React from 'react';
import './Comment.css';

export const Comment = props => {
    return(
        <div id="commentNotes" style={props.commentBoxLocStyle}>
            <div id="header"><i className="fa fa-comment"></i> PRIVATE COMMENT 
            <button id="saveComment" onClick={() => props.saveComment(document.getElementById('commentContent').innerText)}>Save Comment</button></div>
            <div id="commentContent" contentEditable placeholder="Write Note Here">{props.currentText}</div>          
        </div>
    );
}