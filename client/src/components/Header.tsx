import {Component} from "react";
import {Link} from "react-router-dom"
import logoImg from "../assets/images/logo.png"
import fbLogoImg from "../assets/images/fb-logo.png"
import igLogoImg from "../assets/images/ig-logo.png"
import "../styles/Header.scss"


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
            <div className={"header-left"}>
                <div className={"nav-brand"}>
                    <img src={logoImg}/>
                    <span className={"name"}>Company name</span>
                </div>
                <hr/>
                <div className={"navbar"}>
                    <Link to={"/"}>Home</Link>
                    <Link to={"/about"}>About</Link>
                    {isLoggedIn ?
                        <Link to={"/admin-panel"}>Admin panel</Link> :
                        <Link to={"/login"}>Login</Link>
                    }
                </div>
                <div className={"media-links"}>
                    <a href={"https://facebook.com"}><img src={fbLogoImg}/></a>
                    <a href={"https://instagram.com"}><img src={igLogoImg}/></a>
                </div>
            </div>
        )
    }
}