const types = {
  ADD_QUESTIONS: 'ADD_QUESTIONS',
  ATTACH_STAR: 'ATTACH_STAR',
  CLOSE_MODAL: 'CLOSE_MODAL',
  DELETE: 'DELETE',
  DELETE_COMMENT: 'DELETE_COMMENT',
  DELETE_DISCUSSION: 'DELETE_DISCUSSION',
  EDIT_COMMENT: 'EDIT_COMMENT',
  EDIT_DISCUSSION: 'EDIT_DISCUSSION',
  EDIT_PAGE: 'EDIT_PAGE',
  EDIT_TITLE: 'EDIT_TITLE',
  EMPTY_CURRENT_VIDEO_SLOT: 'EMPTY_CURRENT_VIDEO_SLOT',
  FILL_CURRENT_VIDEO_SLOT: 'FILL_CURRENT_VIDEO_SLOT',
  LIKE: 'LIKE',
  LIKE_COMMENT: 'LIKE_COMMENT',
  LOAD: 'LOAD',
  LOAD_COMMENTS: 'LOAD_COMMENTS',
  LOAD_DISCUSSIONS: 'LOAD_DISCUSSIONS',
  LOAD_DISCUSSION_COMMENTS: 'LOAD_DISCUSSION_COMMENTS',
  LOAD_PAGE: 'LOAD_PAGE',
  LOAD_RIGHT_MENU_VIDS: 'LOAD_RIGHT_MENU_VIDS',
  LOAD_MORE_COMMENTS: 'LOAD_MORE_COMMENTS',
  LOAD_MORE_DISCUSSION_COMMENTS: 'LOAD_MORE_DISCUSSION_COMMENTS',
  LOAD_MORE_DISCUSSIONS: 'LOAD_MORE_DISCUSSIONS',
  LOAD_MORE_REPLIES: 'LOAD_MORE_REPLIES',
  LOAD_MORE_RIGHT_MENU_PL_VIDS: 'LOAD_MORE_RIGHT_MENU_PL_VIDS',
  OPEN_MODAL: 'OPEN_MODAL',
  PAGE_UNAVAILABLE: 'PAGE_UNAVAILABLE',
  RESET: 'RESET',
  RESET_PAGE: 'RESET_PAGE',
  STAR: 'STAR',
  UPLOAD: 'UPLOAD',
  UPLOAD_COMMENT: 'UPLOAD_COMMENT',
  UPLOAD_DISCUSSION: 'UPLOAD_DISCUSSION',
  UPLOAD_DISCUSSION_COMMENT: 'UPLOAD_DISCUSSION_COMMENT',
  UPLOAD_REPLY: 'UPLOAD_REPLY'
}

for (let key in types) {
  types[key] = `${types[key]}_VIDEO`
}

export default types
