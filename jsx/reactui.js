/**
 * @jsx React.DOM
 */
var ReactUI = React.createClass({
  javascriptInterpreter: function(command, term) {
    if (command !== '') {
      try {
        var result = window.eval(command);
        if (result !== undefined) {
          term.echo(new String(result));
        }
      } catch(e) {
        term.error(new String(e));
      }
    } else {
      term.echo('');
    }
  },
  render: function() {
    return (
      <div>
        <h2>Terminal</h2>
        <Terminal interpreter={this.javascriptInterpreter} 
                  greetings="Javascript Interpreter" 
                  prompt="js>" 
                  height="200"/>
      </div>
    );
  }

});

React.renderComponent(
  <ReactUI />, 
  document.getElementById("main")
);