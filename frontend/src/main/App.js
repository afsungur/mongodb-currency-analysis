import React from 'react';
import 'fomantic-ui-css/semantic.css';
import Main from './Main'


const styles = {
  width: "200px"
};

const logoStyles = {width: "100px"}

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
          <a className="item" href="https://cloud.mongodb.com" target="_blank">
            <img src="https://webimages.mongodb.com/_com_assets/cms/MongoDB_Logo_FullColorBlack_RGB-4td3yuxzjs.png?auto=format%2Ccompress" style={styles}/>          
            
          </a>
          <a className="item" href="https://docs.mongodb.com/manual/core/timeseries-collections/" target="_blank">
            <img src="https://webimages.mongodb.com/_com_assets/cms/kqttj75kal7lsn48z-time_series_4@2x.png?auto=format%2Ccompress&ch=DPR" style={logoStyles}></img>
          </a>
        </div>
      </div>
      <Main/>
    </div>
    )
  }
}
export default App;
