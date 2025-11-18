// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

export const API_ENDPOINTS = {
  // User endpoints
  CREATE_USER: '/createuser',
  LOGIN: '/login',
  GET_USERS: '/users',
  SEARCH_USER: '/users/search',
  AUTOCOMPLETE: '/users/autocomplete',
  UPDATE_USER: '/updateuser',
  DELETE_USER: '/deleteuser',
  
  // Post endpoints
  CREATE_POST: '/createpost',
  GET_FEED: '/feed',
  GET_POST: '/post',
  UPDATE_POST: '/updatepost',
  DELETE_POST: '/deletepost',
  GET_USER_POSTS: '/posts/user',
  
  // Follow endpoints
  FOLLOW_USER: '/api/follow',
  UNFOLLOW_USER: '/api/follow',
  CHECK_FOLLOWING: '/api/follow/check',
  GET_FOLLOWERS: '/api/follow/followers',
  GET_FOLLOWING: '/api/follow/following',
  GET_FOLLOW_COUNTS: '/api/follow/counts',
  CHECK_MUTUAL_FOLLOW: '/api/follow/mutual',
  GET_MUTUAL_FOLLOWERS: '/api/follow/mutual-followers',
  
  // Chat endpoints
  GET_USER_CHATS: '/api/chats',
  GET_OR_CREATE_CHAT: '/api/chats/with',
  GET_CHAT_MESSAGES: '/api/chats',
  SEND_MESSAGE: '/api/chats',
  MARK_MESSAGES_READ: '/api/chats',
  DELETE_MESSAGE: '/api/chats/messages',
  GET_UNREAD_COUNT: '/api/chats/unread-count',
  CAN_CHAT: '/api/chats/can-chat',
};

export default API_BASE_URL;
