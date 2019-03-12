import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from '../components/login';
import UserNotes from '../components/notes';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Login} />
    <Route path="/login" component={Login} />
    <Route path="/notes" component={UserNotes} />
  </Switch>
);

export default Routes;
