"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: '',
    }
  }
  
  componentDidMount() {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000000,
      }
      navigator.geolocation.getCurrentPosition(this.storePosition.bind(this), this.showError.bind(this), options);
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }
  
  render() {
    // User is logged in
    return (
      <div className="container">
        <div id="login">
          <form onSubmit={this.handleSubmit.bind(this)} method="get">
            <fieldset className="clearfix">
              <div id='loginFormContainer'>
                <div>
                  <img height='auto' width='80%' style={{marginLeft:'10%'}} src={"/images/HanzoPixel.png"} />
                  <div style={styleSheet.hanjoText}>iHanjo</div>
                </div>
                <p>
                  <span className="fontawesome-user"></span>
                  <input type="text" placeholder="Name" value={this.state.usernameInput} onChange={this.handleChange.bind(this)} required/>  
                </p>
                <p style={{marginTop:'25px'}}>
                  {this.renderButton()}
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
  
  renderButton() {
    if (this.props.latitude) {
      return (<input type="submit" value="Step into the dojo" style={styleSheet.loginButton}/>)
    } else {
      return (<input type="submit" value="Getting location" style={styleSheet.invalidLoginButton}/>)
    }
  }
  
  handleChange(event) {
    this.setState({usernameInput: event.target.value});
  }
  
  handleSubmit(event) {
    event.preventDefault();
    if (this.props.latitude) {
      this.props.setUsername(this.state.usernameInput)
    } else {
      alert('We need your location!')
    }
  }
  
  storePosition(position) {
    console.log('got position')
    this.setState({
      buttonColor: null,
    }, () => {
      this.props.setLatLong(position.coords.latitude, position.coords.longitude)
    })
  }
  
  showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.")
      break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
      break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.")
      break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
      break;
    }
  }
  
}

const styleSheet = {
  invalidLoginButton: {
    backgroundColor: 'grey',
    marginBottom: '0px',
  },
  loginButton : {
    marginBottom: '0px',
  },
  hanjoText: {
    textAlign: 'center',
    color: 'whitesmoke',
    fontSize: '18px'
  }
}
