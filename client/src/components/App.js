import React from "react";
import { Switch } from 'react-router-dom';
import AuthRoute from '../util/route_util';

import Register from './auth/Register';
import Login from './auth/Login';
import Nav from './ui/Nav';
import PhotoForm from './photos/PhotoForm';
import Feed from './feed/Feed';
import Explore from './explore/explore';
import UserShow from './users/UserShow';
import PhotoShow from './photos/PhotoShow';



const App = () => {
  return (
    <main>
    <AuthRoute path="/" component={Nav} routeType="" />
      <Switch>
        <AuthRoute exact path="/" component={Login} routeType="auth" />
        <AuthRoute exact path="/register" component={Register} routeType="auth" />
        <AuthRoute exact path="/post" component={PhotoForm} routeType="protected" />
        <AuthRoute exact path="/feed" component={Feed} routeType="protected" />
        <AuthRoute exact path="/explore" component={Explore} routeType="protected" />
        <AuthRoute exact path="/users/:userId" component={UserShow} routeType="protected" />
        <AuthRoute exact path="/photos/:photoId" component={PhotoShow} routeType="protected" />
      </Switch>
    </main>
  );
};

export default App;