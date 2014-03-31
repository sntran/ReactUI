ReactUI
=======

React.js UI Components

## Terminal

Inspired by [jQueryTerminal](http://terminal.jcubic.pl/).

* User-defined interpreter.
* History support.

### Example

```jsx
<Terminal
  history={true}
  prompt="js>" 
  greetings="React.js Terminal" 
  interpreter={function(command, term) {
    term.echo(command);
  }} 
  width="100%"
  height="200"
  outputLimit={-1}/>
```

## Menu

An abstract component to represent a vertical or horizontal menu. Can be used as dropdown menu or tree view.

* Define structure as JSX syntax
* Vertical or horizontal
* Collapsible

```jsx
<Menu height={30} symmetry="horizontal" collapsible={true}>
  <Menu title="File">
    <a>New</a>
    <a>Open</a>
    <Menu title="Save With Encoding >">
      <a>UTF-8</a>
      <a>UTF-16</a>
    </Menu>
  </Menu>
  <Menu title="Edit">
    <a>Undo</a>
    <a>Redo</a>
  </Menu>
</Menu>
```
