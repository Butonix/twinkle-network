import React from 'react';
import PropTypes from 'prop-types';
import Home from './Home';
import Posts from './Posts';
import { Switch, Route } from 'react-router-dom';

Routes.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string.isRequired
};

export default function Routes({
  history,
  location,
  match,
  profile,
  selectedTheme
}) {
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}`}
        render={() => <Home profile={profile} selectedTheme={selectedTheme} />}
      />
      <Route
        path={`${match.path}/:section`}
        render={({ match }) => {
          return (
            <Posts
              history={history}
              match={match}
              username={profile.username}
              location={location}
            />
          );
        }}
      />
    </Switch>
  );
}
