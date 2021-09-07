import {Component} from "react";
import {Link} from "react-router-dom"
import {Navbar, Nav} from "react-bootstrap";

interface IProps {
    isLoggedIn: boolean
}

interface IState {
    navVisible: boolean
}

export default class Header extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            navVisible: false
        }
    }

    onMenuButton = () => {
        const current = this.state.navVisible
        this.setState({navVisible: !current})
    }

    render() {
        const {isLoggedIn} = this.props
        return (
            <Navbar>
                <Navbar.Brand>Logo</Navbar.Brand>
                <Nav className={"mr-auto"}>
                    <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                    <Nav.Link as={Link} to={"/about"}>About</Nav.Link>
                    {isLoggedIn ?
                        <Nav.Link as={Link} to={"/admin-panel"}>Admin panel</Nav.Link> :
                        <Nav.Link as={Link} to={"/login"}>Login</Nav.Link>
                    }
                </Nav>
            </Navbar>
        )
    }
}