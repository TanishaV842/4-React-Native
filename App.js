// root component(App.js)
import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

export default function App() {
  return (
    //  pass Provider store component as a prop
    <Provider store={store}> 
      <Main />
    </Provider>
  );
}


