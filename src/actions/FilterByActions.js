export const filterByAction = value => dispatch => {
  dispatch({
    type: 'CHANGE_DIMENSION',
    payload: value
  });
};
