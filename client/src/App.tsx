import React, {useState} from "react";
import {createBrowserHistory} from "history"
import {Route, Router, Switch} from "react-router";
import Header from "./components/Header";
import PostsList from "./components/PostsList"
import AdminPanel from "./components/AdminPanel";
import About from "./components/About";
import PageNotFound from "./components/PageNotFound";
import {Container} from "react-bootstrap";
import "./styles/App.scss"

export default function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    return (
        <div className="App">
            <Router history={createBrowserHistory()}>
                <div className={"main-wrapper"}>
                    <Container className={"container-md"}>
                        <Header isLoggedIn={isLoggedIn}/>
                        <Switch>
                            <Route exact path={"/"} component={PostsList}/>
                            <Route path={"/about"} component={About}/>
                            <Route path={"/admin-panel"} component={AdminPanel}/>
                            <Route path={"*"} component={PageNotFound}/>
                        </Switch>
                    </Container>
                </div>
            </Router>
        </div>
    );
}