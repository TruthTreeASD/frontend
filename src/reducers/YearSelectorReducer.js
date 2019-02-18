export default (state = { yearSelected: 2016 }, action) => {
  switch (action.type) {
    case 'CHANGE_YEAR':
      //console.log(action);
      state = {
        ...state,
        yearSelected: action.yearSelected
      };
      break;
    default:
      return state;
  }
  return state;
};
