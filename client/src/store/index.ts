import { createStore, applyMiddleware, compose, Action } from 'redux';
import { thunk } from 'redux-thunk'; // Updated import for redux-thunk v3+

// Create a simple root reducer until we set up the proper reducers
const rootReducer = (state = {}, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = createStore(
  rootReducer, 
  compose(applyMiddleware(thunk))
);

export default store;


