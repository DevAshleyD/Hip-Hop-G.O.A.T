import {SELECT_ARTIST} from "../actions"

export default function (state = {}, action) {
    switch (action.type){
        case SELECT_ARTIST:
            return action.payload;
        default:
            return state
    }
};