/**
 * @jsx React.DOM
 */
"use strict";
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
      <Window width="100%" height="100%" title={
        <Menu height={30} symmetry="horizontal">
          <img src={"http://placehold.it/32x32&text=Logo"}/>
          <Menu title="File" collapsible={true}>
            <a>New</a>
            <a>Save</a>
            <hr />
            <a>Close</a>
          </Menu>
          <Menu title="Edit" collapsible={true}>
            <a>Undo</a>
            <a>Redo</a>
          </Menu>
        </Menu>
      }>
        <Window width="240" height="480" title={
          <p>
            <span>File tree</span>
            <button><i className="icon-home"></i></button>
            <button><i className="icon-arrows-cw"></i></button>
          </p>
        }>
          <Menu height={30} symmetry="vertical">
            <Menu title="My Computer" collapsible={true}>
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
        </Window>

        <Window width="640" height="480" title={
          <p>
            <span>README.MD</span><button><i className="icon-cancel"></i></button>
            <button><i className="icon-resize-full-alt"></i></button>
          </p>
        }>

        </Window>

        <Window title="Console">
          <Terminal ref="jsterminal" 
                    interpreter={this.javascriptInterpreter} 
                    greetings={function(term) { 
                      setTimeout(function() {
                        term.echo("Javascript Interpreter");
                      }, 1000);
                    }} 
                    prompt="js>" 
                    height="200"
                    outputLimit={10}/>

          <Terminal ref="terminal" 
                    interpreter={{
                      echo: function(arg1) {
                        this.echo(arg1);
                      },
                      add: function(a, b) {
                        this.echo(a+b);
                      }
                    }} 
                    greetings="Custom Interpreter"
                    height="200"
                    outputLimit={10}/>
        </Window>
      </Window>
    );
  }

});

React.renderComponent(
  <ReactUI />, 
  document.getElementById("main")
);