import React, { Component, PropTypes } from 'react';
import { Modal, ModalClose } from 'react-modal-bootstrap';

export default class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: true, register: false };
  }

  handleCancelClick() {
    this.setState({ isOpen: false });
    this.props.cancelSignIn();
  }

  handleSignIn(user) {
    this.props.authenticate(user);
  }

  handleChange() {
    this.setState({ register: !this.state.register });
  }

  handleRegister() {
    const username = this.refs.user.value;
    const password = this.refs.pass.value;
    this.props.createUser(username, password);
  }

  handleLogin() {
    const username = this.refs.user.value;
    const password = this.refs.pass.value;
    this.props.authenticateWithPassword(username, password);
  }

  render() {
    const { isOpen } = this.state;
    const { users } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestHide={() => this.handleCancelClick()} backdrop keyboard>
        <div className="modal-header">
          <ModalClose onClick={() => this.handleCancelClick()}/>
          <h4 className="modal-title">Sign in</h4>
        </div>
        <div className="modal-body">
        <h5>Sign in with a preset account</h5>
        <div>
          { users.map( user => <button key={ user } className="btn" type="button" onClick={ () => this.handleSignIn(user)}>{ user }</button> ) }
        </div>
        <hr/>
        <div>
          <label htmlFor="user">Username</label>
          <input type="text" id="user" ref="user" placeholder="Username"/>
          <span> </span>
          <label htmlFor="pass">Password</label>
          <input type="password" id="pass" ref="pass" placeholder="Password"/>
        </div>
        <br/>
        <div>
          <button type="button" className="btn" onClick={() => this.state.register ? this.handleRegister() : this.handleLogin()}>{this.state.register ? 'Register' : 'Login'}</button>
          <span> </span>
          <a onClick={() => this.handleChange()}>{this.state.register ? 'Already have an account?' : 'Create an account'}</a>
        </div>
        </div>
      </Modal>
    );
  }

}

SignIn.propTypes = {
  authenticateWithPassword: PropTypes.func,
  createUser: PropTypes.func,
  users: PropTypes.array,
  cancelSignIn: PropTypes.func.isRequired,
  authenticate: PropTypes.func.isRequired
};
