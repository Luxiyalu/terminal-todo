import React, { Component } from 'react';
import DocumentEvents from 'react-document-events';
import classNames from 'classnames';
import './NewItem.css';

function removeCharAt(str, index) {
  const first = str.slice(0, index);
  const second = str.slice(index + 1);
  return first + second;
}
function insertCharAt(str, index, char) {
  const first = str.slice(0, index);
  const second = str.slice(index);
  return first + char + second;
}

class NewInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', caret: 0};
    this.handleCaret = this.handleCaret.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleCaret(pos) {
    var seekTo;
    const min = 0;
    const value = this.state.value;
    const max = value.length;

    if (typeof pos === 'undefined') { // seek to end
      seekTo = value.length;
      seekTo = Math.min(seekTo, max);
      seekTo = Math.max(seekTo, min);
      return this.setState({caret: seekTo});
    } else if (typeof pos === 'number') { // seek to number
      seekTo = pos;
      seekTo = Math.min(seekTo, max);
      seekTo = Math.max(seekTo, min);
      return this.setState({caret: seekTo});
    }

    if (typeof pos === 'string') { // '+1' or '-1'
      this.setState(function(prevState) {
        const distance = parseInt(pos, 10);
        seekTo = prevState.caret + distance;
        seekTo = Math.min(seekTo, max);
        seekTo = Math.max(seekTo, min);
        return {caret: seekTo};
      });
    }
  }
  handleSubmit(e) {
    const value = this.state.value.trim();
    if (value.length < 1) return;

    this.props.onChange(this.state.value); // trigger onChange of <NewInput /> with value of parameter within ()
    this.setState((prevState) => ({value: ''}));
    this.handleCaret();
  }
  handleKeyDown(e) { // can detect direction keys & upper case characters
    // https://en.wikipedia.org/wiki/List_of_Unicode_characters
    // console.log('keydown', e.keyCode)

    if (e.which === 37) { // left key
      this.handleCaret('-1');
    } else if (e.which === 39) { // right key
      this.handleCaret('+1');
    } else if (e.which === 8) { // backspace key
      this.setState((prevState) => ({
        value: removeCharAt(prevState.value, prevState.caret - 1)
      }));
      this.handleCaret('-1');
    } else if (e.which === 127) { // delete key
      this.setState((prevState) => ({
        value: removeCharAt(prevState.value, prevState.caret)
      }));
    } else if (e.which === 13) { // return
      this.handleSubmit();
    } else if (e.which === 27) { // esc
      this.setState({value: ''});
    }
  }
  handleKeyPress(e) { // can detect upper/lower cases
    if (e.keyCode < 32 || (e.keyCode > 126 && e.keyCode < 160)) return; // control keys
    // http://www.utf8-chartable.de/unicode-utf8-table.pl?utf8=dec

    const char = String.fromCharCode(e.keyCode);
    this.setState((prevState) => ({value: insertCharAt(prevState.value, prevState.caret, char)}));
    this.handleCaret('+1');
  }
  render() {
    const value = this.state.value;
    const caret = this.state.caret;
    const inputChars = (value+' ').split('').map(function(char, i) {
      const blank = (char === ' ');
      const caretClass = classNames({
        caret: i === caret,
        blank: blank
      });

      return <span className={caretClass} key={i}>{blank ? '*' : char}</span>;
    });

    return (
      <div className="new-input-container">
        <DocumentEvents onKeyPress={this.handleKeyPress} onKeyDown={this.handleKeyDown} />
        <p className="new-item-input-render single-line">$ {inputChars}</p>
      </div>
    )
  }
}

export default NewInput;