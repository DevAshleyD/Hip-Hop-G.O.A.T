import {CHANGE_LOG_IN_STATUS} from "../actions/index";

export default function (state = {}, action) {

    switch (action.type){
        case CHANGE_LOG_IN_STATUS:
            console.log(action.payload);
            return action.payload;
        default:
            return state;
    }
};