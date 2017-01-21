"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

/* 
Props received:
- username
*/

const topSize = 0.75

export class SwipeArrowScreen  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrowIsFlying: false,
      arrowStatusText: 'Traversing',
      locationURL:"https://maps.googleapis.com/maps/api/staticmap?center="+this.props.latitude+','+this.props.longitude+"&zoom=15&size="+screen.width+"x"+(parseInt(screen.height*topSize))+"&key=AIzaSyBbInQqM4JrDDU_VlqqcNkGy99HkLMGd_8"
    }
  }
  
  componentDidMount() {
  }
  
  render() {
    console.log(this.state.locationURL)
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
    
    this.setState({arrowIsFlying: true})
    // Start listening to arrow events
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
