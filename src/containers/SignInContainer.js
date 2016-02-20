import { connect } from 'react-redux';
import SignIn from '../components/SignIn';
import * as authActions from '../actions/auth';

export default connect(
  state => ({ auth: state.auth, users: state.users }),
  authActions
)(SignIn);
