import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './views/Home'
import City from './views/City'
import Map from './views/Map'
import NotFound from './views/NotFound'
import Detail from 'views/Detail'
import Login from 'views/Login'
import Rent from 'views/Rent'
import Favorite from 'views/Favorite'
import PrivateRoute from 'components/PrivateRoute'
import RentAdd from 'views/Rent/Add'
import RentSearch from 'views/Rent/Search'

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
          <Route path='/login' component={Login}></Route>
          <PrivateRoute path='/rent' exact component={Rent}></PrivateRoute>
          <PrivateRoute path='/rent/add' component={RentAdd}></PrivateRoute>
          <PrivateRoute path='/rent/search' component={RentSearch}></PrivateRoute>
          <PrivateRoute path='/favorite' component={Favorite} exact></PrivateRoute>
          <Route component={NotFound}></Route>
        </Switch>
      </div>
    )
  }
}
