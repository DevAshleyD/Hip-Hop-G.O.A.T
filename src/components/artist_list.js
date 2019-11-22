import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchArtists} from "../actions/index";
import ArtistDetail from "./artist_detail";
import {selectArtist} from "../actions/index";
import {newArtistSelected} from "../actions/index";
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import ReactDom, {findDOMNode} from "react-dom";


class Artists extends Component {


    componentDidMount() {

        let elem = ReactDom.findDOMNode(this);
        // Set the opacity of the element to 0
        elem.style.opacity = 0;
        setTimeout(function () {
            console.log("hey");
            window.requestAnimationFrame(function () {
                // Now set a transition on the opacity
                elem.style.transition = "opacity 7000ms";
                // and set the opacity to 1
                elem.style.opacity = 1;
            })
        }, 2000);

    }

    render() {
        return (
            <div id="artist-list" className="container">
                <h1 id="artist-list-header">-:Artist List:-</h1>
                <hr/>
                <hr/>
                <hr/>
                {this.renderArtists()}
            </div>
        )
    }

    handleArtistClicked(artist) {
        this.props.selectArtist(artist);
        this.props.newArtistSelected(true);
    }

    renderArtists() {
        return _.map(this.props.artists, artist => {
            return (
                <div
                    className="artist-list-entry"
                    key={artist.id}
                    onClick={() => this.handleArtistClicked(artist)}
                >
                    <h1 className="artist-name">
                        {artist.name}
                    </h1>
                </div>
            )
        })
    }
}

function mapStateToProps(state) {
    return {
        artists: state.artists,
        selectedArtist: state.selectedArtist
    };
}

export default connect(mapStateToProps, {
    fetchArtists: fetchArtists,
    selectArtist: selectArtist,
    newArtistSelected: newArtistSelected
})(Artists);