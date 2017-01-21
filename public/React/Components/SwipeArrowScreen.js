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
          <input className='animated fadeIn' id='shootButton' value="Shoot" style={styleSheet.button}/>
        </div>
      </div>
    )
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
