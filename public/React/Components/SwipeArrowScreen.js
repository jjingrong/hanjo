"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

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
      modalIsOpen: false,
      arrowIsFlying: false,
      arrowStatusText: 'Traversing',
      modalText: '',
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
      <div className='animated fadeIn animated-fast'>
        {this.renderModal()}
        <div style={{height:(topSize*100)+'vh'}}>
          <img src={this.state.locationURL} />
        </div>
        <div style={{height:'25vh'}}>
          {this.renderArrowStatus()}
        </div>
      </div>
    )
  }

  renderModal() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={modalStyles}
        contentLabel="Modal"
      >
        <p id='modalStatusText'>{this.state.modalText}</p> 
        <div id='respawnButton' style={styleSheet.button} onClick={this.respawn.bind(this)}>Respawn</div>
      </Modal>
    )
  }

  respawn() {
    this.closeModal()
    //TODO logic to restart interval to check death
  }

  renderArrowStatus() {
    if (this.state.arrowIsFlying) {
      return (
        <div id='arrowStatusText' className='animated-fast animated fadeInUp'>
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
          if (!this.state.arrowIsFlying) {
            console.log('lol');
            this.setState({arrowIsFlying: true});
            this.setupServerConnection();
          }
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
    if (this.state.pollFunction) {
      clearInterval(this.state.pollFunction);
    }
    this.state.pollFunction = setInterval(this.checkStatusFromServer.bind(this), 1000);
  }

  checkStatusFromServer() {
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
            this.setState({
              modalIsOpen:true,
              modalText: 'Eliminated by:' + data.self_hit_by,
              arrowIsFlying: false,
            })
            // do dead things
          }

          if (data.arrow_hit) {
            // do arrow hit things like show eliminations
            console.log('eliminated', data.arrow_hit_at);
            this.setState({
              arrowStatusText: 'Eliminated '+ data.arrow_hit_at,
              arrowIsFlying: false
            });
          }
        }
      }
    );

  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }
}

const styleSheet = {
  button : {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitDisplay: 'flex',
    WebkitAlignItems: 'center',
    WebkitJustifyContent: 'center',
    position: 'absolute',
    bottom: '0',
    width: '90%',
    marginLeft: '5%',
  },
}

const modalStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0, 0, 0, 0.5)'
  },
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    padding               : '30px',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : '#fff',
    borderRadius          : '4px',
    display               :'flex',
    justifyContent        :'center',
    WebkitDisplay         : 'flex',
    WebkitJustifyContent  : 'center',
    height                :'30vh',
  }
};
