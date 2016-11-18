import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'containers/App';

import Notifications from 'containers/Notifications';
import Profile from 'containers/Profile';
import Home from 'containers/Home';
import Links from 'containers/Links';
import Videos from 'containers/Videos';
import VideosMain from 'containers/Videos/Main';
import VideoPage from 'containers/Videos/VideoPage';
import Management from 'containers/Management';
import AdminOnly from 'components/HigherOrder/AdminOnly';
import NotFound from 'components/NotFound';

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import * as reducers from 'redux/reducers';
import {routerReducer, routerMiddleware} from 'react-router-redux'
import ReduxThunk from 'redux-thunk';
import {getPlaylistsAsync} from 'redux/actions/PlaylistActions';
import {loadVideoPageAsync} from 'redux/actions/VideoActions';
import {initSessionAsync} from 'redux/actions/UserActions';
import {fetchFeedsAsync} from 'redux/actions/FeedActions';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';


let storeElements = [
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
]
let middlewares = [
  ReduxThunk
]

if (typeof window !== 'undefined') {
  storeElements.push(window.__INITIAL_STATE__);
  if (browserHistory) middlewares.push(routerMiddleware(browserHistory));
}

export const store = createStore(
  ...storeElements,
  compose(
    applyMiddleware(...middlewares)
  )
);

export const history = browserHistory ? syncHistoryWithStore(browserHistory, store) : null;

export const routes = (
  <Route
    name="app"
    component={App}
    path="/"
    onEnter={onAppEnter}
  >
    <IndexRoute component={Home}/>
    <Route path="/videos" component={Videos}>
      <IndexRoute component={VideosMain} />
      <Route
        path=":videoId"
        component={VideoPage}
        onEnter={onVideoPageEnter}
      />
    </Route>
    <Route path="/links" component={Links} />
    <Route path="/notifications" component={Notifications}/>
    <Route path="/profile" component={Profile}/>
    <Route path="/management" component={AdminOnly(Management)}/>

    <Route path="*" component={NotFound} status={404} />
  </Route>
)

function onVideoPageEnter(nextState) {
  const action = nextState.location.action;
  if (action === "POP") store.dispatch(loadVideoPageAsync(nextState.params.videoId));
}

function onAppEnter() {
  if (browserHistory) {
    store.dispatch(initSessionAsync())
    store.dispatch(fetchFeedsAsync())
  }
}
