"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: null
    }
  }
  
  componentDidMount() {
  }
  
  render() {
    // User is logged in
    return (
      <div>Login</div>
    )
  }
  
  setUsername(usernameInput) {
    this.setState({usernameInput: usernameInput})
  }
}
