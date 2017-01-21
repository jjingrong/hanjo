"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

import {LoginScreen} from './Components/LoginScreen'
import {SwipeArrowScreen} from './Components/SwipeArrowScreen'

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      latitude: null,
      longitude: null,
    }
  }
  
  render() {
    // User is logged in
    if (this.state.username) {
      return (
        <SwipeArrowScreen
          latitude = {this.state.latitude}
          longitude = {this.state.longitude}
          username = {this.state.username}
          />
      )
    } else {
      // User is not logged in, show login page
      return (
        <LoginScreen
          latitude = {this.state.latitude}
          longitude = {this.state.longitude}
          setLatLong = {this.setLatLong.bind(this)}
          setUsername = {this.setUsername.bind(this)}
          />
      )
    }
  }
  
  setLatLong(lat, lon) {
    this.setState({
      latitude: lat,
      longitude: lon
    })
  }
  
  setUsername(username) {
    this.setState({username: username})
    console.log('Username set! It is: ' + username)
  }
  
}

ReactDOM.render(<MainPanel/>, reactContent);
