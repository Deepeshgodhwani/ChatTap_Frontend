import './App.css';
import Chat from './pages/chat_page';
import Home from './pages/Home';
import React,{useEffect} from "react";
import {Route,useHistory} from "react-router-dom";




function App() {
   
  let history = useHistory();

  const renderPage = () => {
    if (localStorage.getItem("token")) {
      return history.push("/chat");
    }
  };

  useEffect(() => {
    renderPage();
    document.title = "ChatTap";
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <Route exact path="/" component={Home}/>
      <Route exact path="/chat" component={Chat}/>   
    </div>
  );
}

export default App;
