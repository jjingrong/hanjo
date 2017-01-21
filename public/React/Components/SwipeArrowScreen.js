"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

/*
Props received:
- username
- latitude
- longitude
*/

const topSize = 0.75

export class SwipeArrowScreen  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrowIsFlying: false,
      arrowStatusText: 'Traversing',
      heading: 0,
      locationURL:"https://maps.googleapis.com/maps/api/staticmap?center="+this.props.latitude+','+this.props.longitude+"&zoom=15&size="+screen.width+"x"+(parseInt(screen.height*topSize))+"&key=AIzaSyBbInQqM4JrDDU_VlqqcNkGy99HkLMGd_8"
    }
  }

  componentDidMount() {
    this.setupDeviceCompass();
    this.setupServerConnection();
  }

  render() {
    // User is logged in
    return (
      <div>
        <div style={{height:(topSize*100)+'vh'}}>
          <img src={this.state.locationURL} />
        </div>
        <div style={{height:'25vh'}}>
          {this.renderArrowStatus()}
        </div>
      </div>
    )
  }

  renderArrowStatus() {
    if (this.state.arrowIsFlying) {
      return (
        <div id='arrowStatusText'>
          {this.state.arrowStatusText}
        </div>
      )
    } else {
      return (
        <div className='animated fadeIn' id='shootButton' style={styleSheet.button} onClick={this.launchArrow.bind(this)}>
          Shoot
        </div>
      )
    }
  }

  launchArrow() {
    // Send api to launch
    $.post("/shoot-arrow",
      {
        lat: this.props.latitude,
        lng: this.props.longitude,
        heading: this.state.heading,
        username: this.props.username,
      },
      (data, status) => {
        if (status === 'success') {
          this.setState({arrowIsFlying: true})
        }
      }
    );
  }

  setupDeviceCompass() {
    // Obtain a new *world-oriented* Full Tilt JS DeviceOrientation Promise
    var promise = FULLTILT.getDeviceOrientation({ 'type': 'world' });

    // Wait for Promise result
    promise.then((deviceOrientation) => { // Device Orientation Events are supported
      // Register a callback to run every time a new
      // deviceorientation event is fired by the browser.
      deviceOrientation.listen(function() {
        // Get the current *screen-adjusted* device orientation angles
        var currentOrientation = deviceOrientation.getScreenAdjustedEuler();
        // Calculate the current compass heading that the user is 'looking at' (in degrees)
        var compassHeading = 360 - currentOrientation.alpha;
        // Set compass heading to state
        this.state.heading = compassHeading;
      });

    }).catch(function(errorMessage) { // Device Orientation Events are not supported
      console.log(errorMessage);
    });
  }

  setupServerConnection() {
    this.state.pollFunction = setInterval(this.checkStatusFromServer.bind(this), 1000);
  }

  checkStatusFromServer() {
    console.log('don this');
    $.get("/get-status",
      {
        lat: this.props.latitude,
        lng: this.props.longitude,
        username: this.props.username,
      },
      (data, status) => {
        console.log(data, status);
        if (status === 'success') {
          if (data.self_hit) {
            // dead, so we reset
            clearInterval(this.state.pollFunction);
            console.log('eliminated by', data.self_hit_by);
            // do dead things
          }

          if (data.arrow_hit) {
            // do arrow hit things like show eliminations
            console.log('eliminated', data.arrow_hit_at);
          }
        }
      }
    );

  }
}

const styleSheet = {
  button : {
    position: 'absolute',
    textAlign: 'center',
    bottom: '0',
    width: '100vw',
    marginBottom: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
}
