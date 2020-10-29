import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './views/Home'
import City from './views/City'
import Map from './views/Map'
import NotFound from './views/NotFound'
import Detail from 'views/Detail'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Switch>
          <Redirect exact from='/' to='/home'></Redirect>
          <Route path='/home' component={Home}></Route>
          <Route path='/city' component={City}></Route>
          <Route path='/map' component={Map}></Route>
          <Route path='/detail/:id' component={Detail}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </div>
    )
  }
}
