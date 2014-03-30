/**
 * @jsx React.DOM
 */
var ReactUI = React.createClass({
  javascriptInterpreter: function(command, term) {
    if (command !== '') {
      try {
        var result = window.eval(command);
        term.echo(new String(result));
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
                  greetings={function(term) { 
                    setTimeout(function() {
                      term.echo("Javascript Interpreter");
                    }, 1000);
                  }} 
                  prompt="js>" 
                  height="200"
                  outputLimit={5}/>
      </div>
    );
  }

});

React.renderComponent(
  <ReactUI />, 
  document.getElementById("main")
);