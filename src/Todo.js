import React, { Component } from 'react';
import TodoItem from './TodoItem';
import NewItem from './NewItem';
import './Todo.css';

function store(key, value) {
  if (value) return localStorage.setItem(key, JSON.stringify(value));
  const data = localStorage.getItem(key);
  return (data && JSON.parse(data)) || null;
}
const time = (new Date()).toString();
const createItem = (function() {
  let key = parseInt(store('itemkey'), 10) || 0;

  return function(content) {
    ++key;
    store('itemkey', key);

    return {
      _id: 'todoitem_' + key,
      content: content,
      completed: false
    }
  }
})();

function LastLogin() {
  return <div className="last-login">Login time: {time}</div>;
}

class Todo extends Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleNewInput = this.handleNewInput.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);

    this.state = {
      list: (store('todolist') || []),
      state: (store('liststate') || 'all')
    };
  }
  handleUpdate(id, stateName) {
    if (stateName === undefined) { // if stateName is not passed, item to be deleted
      const list = this.state.list.filter(function(e, i, a) {
        return e._id !== id;
      });

      this.setState({list: list});

    } else { // id of item, stateName to be toggled
      const list = this.state.list.map(function(e, i, a) {
        if (e._id === id) {
          e[stateName] = (e[stateName] ? false : new Date());
        }
        return e;
      });

      this.setState({list: list});
    }
  }
  handleNewInput(value) {
    // if it's on "complete items" state, switch to "all"
    // otherwise won't see a difference

    this.setState((prevState, props) => {
      return {
        state: (prevState.state === 'completed' ? 'all' : prevState.state),
        list: prevState.list.concat(createItem(value))
      };
    });
  }
  handleStateChange(value) {
    this.setState({state: value});
  }
  clearCompleted() {
    this.setState((prevState, props) => {
      return {list: prevState.list.filter(function(e) {
        return !e.completed;
      })};
    });
  }
  render() {
    const list = this.state.list;
    const state = this.state.state;
    const handleUpdate = this.handleUpdate;
    const numLeft = list.filter(function(e) {return !e.completed;}).length;
    const todoItems = list.map(function (item, index) {
      if ((state === 'active' && item.completed) || (state === 'completed' && !item.completed)) return null;
      const completed = item.completed && new Date(item.completed);
      
      return <TodoItem
                key={item._id}
                id={item._id}
                content={item.content} 
                completed={completed}
                onChange={handleUpdate} />;
    });
    store('todolist', list);
    store('liststate', state);

    return (
      <div className="Todo">
        <div className="list-container">
          <LastLogin />
          <ul className="todo-list">{todoItems}</ul>
        </div>

        <div className="bottom-container">
          <div className="controlls-container single-line">
            <p className="items-left">[{numLeft} ITEMS LEFT]</p>
            <p className={"state-switch state-" + state}>
              [<span className="cursor-pointer no-select state state-all" onClick={() => this.handleStateChange('all')}>ALL</span><span>|</span>
              <span className="cursor-pointer no-select state state-active" onClick={() => this.handleStateChange('active')}>ACTIVE</span><span>|</span>
              <span className="cursor-pointer no-select state state-completed" onClick={() => this.handleStateChange('completed')}>COMPLETED</span> ITEMS]
            </p>

            <p className="clear-completed">
              [<span className="cursor-pointer no-select" onClick={this.clearCompleted}>CLEAR COMPLETED</span>]
            </p>
          </div>
          
          <NewItem onChange={this.handleNewInput} />
        </div>
      </div>
    );
  }
}

export default Todo;
