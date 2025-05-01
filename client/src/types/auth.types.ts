export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

// Redux action types
export enum AuthActionTypes {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  
  LOGOUT = 'LOGOUT'
}

export interface AuthAction {
  type: AuthActionTypes;
  payload?: any;
  error?: any;
}