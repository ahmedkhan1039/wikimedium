import React, { Component } from 'react';
import './ToolTip.css';

export default class ToolTip extends Component{
    render(){
        return(
        <div className="tooltip" style = {this.props.toolTipLocStyle}>
             <button className="button-tooltip" onClick={() => this.props.onHighLight()}><i className="fa fa-pencil"></i></button>
             <button className="button-tooltip extra-margin-left" onClick={() => this.props.onComment()}><i className="fa fa-comment"></i></button>
        </div>);
    }
}