import React from 'react';
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import LoginButton from './log_in_button';

export default class Example extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogIn = this.handleLogIn.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            isLoggedIn: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    handleLogIn() {
        console.log("clicked");
        this.setState({
            isLoggedIn: !this.state.isLoggedIn
        })
    }

    render() {
        return (
            <div id="myNavBar">
                <Navbar fixed="top" color="faded" light toggleable>
                    <NavbarToggler right onClick={this.toggle}/>
                    <NavbarBrand href="/">goat</NavbarBrand>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/game">game</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink id="loginButton"
                                         onClick={this.handleLogIn}>{this.state.isLoggedIn ? "log out" : "log in"}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/">about</NavLink>
                            </NavItem>

                        </Nav>
                    </Collapse>
                </Navbar>
            </div>


        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    };
}