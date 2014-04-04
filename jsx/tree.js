/** @jsx React.DOM */

var Tree = React.createClass({
  getDefaultProps: function() {
    return {
      data: []
    }
  },
  renderNode: function(nodeOrChild, idx) {
    // If the node has `props`, it's a React.js component, so we use its `props`.
    var node = nodeOrChild.props || nodeOrChild;
    if (typeof node === "string") {
      // Only happens when using `data` prop with single string.
      node = {
        text: node
      }
    }
    var statusIcon = node.state? (node.state.opened? "icon-down-dir" : "icon-right-dir") : "";

    var icon = node.icon;
    if (icon !== false) {
      // When specified `false`, it won't render anyway, so we either
      // render what string is specified as class, or use the default icons.
      icon = <i className={"icon-" + (icon || node.children? "folder" : "doc")}/>;
    }

    return (
      <li key={node.id}>
        <i className={statusIcon}></i>
        <a href="#">
          {icon}
          {node.text}
        </a>
        {node.children? <Tree data={node.children}></Tree> : false}
      </li>
    );
  },
  renderChild: function(child, idx) {
    console.log(child);

    return false;
  },
  render: function() {
    var props = this.props;
    var style = {
      listStyleType: "none",
      listStyleImage: "none"
    }
    return (
      <ul style={style}>
        {props.data.map(this.renderNode)}
        {React.Children.map(props.children, this.renderNode)}
      </ul>
    );
  }
});