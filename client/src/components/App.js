import React from "react";
import { Route, Switch } from 'react-router-dom';
import AuthRoute from '../util/route_util';

import Register from './auth/Register';
import Login from './auth/Login';
import Nav from './ui/Nav';



const App = () => {
  return (
    <main>
    <AuthRoute path="/" component={Nav} routeType="" />
      <Switch>
        <AuthRoute exact path="/" component={Register} routeType="auth" />
        <AuthRoute exact path="/login" component={Login} routeType="auth" />
      </Switch>
    </main>
  );
};

export default App;