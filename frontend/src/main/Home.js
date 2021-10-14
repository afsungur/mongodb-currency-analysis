import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Link } from "react-router-dom";


class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>CryptoCurrency Analysis with MongoDB v5.0 Timeseries Database </h1>
        <Link to="/currency">
            <button className="ui button">
                Individual Currency Analysis
            </button>
        </Link>
        <Link to="/topNworstPerformers">
            <button className="ui button">
                Reports
            </button>
        </Link>
        <Link to="/rules">
            <button className="ui button">
                Rules
            </button>
        </Link>
      </div>
    )
  }
}
export default Home;
