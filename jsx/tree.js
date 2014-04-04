/** @jsx React.DOM */

var Tree = React.createClass({
  getDefaultProps: function() {
    return {
      data: []
    }
  },
  getInitialState: function() {
    return {
      openNodes: this.props.data.map(function (node) {
        return node.state && node.state.opened;
      })
    }
  },
  toggleNode: function(idx) {
    var openNodes = this.state.openNodes;
    openNodes[idx] = !openNodes[idx];
    this.setState({
      openNodes: openNodes
    });
  },
  renderNode: function(nodeOrChild, idx) {
    var state = this.state;
    // If the node has `props`, it's a React.js component, so we use its `props`.
    var node = nodeOrChild.props || nodeOrChild;
    if (typeof node === "string") {
      // Only happens when using `data` prop with single string.
      node = {
        text: node
      }
    }

    var isOpen = state.openNodes[idx];
    var statusIcon = (isOpen === false)? "icon-right-dir" : (isOpen? "icon-down-dir" : "");
    var icon = node.icon;
    if (icon !== false) {
      // When specified `false`, it won't render anyway, so we either
      // render what string is specified as class, or use the default icons.
      icon = <i className={"icon icon-" + (icon || node.children? "folder" : "doc")}/>;
    }

    var childrenStyle = {};
    if (node.children && !isOpen) {
      childrenStyle.display = "none";
    }
    return (
      <li key={node.id || idx} className="tree-node">
        <i className={"icon " + statusIcon} onClick={this.toggleNode.bind(this, idx)}></i>
        <a href="#">
          {icon}
          {node.text}
        </a>
        {node.children? <Tree style={childrenStyle} data={node.children}></Tree> : false}
      </li>
    );
  },
  render: function() {
    var props = this.props;
    var style = this.props.style || {};
    style.listStyleType = "none";
    style.listStyleImage = "none";

    return (
      <ul style={style} className="tree">
        {props.data.map(this.renderNode)}
        {React.Children.map(props.children, this.renderNode)}
      </ul>
    );
  }
});