/** @jsx React.DOM */
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
            expanded: !(this.props.collapsible)
        }
    },
    handleClick: function(idx, e) {
        if (this.props.collapsible) {
            e.preventDefault();
            this.setState({
                expanded: this.state.expanded === idx? false : idx
            });
        }
    },
    renderItem: function(child, idx) {
        var state = this.state;
        var style = {
            float: this.props.symmetry == "horizontal"? "left": "none"
        };
        var expanded = state.expanded === true || state.expanded === idx;
        var children = (!child.props.children? false :
                        <div className="menu-items-container"
                             style={{display: expanded? "block": "none"}}
                        >{child}</div>);
        // When this child is clicked, and the menu is collapsible, hide the child's children.
        return (
            <li key={child.props.key} style={style}>
                <a href="#" onClick={this.handleClick.bind(this, idx)}>{child.props.title}</a>
                {children}
            </li>
        );
    },
    render: function() {
        var props = this.props;
        var style = {
            listStylePosition: "inside",
            listStyleType: "none"
        }
        return (
            <ul className={"menu "+props.symmetry} rel={props.key} style={style}>
                {React.Children.map(props.children, this.renderItem)}
                <li style={{clear: "both"}} />
            </ul>
        )
    }
})