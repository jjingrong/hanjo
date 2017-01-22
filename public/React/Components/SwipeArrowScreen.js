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
      arrowHeading: 0,
      killAudio: new Audio('/sounds/kill.mp3'),
      ryugaAudio: new Audio('/sounds/ult.mp3'),
      enemies: [],
      sonic: false
    }
  }

  componentDidMount() {
    //setTimeout(this.setupMap.bind(this), 3000);
    this.setupMap();
    this.setupDeviceCompass();
    this.setupServerConnection();
  }

  render() {
    // User is logged in
    return (
      <div className='animated fadeIn animated-fast' style={{maxWidth: screen.width, maxHeight: screen.height}}>
        {this.renderModal()}
        <div id='map' style={{ width: screen.width, height:(topSize*100)+'vh'}}>
        </div>
        <img src={'/images/hanzoIcon.png'}
          style={{
            position: 'absolute',
            left: '0',
            right: '0',
            height: '50px',
            width: '50px',
            top: '33%',
            margin: '0 auto',
            WebkitTransform: 'rotate('+(this.state.heading)+'deg)',
            transform: 'rotate('+(this.state.heading)+'deg)',
          }}
        />

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
        <div id='respawnButton' style={styleSheet.respawnButton} onClick={this.respawn.bind(this)}>Respawn</div>
      </Modal>
    )
  }

  respawn() {
    this.closeModal()
    //restart interval
    this.setupServerConnection();
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
    var info = {
      lat: this.props.latitude,
      lng: this.props.longitude,
      heading: this.state.heading,
      username: this.props.username,
    };

    this.state.ryugaAudio.play();
    // Send api to launch
    setTimeout(() => {
      $.post("/shoot-arrow", info,
        (data, status) => {
          if (status === 'success') {
            this.setState({ arrowHeading: info.heading });
            var angle = (Math.round(info.heading / 45.0) * 45) % 360;
            this.state.projectile.setIcon({
                url: '/images/arrow_'+angle.toString()+'.png',
                scale: new google.maps.Size(50, 50),
              });
            if (!this.state.arrowIsFlying) {
              this.setState({arrowIsFlying: true});
              this.setupServerConnection();
            }
          }
        }
      );
    }, 2500)
  }

  setupDeviceCompass() {
    // Obtain a new *world-oriented* Full Tilt JS DeviceOrientation Promise
    var promise = FULLTILT.getDeviceOrientation({ 'type': 'world' });

    // Wait for Promise result
    promise.then((deviceOrientation) => { // Device Orientation Events are supported
      // Register a callback to run every time a new
      // deviceorientation event is fired by the browser.
      deviceOrientation.listen(() => {
        // Get the current *screen-adjusted* device orientation angles
        var currentOrientation = deviceOrientation.getScreenAdjustedEuler();
        // Calculate the current compass heading that the user is 'looking at' (in degrees)
        var compassHeading = 360 - currentOrientation.alpha;
        // Set compass heading to state
        this.setState({ heading: compassHeading });
      });

    }).catch(function(errorMessage) { // Device Orientation Events are not supported
      console.log(errorMessage);
    });
  }

  setupServerConnection() {
    if (this.state.pollFunction) {
      clearInterval(this.state.pollFunction);
    }
    var func = setInterval(this.checkStatusFromServer.bind(this), 600);

    this.setState({ pollFunction: func });
  }

  setupMap() {
    var hanzo = new google.maps.LatLng(
      parseFloat(this.props.latitude),
      parseFloat(this.props.longitude)
    );

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: hanzo,
      heading: 0
    });

    var SonicControl = (controlDiv, map) => {
      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#2c3338';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.margin = '12px';
      controlUI.style.textAlign = 'center';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.style.paddingTop = '5px';
      controlText.innerHTML = '<img src="/images/icon-ability-sonic.png" />';
      controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to Chicago.
      controlUI.addEventListener('click', () => {
        this.toggleSonic();
      });

    }

    var sonicControlDiv = document.createElement('div');
    var sonicControl = new SonicControl(sonicControlDiv, map);

    sonicControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(sonicControlDiv);


    map.setOptions({ draggable: false, zoomControl: false, disableDefaultUI: true });
    this.setState({ map: map });

    var projectile = new google.maps.Marker({
      position: hanzo,
      map: map,
      visible: true,
      icon: {
        url: '/images/arrow_0.png',
        scale: new google.maps.Size(50,50),
      }
    });

    this.setState({ projectile: projectile });
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
          // Move projectile
          this.state.projectile.setVisible(true);
          var newPos = new google.maps.LatLng(parseFloat(data.arrow_lat), parseFloat(data.arrow_lng));
          this.state.projectile.setPosition(newPos);

          // Get alive enemies
          this.setState({ enemies: data.enemies });

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
            this.state.projectile.setVisible(false);
          }

          if (data.arrow_hit) {
            // do arrow hit things like show eliminations
            console.log('eliminated', data.arrow_hit_at);
            this.state.killAudio.play();
            this.state.projectile.setVisible(false);

            this.setState({
              arrowStatusText: 'Eliminated '+ data.arrow_hit_at,
            }, () => {
              setTimeout(() => {
                this.setState({arrowIsFlying: false, arrowStatusText: 'Traversing'})
              }, 5000)
            });
          }

          if (data.expired) {
            // do expired things
            console.log('expired you missed');
            this.state.projectile.setVisible(false);
            this.setState({
              arrowStatusText: 'You missed, resetting arrow . . ',
            }, () => {
              setTimeout(() => {
                this.setState({arrowIsFlying: false, arrowStatusText: 'Traversing'})
              }, 3000)
            });
          }
        }
      }
    );

  }

  toggleSonic() {
    if (!this.state.sonic) {
      this.setState({ sonic: true });
      var sonicArray = [];
      for (var i=0; i<this.state.enemies.length; i++) {
        var enemyMarker = new google.maps.Marker({
          position: this.state.enemies[i],
          map: this.state.map,
          visible: true,
          icon: {
		        path: google.maps.SymbolPath.CIRCLE,
		        scale: 6,
		        fillColor: 'red',
    				fillOpacity: 0.9,
    				strokeOpacity: 0.9,
    				strokeWeight: 1.0,
    				strokeColor: '#2f4f4f'
  		    }
        });
        sonicArray.push(enemyMarker);
      }

      setTimeout(() => {
        for (var i=0; i<sonicArray.length; i++) {
          sonicArray[i].setVisible(false);
          sonicArray[i].setMap(null);
        }
        this.setState({ sonic: false });
      }, 12000);
    }
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
  respawnButton : {
    minHeight: '40px',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitDisplay: 'flex',
    WebkitAlignItems: 'center',
    WebkitJustifyContent: 'center',
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
    height                : '30vh',
    width                 : '60%',
    flexDirection: 'column',
    alignItems: 'center',
  }
};
