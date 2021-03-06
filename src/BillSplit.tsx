import * as React from 'react';
import ItemFieldSet from './ItemFieldSet';
import NameFieldSet from './NameFieldSet';
import Result from './Result';
import { Switch, Route } from 'react-router-dom';

/** This component should hold the overall application state and manage which page to show. */
export class BillSplit extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact path="/" component={NameFieldSet} />
        <Route path="/Items" component={ItemFieldSet} />
        <Route path="/Result" component={Result} />
      </Switch>
    );
  }
}

export default BillSplit;
