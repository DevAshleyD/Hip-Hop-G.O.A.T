import {NEW_ARTIST_SELECTED} from "../actions/index";

export default function (state = {}, action) {
    switch (action.type) {
        case NEW_ARTIST_SELECTED:
            return action.payload;
        default:
            return state
    }
}
