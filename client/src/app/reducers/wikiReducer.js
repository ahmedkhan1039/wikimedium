import { ACTION_TYPE } from '../actions/actionTypes';

const initialState = {
    article: {},
    loaded: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPE.FETCH_ARTICLE:
            return {
                ...state,
                article: action.payload,
                loaded: true
            };
        default:
            return state;
    }
}