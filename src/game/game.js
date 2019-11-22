import React, {Component} from 'react';
import shuffle from 'shuffle-array';
import {connect} from "react-redux";
import ChatBox from './chatbox';
import {selectArtist} from "../actions/index";

class Game extends Component {

    constructor(props) {
        super(props);
        const clonedArray = this.props.artists.slice(0);
        const shuffledArtists = shuffle.pick(clonedArray, {'picks': 4});
        const trueArtist = shuffle.pick(shuffledArtists, {'picks': 1});
        this.state = {
            artists: shuffledArtists,
            selectedArtist: trueArtist,
            userCorrect: false,
            showErrorMessage: false
        }

    }

    handleMessage() {
        if (this.state.userCorrect) {
            return <h1 style={{color: 'green'}}>CORRECT!!!!!!!</h1>
        } else if (this.state.showErrorMessage) {
            return <h1 style={{color: 'red'}}>TRY AGAIN :(</h1>
        } else {
            return null
        }
    }

    reset() {
        console.log("In reset");
        const clonedArray = this.props.artists.slice(0);
        const shuffledArtists = shuffle.pick(clonedArray, {'picks': 4});
        const trueArtist = shuffle.pick(shuffledArtists, {'picks': 1});
        this.setState({
            artists: shuffledArtists,
            selectedArtist: trueArtist,
            userCorrect: false,
            showErrorMessage: false
        })
    }

    handleClick(artist) {
        this.setState({
                userCorrect: false,
                showErrorMessage: false
            }
        );
        if (artist.id === this.state.selectedArtist.id) {
            this.setState({
                userCorrect: true
            })
        } else {
            this.setState({
                showErrorMessage: true
            })
        }
    }

    render() {
        return (
            <div className="artist-detail">
                <div>
                    <div className="row">
                        <div className="col-6 game-screen">
                            <div className="row">
                                <img style={{borderColor: this.state.selectedArtist.hexColor}}
                                     className="fadeIn"
                                     id="artistPictureGame"
                                     src={this.state.selectedArtist.imageUrl}/>

                            </div>
                            <div className="row">
                                <button onClick={() => this.handleClick(this.state.artists[0])}
                                        className="btn-lg btn-info game-button">{this.state.artists[0].name}</button>
                                <button onClick={() => this.handleClick(this.state.artists[1])}
                                        className="btn-lg btn-info game-button">{this.state.artists[1].name}</button>
                                <button onClick={() => this.handleClick(this.state.artists[2])}
                                        className="btn-lg btn-info game-button">{this.state.artists[2].name}</button>
                                <button onClick={() => this.handleClick(this.state.artists[3])}
                                        className="btn-lg btn-info game-button">{this.state.artists[3].name}</button>
                                <hr/>


                            </div>
                            <hr/>
                            <div className="row">
                                <button onClick={() => this.reset()} className="btn btn-danger game-button">Reset</button>
                            </div>
                        </div>


                        <div className="col-6">
                            {this.handleMessage()}
                            <ChatBox/>
                        </div>

                    </div>


                </div>


                <hr/>


            </div>

        )
    }


}

function mapStateToProps(state) {
    return {
        artists: state.artists
    }
}

export default connect(mapStateToProps)(Game);