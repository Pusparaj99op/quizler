import {
  FETCH_QUIZZES_REQUEST,
  FETCH_QUIZZES_SUCCESS,
  FETCH_QUIZZES_FAILURE,
  CREATE_QUIZ_REQUEST,
  CREATE_QUIZ_SUCCESS,
  CREATE_QUIZ_FAILURE
} from './quizActions';

const initialState = {
  quizzes: [],
  loading: false,
  error: null,
  currentQuiz: null
};

const quizReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_QUIZZES_REQUEST:
    case CREATE_QUIZ_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_QUIZZES_SUCCESS:
      return {
        ...state,
        loading: false,
        quizzes: action.payload,
        error: null
      };
    case CREATE_QUIZ_SUCCESS:
      return {
        ...state,
        loading: false,
        quizzes: [...state.quizzes, action.payload],
        error: null
      };
    case FETCH_QUIZZES_FAILURE:
    case CREATE_QUIZ_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default quizReducer;