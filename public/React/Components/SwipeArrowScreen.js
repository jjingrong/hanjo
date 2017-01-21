"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

/* 
Props received:
- username
*/

export class SwipeArrowScreen  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrowIsFlying: false,
    }
  }
  
  componentDidMount() {
  }
  
  render() {
    // User is logged in
    return (
      <div>
        <div style={{height:'75vh', backgroundColor:'yellow'}}>
        </div>
        <div style={{height:'25vh'}}>
          {this.renderArrowStatus()}
        </div>
      </div>
    )
  }
  
  renderArrowStatus() {
    if (this.state.arrowIsFlying) {
      
    } else {
      return (
        <input className='animated fadeIn' id='shootButton' value="Shoot" style={styleSheet.button}/>
      )
    }
  }
}

const styleSheet = {
  button : {
    position: 'absolute',
    textAlign: 'center',
    bottom: '0',
    width: '100vw',
    marginBottom: '0px'
  },
}
