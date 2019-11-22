import axios from 'axios';
import {postRatings} from "../actions/index"

export function makePost(id, rating) {
    axios.post("https://goat-service.herokuapp.com/rating/" + id, rating)
        .then(response => {
            postRatings(response)
})}