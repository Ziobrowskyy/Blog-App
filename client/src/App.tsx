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
import Login from "./components/Login";

const history = createBrowserHistory()

export default function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    return (
        <div className="App">
            <Router history={history}>
                <div className={"main-wrapper"}>
                    <Header isLoggedIn={isLoggedIn}/>
                    <Container className={"content-wrapper container-md"}>
                        <Switch>
                            <Route exact path={"/"} component={PostsList}/>
                            <Route path={"/about"} component={About}/>
                            <Route path={"/admin-panel"} component={AdminPanel}/>
                            <Route path={"/login"}>
                                <Login onLogin={() => setLoggedIn(true)}/>
                            </Route>
                            <Route path={"*"} component={PageNotFound}/>
                        </Switch>
                    </Container>
                </div>
            </Router>
        </div>
    );
}