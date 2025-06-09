import React, { Component, createRef } from 'react';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default class DialogEditor extends Component {
  constructor(props) {
    super(props);
    // console.log('dialog editor', props);
    let inputRef = createRef();
    this.state = this.createInitialState(props);

    this.handleChange = this.handleChange.bind(this);
  }

  createInitialState(props) {
    return {
      value: props.value,
    };
  }

  getValue() {
    return this.state.value;
  }

  afterGuiAttached() {
    console.log('dialgue editor after gui');
  }

  focusIn() {
    console.log('dialgue editor focus in');
    this.setState({
      open: true,
    });
    this.inputRef.focus();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    return (
      <div>
        <TextField
          style={{ width: 180, fontSize: 12 }}
          id={this.state.value}
          select
          variant={"standard"}
          value={this.state.value}
          name={this.state.value}
          onChange={(event) => this.handleChange(event)}
          // label={this.state.value}
          margin="normal"
        >
          {this.props.values.map(option => (
            <MenuItem key={option.value} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  }
}
