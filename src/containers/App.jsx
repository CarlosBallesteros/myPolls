import React, { Component, PropTypes } from 'react';
import MenuContainer from './MenuContainer';
import ConfirmDialogContainer from './ConfirmDialogContainer';
import { connect } from 'react-redux';

import * as notificationActions from '../actions/notify';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { alert: false };
  }

  componentWillMount() {
    this.props.registerNotificationsListeners();
    this.props.registerUsersListener();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.alert !== this.props.alert && newProps.alert !== '') {
      this.setState({ alert: true });
      setTimeout(() => {
        this.setState({ alert: false });
        this.props.throwAlert('');
      }, 4000);
    }
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
        {
          this.state.alert ? (
            <div className="alert animated fadeInRight" style={{ marginTop: '1%', 'marginBottom': '1%', position: 'absolute', bottom: '0%', right: '50%', opacity: 0.8}}>
              <div className="alert alert-danger warning" role="alert">{ this.props.alert }</div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

App.propTypes = {
  // Injected by React RouterConfirmDialog
  alert: PropTypes.string,
  throwAlert: PropTypes.func,
  registerUsersListener: PropTypes.func,
  unregisterUsersListener: PropTypes.func,
  registerNotificationsListeners: PropTypes.func,
  unregisterNotificationsListeners: PropTypes.func,
  children: PropTypes.node,
  history: PropTypes.object.isRequired
};

export default connect(
  state => ({ auth: state.auth, alert: state.alert }),
  notificationActions
)(App);
