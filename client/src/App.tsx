import React, {useState} from "react"
import {createBrowserHistory} from "history"
import {Route, Router, Switch} from "react-router"
import Header from "./components/Header"
import PostsList from "./components/PostsList"
import AdminPanel from "./components/AdminPanel"
import About from "./components/About"
import PageNotFound from "./components/PageNotFound"
import Login from "./components/Login"
import {API} from "./API"
import Register from "./components/Register"
import "./styles/App.scss"
import Logout from "./components/Logout"

const history = createBrowserHistory()

export default function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)

    const onLogin = () => {
        history.replace("/")
        checkLoginStatus()
    }

    const onRegister = () => {
        history.replace("/register")
    }
    const checkLoginStatus = () => API.status().then(() => setLoggedIn(true)).catch(() => setLoggedIn(false))

    checkLoginStatus()

    return (
        <>
            <Router history={history}>
                <Header isLoggedIn={isLoggedIn}/>
                <div className={"content-wrapper"}>
                    <Switch>
                        <Route exact path={"/"} component={() => <PostsList/>}/>
                        <Route exact path={"/about"} component={() => <About/>}/>
                        <Route exact path={"/admin-panel"} component={() => <AdminPanel/>}/>
                        <Route exact path={"/login"} component={() => <Login onLogin={onLogin} onRegister={onRegister}/>}/>
                        <Route exact path={"/logout"} component={() => <Logout onLogin={onLogin}/>}/>
                        <Route exact path={"/register"} component={() => <Register onRegister={onLogin}/>}/>
                        <Route exact path={"*"} component={() => <PageNotFound/>}/>
                    </Switch>
                </div>
            </Router>
        </>
    )
}