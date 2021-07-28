import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import IndividualCurrencyPage from '../individual-currency/IndividualCurrencyPageComponent'
import Report from '../report/Report'

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/currency' component={IndividualCurrencyPage}></Route>
      <Route exact path='/report' component={Report}></Route>
    </Switch>
  );
}

export default Main;