import {FETCH_ARTISTS} from "../actions/index";

export default function (state = {}, action) {

    switch (action.type){
        case FETCH_ARTISTS:
            return action.payload.data;
        default:
            return state;
    }
};