import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import IndividualCurrencyPage from '../individual-currency/IndividualCurrencyPageComponent'
import Report from '../report/Report'
import Rules from '../rules/Rules'

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/currency' component={IndividualCurrencyPage}></Route>
      <Route exact path='/report' component={Report}></Route>
      <Route exact path='/rules' component={Rules}></Route>
    </Switch>
  );
}

export default Main;