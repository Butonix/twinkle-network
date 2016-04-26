import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { initSession } from 'actions/UserActions';
import { getAllPlaylists } from 'actions/PlaylistActions';


export default class App extends React.Component {
  static needs = [
    initSession,
    getAllPlaylists
  ];

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  render() {
    return (
      <div id="main-view">
        <Header />
        {this.props.children}
        <footer
          className="footer col-md-12"
          style={{
            marginTop: '1em'
          }}
        >
          <p className="text-muted text-center">Twinkle © 2016</p>
        </footer>
      </div>
    );
  }
}
