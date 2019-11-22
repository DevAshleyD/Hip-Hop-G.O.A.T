import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import LandingPage from "./components/landing_page";
import NavBar from "./components/navbar";
import './App.css';
import Artists from './components/artist_list';
import ArtistDetail from './components/artist_detail';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Base from "./components/base_component";
import {connect} from "react-redux";
import {fetchArtists} from "./actions/index";
import Game from "./game/game_container";


class App extends Component {

    componentDidMount(){
        this.props.fetchArtists();
    }

    render() {
        return (
            <div className="app">
{/*
                <NavBar/>
*/}
                <BrowserRouter>
                    <div id="base">
                        <Switch>
                            <Route path="/game" component={Game}/>
                            <Route path="/" component={Base}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, {
    fetchArtists: fetchArtists,
})(App);
