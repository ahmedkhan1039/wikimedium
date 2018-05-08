const initialState = {
    article: {},
    loaded: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_ARTICLE':
            return {
                ...state,
                article: action.payload,
                loaded: true
            };
        default:
            return state;
    }
}