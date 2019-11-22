import {POST_RATINGS} from "../actions/index";

export default function (state = {}, action) {
    switch (action.type) {
        case POST_RATINGS:
            return action.payload;
        default:
            return state
    }
}