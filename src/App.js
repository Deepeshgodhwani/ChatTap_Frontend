
import './App.css';
import Chat from './pages/chat_page';
import Home from './pages/Home';
import React from "react";
import {Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      
      <Route exact path="/" component={Home}/>
      <Route exact path="/chat" component={Chat}/>   
    </div>
  );
}

export default App;
