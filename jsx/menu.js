/** @jsx React.DOM */
"use strict";
var Menu = React.createClass({
    getDefaultProps: function() {
        return {
            symmetry: "vertical",
            width: "100%",
            height: "1em"
        }
    },
    getInitialState: function() {
        return {
            collapsed: this.props.collapsible === true
        }
    },
    handleClick: function(e) {
        if (this.props.collapsible) {
            e.preventDefault();
            this.setState({
                collapsed: !this.state.collapsed
            });
        }
    },
    renderItem: function(child, idx) {
        var state = this.state;
        var style = {
            float: this.props.symmetry == "horizontal"? "left": "none"
        };
        return (
            <li key={child.props.key} style={style}>
                {child}
            </li>
        );
    },
    render: function() {
        var props = this.props, state = this.state;
        var style = {
            listStylePosition: "inside",
            listStyleType: "none"
        }
        if (state.collapsed) {style.display = "none";}
        var className = state.collapsed? "collapsed" : "expanded";
        
        return (
            <div>
                <a href="#" onClick={this.handleClick} className={className}>{props.title}</a>
                <ul className={"menu "+props.symmetry} rel={props.key} style={style}>
                    {React.Children.map(props.children, this.renderItem)}
                </ul>
                <div style={{clear: "both"}} />
            </div>
        )
    }
})