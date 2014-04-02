/** @jsx React.DOM */
"use strict";
var Window = React.createClass({
  properties: {
    "titleBarHeight": 30
  },
  getDefaultProps: function() {
    var props = this.props,
      titleBarHeight = this.properties.titleBarHeight;
    return {
      title: (
        <p>
          <button key="minimize-button"
              x={props.width-titleBarHeight*2}
              y="0"
              width={titleBarHeight}
              height={titleBarHeight}
              sprite="grey"
              onClick={this.props.onMinimize}
          >V</button>
          <button key="close-button" type="button"
              x={props.width-titleBarHeight}
              y="0"
              width={titleBarHeight}
              height={titleBarHeight}
              sprite="grey"
              onClick={this.props.onClose}
          >X</button>
        </p>
      )
    }
  },
  render: function() {
    var props = this.props,
      titleBarHeight = this.properties.titleBarHeight;

    return (
      <div key={"window-"+props.title} className="window"
        style={{
          position: "relative", 
          width: props.width || "100%", 
          height: props.height || "100%", 
          border: '1px solid black'
        }}
      >
        <div key="title-bar" className="window-title"
          style={{width: "100%", height: titleBarHeight}}
        >{props.title}</div>

        <div key="window-content"
            x="0"
            y={titleBarHeight}
            width="100%"
            height={props.height-titleBarHeight+"px"}
        >
          {props.children}
        </div>
      </div>
    );
  }
});

