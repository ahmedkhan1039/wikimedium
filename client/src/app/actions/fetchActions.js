import { ACTION_TYPE } from './actionTypes';

export const fetchArticle = title => dispatch => {
    fetch(`http://localhost:8080/api/article/${title.replace('_',' ')}`)
      .then(data => data.json())
      .then(article =>
        dispatch({
          type: ACTION_TYPE.FETCH_ARTICLE,
          payload: article
        })
      );
  };