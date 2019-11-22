import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import ArtistReducer from './artist_reducer'
import SelectedArtistReducer from './selected_artist_reducer';
import LogInReducer from './log_in_reducer';
import CurrentUserReducer from './current_user_reducer';
import PostRatingsReducer from './post_ratings_reducer';
import NewArtistSelected from './new_artist_selected_reducer'

const rootReducer = combineReducers({
    artists: ArtistReducer,
    selectedArtist: SelectedArtistReducer,
    isLoggedIn: LogInReducer,
    ratingsPosted: PostRatingsReducer,
    currentUser: CurrentUserReducer,
    newArtistSelected: NewArtistSelected,
    form: formReducer
});

export default rootReducer;