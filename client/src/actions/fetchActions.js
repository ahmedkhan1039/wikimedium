export const fetchArticle = (title) => dispatch => {
    fetch("http://localhost:8080/api/article/".concat(title.replace("_"," ")))
      .then(data => data.json())
      .then(article =>
        dispatch({
          type: 'FETCH_ARTICLE',
          payload: article
        })
      );
  };