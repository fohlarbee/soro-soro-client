import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Chats from './pages/Chats';
import getGoogleUrls from './utils/getGoogleUrls';
import { Button } from '@chakra-ui/react';

// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom"

function App() {


  return (
    <div className='App'>
    <BrowserRouter>
      <Route path='/' component={Home} exact />
      <Route path='/chats' component={Chats} exact/>
    </BrowserRouter>
    </div>
    
    // <div className="App">
    //   {/* <a href={getGoogleUrls()}>Login with google</a> */}
    //   {/* <Button>Button</Button> */}
    
       

     

    
    // </div>
  );
}

export default App;
