import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import {createBrowserHistory} from "history"
import {Route, Router, Switch} from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostsPage from "./components/PostsPage"
import AdminPanel from "./components/AdminPanel";
import About from "./components/About";
import PageNotFound from "./components/PageNotFound";
import {Container} from "react-bootstrap";

function App() {
    return (
        <div className="App">
            <Router history={createBrowserHistory()}>
                <Container>
                <Header/>
                <Switch>
                    <Route exact path={"/"}><p>Home page</p></Route>
                    <Route path={"/about"} component={About}/>
                    <Route path={"/posts"} component={PostsPage}/>
                    <Route path={"/admin-panel"} component={AdminPanel}/>
                    <Route path={"*"} component={PageNotFound}/>
                </Switch>
                {/*<Footer/>*/}
                </Container>
            </Router>
        </div>
    );
}

export default App;
