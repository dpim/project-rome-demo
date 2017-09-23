import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import 'bootstrap/dist/css/bootstrap.min.css';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('mount')
  );
});
