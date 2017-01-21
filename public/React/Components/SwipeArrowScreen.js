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
      locationURL:"https://maps.googleapis.com/maps/api/staticmap?center="+this.props.latitude+','+this.props.longitude+"&zoom=15&size="+screen.width+"x"+(parseInt(screen.height*topSize))+"&key=AIzaSyBbInQqM4JrDDU_VlqqcNkGy99HkLMGd_8"
    }
  }
  
  componentDidMount() {
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
      >
        <p>Modal Content.</p>
      </Modal>
    )
  }
  
  renderArrowStatus() {
    if (this.state.arrowIsFlying) {
      return (
        <div id='arrowStatusText' className='animated fadeInLeft animated-fast'>
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
    this.setState({arrowIsFlying: true, modalIsOpen:true})
    // Start listening to arrow events
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
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : '#fff',
    borderRadius          : '4px',
  }
};
