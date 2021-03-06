import React from 'react'
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import Slider from 'react-rangeslider';
import ReactLeafletRubbersheet from 'react-leaflet-distortable-imageoverlay';

import 'leaflet/dist/leaflet.css';
import 'react-rangeslider/lib/index.css'
import './index.css'
import Logo from './logo.png'

export default class App extends React.Component {
  state = { opacity: 0.75, mode: 'rotate' }

  clickRotate() {
    this.setState({ mode: 'rotate' });
  }

  clickDistort() {
    this.setState({ mode: 'distort' });
  }

  onUpdate(corners) {
    console.log(corners);
  }

  handleOpacityChange(value) {
    this.setState({
      opacity: value / 100.0
    })
  };

  render() {

    return (
      <div className="map">

        <div className="center logo-container">
          <img className="logo" src={Logo}></img>
          <p>How well can you place this drone image on the map?<br></br>  Use the rotate, scale and distort tools to find out.</p>
        </div>

        <div className="center tool-container">
          <button className={this.state.mode === 'rotate' ? 'btn enabled' : 'btn' } href="#" onClick={this.clickRotate.bind(this)}><i className="fa fa-refresh"></i><span className="tool-text">Rotate</span></button>
          <button className={this.state.mode === 'distort' ? 'btn enabled' : 'btn' } href="#" onClick={this.clickDistort.bind(this)}><i className="fa fa-object-group"></i><span className="tool-text">Distort</span></button>

          <div className="opacity-container">
          <h4>Opacity:</h4>
          <Slider
            min={0}
            max={100}
            value={this.state.opacity * 100.0}
            onChange={this.handleOpacityChange.bind(this)}
          />
          </div>

        </div>

        <Map
          bounds={[[43.788434, 15.644610,0],[43.775297, 15.660593,0]]}
        >
          <TileLayer
            noWrap={true}
            attribution=""
            url="https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"/>

          <ReactLeafletRubbersheet
            url="https://i.imgur.com/jaRqxHa.jpg"
            onUpdate={this.onUpdate.bind(this)}
            opacity={this.state.opacity}
            mode={this.state.mode}
            corners={true && [
              new L.latLng(43.78710550492949,15.647438805314396),
              new L.latLng(43.78710550492949,15.655914504316957),
              new L.latLng(43.78098644922989,15.647438805314396),
              new L.latLng(43.78098644922989,15.655914504316957)
            ]} />
        </Map>
      </div>
    )
  }
}
