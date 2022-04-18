import React from 'react';
import 'fomantic-ui-css/semantic.css';
import * as Realm from "realm-web";
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import IndividualCurrencyPage from '../individual-currency/IndividualCurrencyPageComponent'
import Report from '../report/Report'
import Rules from '../rules/Rules'

const app = new Realm.App({ id: "testtickeranalysis-lgpvr" });

const styles = {width: "200px"};
const logoStyles = {width: "100px"}

function Login({ setUser }) {
  const loginAnonymous = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);
  };
  loginAnonymous()
  //return <button onClick={loginAnonymous}>Log In</button>;
  
  return (<div>Logging in...</div>)
}

function Menu ({ user }) {
  return (
    <div className="ui container">
      <div className="ui massive menu">
        <a className="item" href="/">
          Home
        </a>
        <a className="item" href="/currency">
          Currency Analysis
        </a>
        
        <a className="item" href="/rules">
          Rules
        </a>
        <div className="right menu">
          <a className="item" href="https://cloud.mongodb.com" target="_blank" rel="noreferrer">
            <img alt="" src="/mdblogo.svg" style={styles}/>          
            
          </a>
          <a className="item" href="https://docs.mongodb.com/manual/core/timeseries-collections/" target="_blank" rel="noreferrer">
            <img alt="" src="/ts.avif" style={logoStyles}></img>
          </a>
        </div>
      </div>
      <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/'><Redirect to="/currency" /></Route>
      <Route exact path='/currency' render={(props) => <IndividualCurrencyPage user={user} {...props} /> } ></Route>
      <Route exact path='/report' component={Report}></Route>
      <Route exact path='/rules' render={(props) => <Rules user={user} {...props} /> } ></Route>
      </Switch>
      <div>User id: {user.id}</div>
    </div>
  )
}

const App = () => {

  
  
    // Keep the logged in Realm user in local state. This lets the app re-render
    // whenever the current user changes (e.g. logs in or logs out).
    const [user, setUser] = React.useState(app.currentUser);
  
    // If a user is logged in, show their details.
    // Otherwise, show the login screen.
    return (
      <div>
        
          {user ? <Menu user={user}/> : <Login setUser={setUser} />}
          
      </div>
    );
};
  
  

export default App;
