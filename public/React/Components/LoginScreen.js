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
      <div className="container">
        <div id="login">
          <form action="javascript:void(0);" method="get">
            <fieldset className="clearfix">
              <div id='loginFormContainer'>
                <img height='auto' width='80%' style={{marginLeft:'10%'}} src={"/images/HanzoPixel.png"} />
                <p><span className="fontawesome-user"></span><input type="text" value="Username" onBlur="if(this.value == '') this.value = 'Username'" onFocus="if(this.value == 'Username') this.value = ''" required/></p>
                <p style={{marginTop:'25px'}}>
                  <input type="submit" value="Step into the dojo" style={styleSheet.loginButton}/>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
  
  setUsername(usernameInput) {
    this.setState({usernameInput: usernameInput})
  }
}

const styleSheet = {
  loginButton : {
    position: 'absolute',
    bottom: '0',
    width: '100%'
  }
}
