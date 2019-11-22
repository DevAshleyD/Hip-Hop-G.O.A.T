import React, {Component} from 'react';
import {connect} from "react-redux";
import Game from './game';
import ChatBox from './chatbox';

class GameContainer extends Component {

    render() {

        if (Array.isArray(this.props.artists)) {
            return (
                <div>
                    <Game/>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>Artists Loading</h1>
                </div>
            )
        }

    }
}

function mapStateToProps(state) {
    return {
        artists: state.artists
    }
}

export default connect(mapStateToProps)(GameContainer);