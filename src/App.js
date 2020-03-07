import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './App.css';
import {FaCarSide} from 'react-icons/fa';
import {FaCircleNotch} from 'react-icons/fa';

class App extends Component {
  state = {
    response: false,
    isLoaded: false,
    items: []
  }

  componentDidMount() {
    fetch("http://smart.sum.ba/parking?withParkingSpaces=1")
    .then(res => res.json())
    .then(json => {
      this.setState({
          items: json,
          isLoaded: true,
      })
    });

    const socket = socketIOClient("http://smart.sum.ba/parking-events");
    socket.on("parking-lot-state-change", data => this.setState({ response: data }));
  }

  render(){
    var { items, isLoaded, response } = this.state;
    console.log(response.id_parking_space);

    if(isLoaded){
      var socketDataResponse = items[0].parkingSpaces.map(i => {
        if(i.id == response.id_parking_space){
          console.log(response.occupied);
          i.occupied = response.occupied;
        }
      })
    }

    if(!isLoaded){
      return <div>Loading...</div>
    }else{
      return(
        <div className="container">
            { items[0].parkingSpaces.map(item =>(
              <div key={item.id} className="card">
              <div className="card__header">
                <FaCarSide/>
                <span>
                {item.parking_space_name}
                </span>
                <hr />
              </div>
              <div className="card__body">
                { item.occupied === 1 ? <FaCircleNotch color="red"/> : <FaCircleNotch color="green"/>}
                <button>Rezerviraj</button>
                <button>Detalji</button>
              </div>
              </div>
            ))};
        </div>
      );
    }
  }
}

export default App;
