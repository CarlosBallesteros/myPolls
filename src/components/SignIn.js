import React, { Component, PropTypes } from 'react';
import { Modal, ModalClose } from 'react-modal-bootstrap';

export default class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: true };
  }

  handleCancelClick() {
    this.setState({ isOpen: false });
    this.props.cancelSignIn();
  }

  handleSignIn(user) {
    this.props.authenticate(user);
  }

  render() {
    const { isOpen } = this.state;
    const { users } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestHide={() => this.handleCancelClick()} backdrop keyboard>
        <div className="modal-header">
          <ModalClose onClick={() => this.handleCancelClick()}/>
          <h4 className="modal-title">Sign in Dialog</h4>
        </div>
        <div className="modal-body">
          { users.map( user => <button key={ user } className="btn" type="button" onClick={ () => this.handleSignIn(user)}>{ user }</button> ) }
        </div>
      </Modal>
    );
  }

}

SignIn.propTypes = {
  users: PropTypes.array,
  cancelSignIn: PropTypes.func.isRequired,
  authenticate: PropTypes.func.isRequired
};
