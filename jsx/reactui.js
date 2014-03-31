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
        <Terminal ref="terminal" 
                  interpreter={this.javascriptInterpreter} 
                  greetings={function(term) { 
                    setTimeout(function() {
                      term.echo("Javascript Interpreter");
                    }, 1000);
                  }} 
                  prompt="js>" 
                  height="200"
                  outputLimit={10}/>

        <h2>Menu</h2>
        <Menu height={30} symmetry="horizontal" collapsible={true}>
          <Menu title="File">
            <a>New</a>
            <a>Open...</a>
          </Menu>
          <Menu title="Edit">
            <a>Undo</a>
            <a>Redo</a>
          </Menu>
        </Menu>

        <h2>Filetree (using Menu component)</h2>
        <Menu height={30} symmetry="vertical" collapsible={true}>
          <Menu title="My Computer">
            <Menu title="C:\">
              <Menu title="Program Files">
                <Menu title="Common">
                  <a>Common File 1</a>
                  <a>Common File 2</a>
                </Menu>
                <a>App 1.exe</a>
                <a>App 2.exe</a>
              </Menu>
              <Menu title="Windows">
                <Menu title="System32">
                  <a>System File 1</a>
                  <a>System File 2</a>
                </Menu>
                <a>Window File</a>
              </Menu>
            </Menu>
            <Menu title="D:\">
              <a>File 1.txt</a>
              <a>File 2.bat</a>
            </Menu>
          </Menu>
        </Menu>
      </div>
    );
  }

});

React.renderComponent(
  <ReactUI />, 
  document.getElementById("main")
);