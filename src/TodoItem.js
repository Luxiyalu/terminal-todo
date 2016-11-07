import React, { Component } from 'react';
import classNames from 'classnames';
import './TodoItem.css';

class NewItem extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
  }
  toggleComplete(e) {
    this.props.onChange(this.props.id, 'completed');
  }
  handleDelete(e) {
    this.props.onChange(this.props.id);
  }
  render() {
    const completeTime = this.props.completed;
    function TagComplete() {
      if (!completeTime) return null;
      return <span> @done({completeTime.toLocaleDateString()})</span>
    }

    return (
      <li className={classNames('todo-item', {'completed': this.props.completed})}>
        <span className="button-toggle-complete" onClick={this.toggleComplete}>[<span className="cursor-pointer no-select">complete</span>]</span>
        <span className="button-delete" onClick={this.handleDelete}>[<span className="cursor-pointer no-select">delete</span>]</span>
        <span> - </span>
        <p>{this.props.content}<TagComplete /></p>
      </li>
    );
  }
}

export default NewItem;