"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

import {LoginScreen} from './Components/LoginScreen'

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null
    }
  }
  
  render() {
    // User is logged in
    if (this.state.username) {
      return (
        <LoginScreen 
          setUsername = {this.setUsername.bind(this)}
          />
      )
    } else {
      // User is not logged in, show login page
      return (
        <LoginScreen 
          setUsername = {this.setUsername.bind(this)}
          />
      )
    }
  }
  
  setUsername(username) {
    this.setState({username: username})
  }
  
}

ReactDOM.render(<MainPanel/>, reactContent);
