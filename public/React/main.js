"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }
  
  render() {
    return (
      <div>HELLO REACT </div>
    )
  }
}

ReactDOM.render(<MainPanel/>, reactContent);
