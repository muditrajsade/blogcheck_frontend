// App.js
import React from 'react';
import BloggerAuth from './components/Login';
import { Route,Router,Routes } from 'react-router-dom';
import Home from './components/Home';

import User from './components/User';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element = {<Home/>} />

        <Route path='/user' element = {<User/>} />


        
        
        
      </Routes>
    </div>
  );
}

export default App;
