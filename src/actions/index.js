import axios from 'axios';

export const FETCH_ARTISTS = 'fetch-artists';
export const SELECT_ARTIST = 'select-artist';
export const POST_RATINGS = 'post-ratings';
export const CHANGE_LOG_IN_STATUS = 'change-status';
export const UPDATE_USER = 'update-user';
export const NEW_ARTIST_SELECTED = 'new-artist-selected';

export function fetchArtists() {
    const request = axios.get("https://goat-service.herokuapp.com/artists");
    console.log(request);
    return {
        type: FETCH_ARTISTS,
        payload: request
    }
}

export function postRatings(id, rating) {
    const request = axios.post("https://goat-service.herokuapp.com/rating/" + id, rating);
    return {
        type: POST_RATINGS,
        payload: request
    }
}

export function selectArtist(artist){
    return {
        type: SELECT_ARTIST,
        payload: artist
    }
}

export function changeLogInStatus(boolean){
    return {
        type: CHANGE_LOG_IN_STATUS,
        payload: boolean
    }
}

export function updateUserStatus(user) {
    return {
        type: UPDATE_USER,
        payload: user
    }
}

export function newArtistSelected(boolean) {
    return{
        type: NEW_ARTIST_SELECTED,
        payload: boolean
    }
}