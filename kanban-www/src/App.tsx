import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const axios = require('axios');
  axios.get('http://localhost:3007/action/jira/test?query_string=filter=19917')
  .then(function (response:any) {
    // handle success
    console.log(response);
  })
  .catch(function (error:Error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });




  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
