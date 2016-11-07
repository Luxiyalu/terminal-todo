import React, { Component } from 'react';
import logo from './logo.svg';
import Todo from './Todo';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <a className="logo-container" href="https://github.com/Luxiyalu" target="_blank"><img src={logo} className="app-logo" alt="logo" /></a>
        <Todo />
      </div>
    );
  }
}

export default App;