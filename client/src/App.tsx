import React, {useState} from "react"
import {createBrowserHistory} from "history"
import {Route, Router, Switch} from "react-router"
import Header from "./components/Header"
import PostsList from "./components/PostsList"
import AdminPanel from "./components/AdminPanel"
import About from "./components/About"
import PageNotFound from "./components/PageNotFound"
import Login from "./components/Login"
import "./styles/App.scss"
import {Api} from "./API"

const history = createBrowserHistory()

export default function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)

    const onLogin = () => {
        history.replace("/")
        checkLoginStatus()
    }

    const checkLoginStatus = () => Api.status().then(() => setLoggedIn(true)).catch(() => setLoggedIn(false))

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
                        <Route exact path={"/login"} component={() => <Login onLogin={onLogin}/>}/>
                        <Route exact path={"*"} component={() => <PageNotFound/>}/>
                    </Switch>
                </div>
            </Router>
        </>
    )
}