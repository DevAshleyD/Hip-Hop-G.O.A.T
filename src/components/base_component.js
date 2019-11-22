import React, {Component} from 'react';
import ArtistList from './artist_list';
import ArtistDetail from './artist_detail';
import {Collapse} from "reactstrap";
import {isEmpty} from "lodash";
import {connect} from "react-redux";
import Goat from "./goat_lander";
import {Glyphicon} from "react-bootstrap";

class Base extends Component {



    render() {
        return (
            <div>
                <div id="banner">
                    <div>
                        <Goat/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3">
                        <ArtistList />
                    </div>
                    <div className="col-lg-9 artist-detail">
                        {this.handleArtistSelected()}
                    </div>
                </div>
            </div>
        )
    }

    handleArtistSelected() {
        if (isEmpty(this.props.artist)) {
            return (
                <div id="noArtistSelected">
                    <h1><Glyphicon id="arrow" glyph="arrow-left"/>Select an artist from the list</h1>
                </div>
            )
        } else {
            return <ArtistDetail key={this.props.artist}/>
        }
    }
}

function mapStateToProps(state) {
    return{
        artist: state.selectedArtist
    }
}

export default connect(mapStateToProps)(Base);