export const initialCommentState = {};
export const initialContentState = {};
export const initialHomeInputState = {
  subject: {
    attachment: undefined,
    descriptionFieldShown: false,
    details: {
      title: '',
      description: '',
      secretAnswer: '',
      rewardLevel: 0
    },
    hasSecretAnswer: false
  },
  content: {
    alreadyPosted: false,
    descriptionFieldShown: false,
    form: {
      url: '',
      isVideo: false,
      title: '',
      description: '',
      rewardLevel: 0
    },
    titleFieldShown: false,
    urlHelper: '',
    urlError: ''
  }
};
export const initialHomeState = {
  category: 'uploads',
  feeds: [],
  loadMoreButton: false,
  subFilter: 'all'
};
export const initialProfileState = {
  notables: [],
  loadMoreButton: false
};
