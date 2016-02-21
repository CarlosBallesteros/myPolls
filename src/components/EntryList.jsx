import React, { Component, PropTypes } from 'react';

export default class EntryList extends Component {

  constructor(props) {
    super(props);
  }

  handleAddButtonClick() {
    const { poll, addEntry } = this.props;
    const node = this.refs.title;
    const title =  node.value.trim();
    if (title.length > 0) {
      addEntry(poll.id, title);
    }
    node.value = '';
  }

  handleRemoveButtonClick(idPoll, idEntry) {
    this.props.removeEntry(idPoll, idEntry);
  }

  handleOnTitleKeyDown(event) {
    const ENTER_KEY = 13;
    if (event.keyCode === ENTER_KEY) {
      this.handleAddButtonClick();
    }
  }

  render() {
    const { poll } = this.props;
    const entries = poll.entries || {};

    return (
      <div className="panel-body">
          <h3>Entries</h3>
          <ul className="list-group">
            {
              Object.keys(entries).map( (id, index) =>
                <li style={{height: '55px'}} className="list-group-item" key={index}>{entries[id].title}
                  <button onClick={() => this.handleRemoveButtonClick(poll.id, id)} className="btn btn-warning pull-right">
                    <span className="glyphicon glyphicon-trash"/>
                  </button>
                </li> )
            }
         </ul>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Entry Title" ref="title" onKeyDown={e => this.handleOnTitleKeyDown(e)} />
            <span className="input-group-btn">
              <button className="btn btn-info" type="button" onClick={e => this.handleAddButtonClick(e)}>Add Entry</button>
            </span>
          </div>
      </div>
    );
  }
}

EntryList.propTypes = {
  poll: PropTypes.object.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired
};

EntryList.defaultProps = {
  entries: []
};
