/**
 * @jsx React.DOM
 */
 "use strict";

/**
   * Command prompt component, used by Terminal.
   * @constructor
   *
   * Display an input for command with a blinking cursor.
   *
   * @prop {string} prompt - The prompt indicator.
   * @prop {string} input - The text to display
   */
var CommandPrompt = React.createClass({
  getDefaultProps: function() {
    return {
      prompt: ">",
      input: ""
    }
  },
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

/**
   * Terminal component
   * @constructor
   *
   * Emulates a terminal shell with user-defined interpreter and history
   * support. Inspired by (jQueryTerminal)[http://terminal.jcubic.pl/].
   *
   * @prop {bool} history - Whether to keep a history for user to navigate.
   *  @default true
   * @prop {string} prompt - The prompt indicator.
   *  @default ">"
   * @prop {string|function} greetings - The first message to display in
   *  the terminal. If a string, displays it immediately. If a function,
   *  it is called with the component as the first argument, and the
   *  component will render if `terminal.echo` is called.
   *  @default "React.js Terminal"
   * @prop {function} interpreter - The interpreter to handle each entered
   *  command. It receives the command as first argument, and the terminal
   *  as second argument. Use `terminal.echo` or `terminal.error` to render
   *  the output of the command.
   *  @default function(command, term) { term.echo(command); }
   * @prop {number} outputLimit - The number of lines to display on the
   *  terminal. If -1, it will display all lines.
   *  @default -1
   */
var Terminal = React.createClass({
  // API
  echo: function(string) {
    var lines = this.state.lines;
    lines.push(string);

    // Trim the output lines if `outputLimit` is set.
    var outputLimit = this.props.outputLimit;
    if (outputLimit > 0 && lines.length > outputLimit) {
      // @TODO: Support '0' value to display lines that fit in one page.
      lines = lines.slice(-1*outputLimit);
    }

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
    var props = this.props, interpreter = props.interpreter;
    // Store the list of commands if interpreter is an object.
    var commands = [];
    if (typeof interpreter === "object") {
      commands = _.keys(interpreter);
    }

    return {
      history: true,
      prompt: ">", // string or function
      greetings: "React.js Terminal", // string or function,
      interpreter: function(command, term) {
        term.echo(command);
      }, // function or string or object
      completion: function(term, string, callback) {
        callback(_.filter(commands, function(command) {
          return command.indexOf(string) === 0;
        }));
      },
      outputLimit: -1 // number
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
  componentDidUpdate: function() {
    // Scroll to the bottom.
    var el = this.getDOMNode();
    el.scrollTop = el.scrollHeight;
  },
  handleKeyDown: function(e) {
    var props = this.props,
        state = this.state, 
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
      case 9: // tab
        e.preventDefault();
        props.completion(this, input, function(commands) {
          this.echo(commands.join(", "));
        }.bind(this));
        break;
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
      width: props.width || "100%",
      height: props.height,
      overflow: "auto"
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
        {state.pendingCommand? false :
          <CommandPrompt
              prompt={props.prompt}
              history={state.history}
              input={state.input}
              style={{width: "100%"}} />}
      </div>
    );
  }

});