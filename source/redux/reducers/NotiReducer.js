import NOTI from '../constants/Noti'

const defaultState = {
  versionMatch: true,
  notifications: [],
  currentChatSubject: {},
  numNewPosts: 0
}

export default function NotiReducer(state = defaultState, action) {
  switch (action.type) {
    case NOTI.CHECK_VERSION:
      return {
        ...state,
        versionMatch: action.data.match
      }
    case NOTI.CHAT_SUBJECT_CHANGE:
      return {
        ...state,
        currentChatSubject: {
          ...state.currentChatSubject,
          ...action.subject
        }
      }
    case NOTI.CLEAR:
      return {
        ...state,
        notifications: []
      }
    case NOTI.INCREASE_NUM_NEW_POSTS:
      return {
        ...state,
        numNewPosts: state.numNewPosts + 1
      }
    case NOTI.LOAD:
      return {
        ...state,
        ...action.data
      }
    case NOTI.RESET_NUM_NEW_POSTS:
      return {
        ...state,
        numNewPosts: 0
      }
    default:
      return state
  }
}
