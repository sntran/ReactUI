/**
 * @jsx React.DOM
 */
 "use strict";

var CommandLine = React.createClass({
  componentDidMount: function() {
    // Make the cursor blink.
    var cursor = this.refs.cursor.getDOMNode();
    this.blinkInterval = window.setInterval(function() {
      var currentBgColor = cursor.style.backgroundColor;
      cursor.style.backgroundColor = currentBgColor === "rgb(0, 0, 0)"? "rgb(187, 187, 187)" : "rgb(0, 0, 0)";
      cursor.style.color = currentBgColor === "rgb(0, 0, 0)"? "#aaa" : "#000";
    }.bind(this), 500);
  },
  componentWillUnmount: function() {
    window.clearInterval(this.blinkInterval);
  },
  render: function() {
    return (
      <div className="cmd">
        <span className="prompt">{this.props.prompt + " "}</span>
        <span>{this.props.input}</span>
        <span ref="cursor" className="cursor">&nbsp;</span>
      </div>
    )
  }
})

var Terminal = React.createClass({
  // API
  echo: function(string) {
    var lines = this.state.lines;
    lines.push(string);
    this.setState({
      lines: lines,
      pendingCommand: false // so that the command prompt shows.
    });
  },
  error: function(error) {
    this.echo(error);
  },
  // Defaults
  getInitialState: function() {
    return {
      history: [],
      lines: [],
      input: ""
    }
  },
  getDefaultProps: function() {
    return {
      history: true,
      prompt: ">", // string or function
      greetings: "JSX Terminal", // string or function,
      interpreter: function(command) {
        return command;
      } // function or string or object
    }
  },
  // Logic
  componentDidMount: function() {
    var props = this.props;
    if (typeof props.greetings === "function") {
      this.setState({pendingCommand: "greetings"});
      props.greetings(this);
    } else if (typeof props.greetings === "string") {
      var lines = this.state.lines;
      lines.push(props.greetings);
      this.setState({lines: lines});
    }
  },
  handleKeyDown: function(e) {
    var state = this.state, 
        input = state.input, 
        history = state.history;

    switch (e.which) {
      case 8: // backspace
        // Stop the browser from navigating back.
        e.preventDefault();
        // Remove the last character from input.
        var input = state.input;
        input = input.slice(0, -1);
        this.setState({input: input});
        return false;
      case 38: // Up arrow key
        if (!this.props.history) break;
        
        var existingCommandIdx = _.lastIndexOf(history, input);
        if (existingCommandIdx === -1) {
          // Is typing a command, since it is not in the history, so
          // we retrieve the last command and display it.
          input = history[history.length-1];
          this.setState({history: history, input: input});
        } else {
          // In the middle of moving up the history, so we just display
          // the previous one, or the same input if at the begining.
          input = history[existingCommandIdx-1] || input;
          this.setState({input: input});
        }
        break;
      case 40: // Down arrow key
        if (!this.props.history) break;

        var existingCommandIdx = _.lastIndexOf(history, input);
        if (existingCommandIdx !== -1) {
          // Is not typing a command.
          input = history[existingCommandIdx+1] || "";
          this.setState({input: input});
        }
        break;
    }
  },
  handleKeyPress: function(e) {
    var state = this.state, 
      history = state.history,
      lines = state.lines,
      input = state.input,
      interpreter = this.props.interpreter;

    switch (e.which) {
      case 13: // Enter
        history.push(input);
        lines.push(this.props.prompt + " " + input);
        this.setState({
          lines: lines, 
          history: history,
          pendingCommand: input,
          input: "" // Clear the input
        });

        // Delegate to the interpreter to handle the command.
        // The interpreter should call terminal.echo or terminal.error
        // so that the terminal is re-rendered.
        interpreter(input, this);
        break;
      default:
        input += String.fromCharCode(e.which);
        this.setState({input: input});
        break;
    }
  },
  // Render
  renderLine: function(line, idx) {
    return (
      <div key={"line-"+idx} style={{width: "100%"}}>
        {line}
      </div>
    )
  },
  render: function() {
    var props = this.props, state = this.state;
    var terminalStyles = {
      height: props.height
    }
    return (
      <div className="terminal" 
        onKeyPress={this.handleKeyPress}
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
        style={terminalStyles}>
        <div className="terminal-output">
          {state.lines.map(this.renderLine)}
        </div>
        {
          !state.pendingCommand? // Do not render the command prompt when waiting for output.
            CommandLine({
              prompt: props.prompt,
              history: state.history,
              style: {width: "100%"},
              input: state.input
          }) : false
        }
      </div>
    );
  }

});