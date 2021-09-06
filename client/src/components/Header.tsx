import {Component} from "react";
import {Link} from "react-router-dom"
import {Navbar, Nav} from "react-bootstrap";

type MyProps = {}
type MyState = {
    navVisible: boolean
}

class Header extends Component<MyProps, MyState> {
    constructor(props: MyProps) {
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
        return (
            <Navbar>
                <Navbar.Brand>Logo</Navbar.Brand>
                <Nav className={"mr-auto"}>
                    <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                    <Nav.Link as={Link} to={"/about"}>About</Nav.Link>
                    <Nav.Link as={Link} to={"/admin-panel"}>Admin panel</Nav.Link>
                </Nav>
            </Navbar>
        )
    }
}
export default Header;