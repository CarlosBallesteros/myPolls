import React, { Component, PropTypes } from 'react';
import MenuContainer from './MenuContainer';
import ConfirmDialogContainer from './ConfirmDialogContainer';
import { connect } from 'react-redux';

import * as notificationActions from '../actions/notify';

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.registerNotificationsListeners();
    this.props.registerUsersListener();
  }

  componentWillUnmount() {
    this.props.unregisterNotificationsListeners();
    this.props.unregisterUsersListener();
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <div className="row">
          <MenuContainer />
          <div>
            <ConfirmDialogContainer/>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

App.propTypes = {
  // Injected by React RouterConfirmDialog
  registerUsersListener: PropTypes.func,
  unregisterUsersListener: PropTypes.func,
  registerNotificationsListeners: PropTypes.func,
  unregisterNotificationsListeners: PropTypes.func,
  children: PropTypes.node,
  history: PropTypes.object.isRequired
};

export default connect(
  state => ({ auth: state.auth }),
  notificationActions
)(App);
