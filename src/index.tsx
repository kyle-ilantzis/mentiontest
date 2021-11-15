import 'typeface-roboto';
import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import TrixEditor from './TrixEditor';
// import TinyEditor from './TinyEditor';
import PellEditor from './PellEditor';

const appStyle = {
  maxWidth: '900px',
  margin: 'auto',
};

const App = () => {
  return (
    <div style={appStyle}>
      <h1>Trix text</h1>
      <hr/>
      {/* <TrixEditor/> */}
      <PellEditor/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));