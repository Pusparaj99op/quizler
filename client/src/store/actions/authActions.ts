import { Dispatch } from 'redux';
import { authService } from '../../services/auth.service';

// Action types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGOUT = 'LOGOUT';

// Action creators
export const login = (credentials: { email: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const user = await authService.login(credentials);
      dispatch({ type: LOGIN_SUCCESS, payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    }
  };
};

export const register = (userData: { name: string; email: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: REGISTER_REQUEST });
      const user = await authService.register(userData);
      dispatch({ type: REGISTER_SUCCESS, payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register';
      dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    }
  };
};

export const logout = () => {
  authService.logout();
  return { type: LOGOUT };
};