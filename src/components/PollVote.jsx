import React, { Component, PropTypes } from 'react';
import Spinner from './Spinner';

const progressContex = [
  'progress-bar-success',
  'progress-bar-info',
  'progress-bar-warning',
  'progress-bar-danger'
];

export default class PollVote extends Component {

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentWillMount() {
    this.props.registerListeners(this.props.params);
  }

  componentWillReceiveProps() {
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.props.unregisterListeners(this.props.params);
  }

  handleVoteClick(idPoll, idEntry) {
    this.props.voteEntry(idPoll, idEntry);
  }

  handleSetVotes(idPoll, idEntry) {
    const votes = this.refs[idEntry].value;
    this.props.superVoteEntry(idPoll, idEntry, votes);
  }

  totalVotes(entries) {
    return Object.keys(entries).reduce( (total, id) => total + entries[id].votes, 0 );
  }

  createProgressBar(entry, totalVotes, index) {
    return (
      <div className="progress">
        <div className={ `progress-bar ${ progressContex[index % progressContex.length] } progress-bar-striped` } role="progressbar" style={{'width': entry.votes * 100 / (totalVotes || Infinity) + '%'}}>
          { entry.votes || 0 }
        </div>
      </div>
    );
  }

  handleCloseClick() {
    this.props.closePoll(this.props.poll.id);
  }

  handleHideClick() {
    this.props.hidePoll(this.props.poll.id);
  }

  render() {
    const { poll, auth } = this.props;
    const votedArray = poll.voted ? Object.values(poll.voted) : [];
    const alreadyVoted = votedArray.filter( value => value === auth.id ).length !== 0;
    const message = !auth.authenticated
      ? 'You need to sign in to vote....'
      : auth.id === this.props.owner
        ? 'This is your poll, do what you will'
        : poll.isClosed === true
          ? 'Poll closed, no more votes accepted'
          : alreadyVoted
            ? 'You have voted'
            : 'Vote now!';
    const entries = poll.entries || {};
    const total = this.totalVotes(entries);
    const contents = this.state.loading ? <Spinner /> : <div>
        <div className="panel-heading">
            <h4>
              <div>
                Poll: { poll.title }
              </div>
            </h4>
            <h4>
              <div>
                Owned by: { auth.id === this.props.owner ? 'You!' : this.props.owner }
              </div>
            </h4>
            <h5>
              <div>
                { message }
              </div>
                { auth.id === this.props.owner ? (
                <div>
                  <button className="btn btn-danger pull-left" type="button" onClick={() => this.handleCloseClick()}>{poll.isClosed ? 'Open' : 'Close'}</button>
                  <button style={{'marginLeft': '10px'}} className="btn btn-default pull-left" type="button" onClick={() => this.handleHideClick()}>{poll.isHidden ? 'Show' : 'Hide'}</button>
                </div>
                ) : null }
            </h5>
             </div>
            <div className="panel-body">
              <h4>Entries</h4>
              <ul className="list-group">
                {
                  Object.keys(entries).sort( (a, b) => entries[b].votes - entries[a].votes).map( (id, index) => {
                    return (<li className="list-group-item" key={index}>
                      { entries[id].title }
                      { auth.id === this.props.owner
                          ? (
                            <div>
                              <label htmlFor={`vote${id}`}>Votes: </label>
                              <input type="number" ref={id} id={`vote${id}`} placeholder={entries[id].votes} />
                              <button type="button" onClick={ () => this.handleSetVotes(poll.id, id) }>Change</button>
                            </div>
                          ) : message === 'Vote now!' ? <span onClick={ () => this.handleVoteClick(poll.id, id) } className="action-element glyphicon glyphicon-arrow-up"/> : null }
                      <br/>
                      { this.createProgressBar(entries[id], total, index) }
                    </li>);
                  })
                }
             </ul>
        </div>
      </div>;
    return (
      <div className="panel panel-default">
        { contents }
      </div>
    );
  }
}

PollVote.propTypes = {
  auth: PropTypes.object,
  owner: PropTypes.string,
  poll: PropTypes.object.isRequired,
  closePoll: PropTypes.func,
  hidePoll: PropTypes.func,
  voteEntry: PropTypes.func.isRequired,
  superVoteEntry: PropTypes.func,
  params: PropTypes.object.isRequired,
  registerListeners: PropTypes.func.isRequired,
  unregisterListeners: PropTypes.func.isRequired,
  registerOwnerListeners: PropTypes.func,
  unregisterOwnerListeners: PropTypes.func
 };
