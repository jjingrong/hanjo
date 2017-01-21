"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: ''
    }
  }
  
  componentDidMount() {
  }
  
  render() {
    // User is logged in
    return (
      <div className="container">
        <div id="login">
          <form action="javascript:void(0);" method="get">
            <fieldset className="clearfix">
              <div id='loginFormContainer'>
                <img height='auto' width='80%' style={{marginLeft:'10%'}} src={"/images/HanzoPixel.png"} />
                <p>
                  <span className="fontawesome-user"></span>
                  <input type="text" placeholder="Name" value={this.state.usernameInput} onChange={this.handleChange.bind(this)} required/>  
                </p>
                <p style={{marginTop:'25px'}}>
                  <input type="submit" value="Step into the dojo" style={styleSheet.loginButton} onClick={this.handleSubmit.bind(this)}/>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
  
  handleChange(event) {
    this.setState({usernameInput: event.target.value});
  }
  
  handleSubmit() {
    this.props.setUsername(this.state.usernameInput)
  }
  
}

const styleSheet = {
  loginButton : {
    position: 'absolute',
    bottom: '0',
    width: '100%'
  }
}
