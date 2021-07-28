import React from 'react';
import 'fomantic-ui-css/semantic.css';
import Main from './Main'

class App extends React.Component {
  render() {
    return (
    <div className="ui container">
      <div className="ui massive menu">
        <a className="item" href="/">
          Home
        </a>
        <a className="item" href="/currency">
          Individual Currency Analysis
        </a>
        <a className="item" href="/report">
          Top & Worst Performers
        </a>
        <div className="right menu">
        </div>
      </div>
      <Main/>
    </div>
    )
  }
}
export default App;
