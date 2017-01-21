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
        <input className='animated fadeIn' id='shootButton' type="submit" value="Shoot" style={styleSheet.button}/>
      </div>
    )
  }
}

const styleSheet = {
  button : {
    position: 'absolute',
    bottom: '0',
    width: '100vw',
    marginBottom: '0px'
  },
}
