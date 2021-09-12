import {Component,forwardRef} from "react";
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

    component = forwardRef<HTMLAnchorElement>((props, ref) => 
        <a ref={ref} {...props}>{props.children}</a>
    );

    

    render() {
        const {isLoggedIn} = this.props
        return (
            <div className={"header-left"}>
                <div className={"nav-brand"}>
                    <img src={logoImg} alt={"brand logo"}/>
                    {/*<span className={"name"}>Company name</span>*/}
                </div>
                <hr/>
                <div className={"navbar"}>
                    <Link to={"/"} component={this.component}>Home</Link>
                    <Link to={"/about"} component={this.component}>About</Link>
                    {isLoggedIn ?
                        <Link to={"/admin-panel"} component={this.component}>Admin panel</Link> :
                        <Link to={"/login"} component={this.component}>Login</Link>
                    }
                </div>
                <hr/>

                <div className={"media-wrapper"}>
                    <span>Find us on:</span>
                    <div className={"media-links"}>
                        <a href={"https://facebook.com"}><img src={fbLogoImg} alt={"Facebook logo"}/></a>
                        <a href={"https://instagram.com"}><img src={igLogoImg} alt={"Instagram logo"}/></a>
                    </div>
                </div>
            </div>
        )
    }
}