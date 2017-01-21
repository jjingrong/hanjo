"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

export class SwipeArrowScreen  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  componentDidMount() {
  }
  
  render() {
    // User is logged in
    return (
      <div>
        Hello {this.props.username}
      </div>
    )
  }
}

const styleSheet = {

}
