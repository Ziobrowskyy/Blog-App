import React, {useState} from "react";
import {createBrowserHistory} from "history"
import {Route, Router, Switch} from "react-router";
import Header from "./components/Header";
import PostsList from "./components/PostsList"
import AdminPanel from "./components/AdminPanel";
import About from "./components/About";
import PageNotFound from "./components/PageNotFound";
import Login from "./components/Login";
import "./styles/App.scss"

const history = createBrowserHistory()

export default function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    return (
        <>
            <Router history={history}>
                <Header isLoggedIn={isLoggedIn}/>
                <div className={"content-wrapper"}>
                    <Switch>
                        <Route exact path={"/"} component={PostsList}/>
                        <Route path={"/about"} component={About}/>
                        <Route path={"/admin-panel"} component={AdminPanel}/>
                        <Route path={"/login"}>
                            <Login onLogin={() => setLoggedIn(true)}/>
                        </Route>
                        <Route path={"*"} component={PageNotFound}/>
                    </Switch>
                </div>
            </Router>
        </>
    );
}