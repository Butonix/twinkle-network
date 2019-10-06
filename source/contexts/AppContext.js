import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ChatActions from './Chat/actions';
import ChatReducer from './Chat/reducer';
import ExploreActions from './Explore/actions';
import ExploreReducer from './Explore/reducer';
import HomeActions from './Home/actions';
import HomeReducer from './Home/reducer';
import NotiActions from './Notification/actions';
import NotiReducer from './Notification/reducer';
import ProfileActions from './Profile/actions';
import ProfileReducer from './Profile/reducer';
import UserActions from './User/actions';
import UserReducer from './User/reducer';
import requestHelpers from './requestHelpers';
import { InputContextProvider } from './InputContext';
import { ContentContextProvider } from './ContentContext';
import { ViewContextProvider } from './ViewContext';
import {
  initialExploreState,
  initialHomeState,
  initialNotiState,
  initialProfileState,
  initialUserState,
  initialChatState
} from './initialStates';

export const AppContext = createContext();

AppContextProvider.propTypes = {
  children: PropTypes.node
};

export function AppContextProvider({ children }) {
  const [chatState, chatDispatch] = useReducer(ChatReducer, initialChatState);
  const [exploreState, exploreDispatch] = useReducer(
    ExploreReducer,
    initialExploreState
  );
  const [homeState, homeDispatch] = useReducer(HomeReducer, initialHomeState);
  const [notiState, notiDispatch] = useReducer(NotiReducer, initialNotiState);
  const [profileState, profileDispatch] = useReducer(
    ProfileReducer,
    initialProfileState
  );
  const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
  return (
    <AppContext.Provider
      value={{
        chat: {
          state: chatState,
          actions: ChatActions(chatDispatch)
        },
        explore: {
          state: exploreState,
          actions: ExploreActions(exploreDispatch)
        },
        home: {
          state: homeState,
          actions: HomeActions(homeDispatch)
        },
        notification: {
          state: notiState,
          actions: NotiActions(notiDispatch)
        },
        profile: {
          state: profileState,
          actions: ProfileActions(profileDispatch)
        },
        user: {
          state: userState,
          actions: UserActions(userDispatch)
        },
        requestHelpers: requestHelpers(handleError)
      }}
    >
      <ViewContextProvider>
        <InputContextProvider>
          <ContentContextProvider>{children}</ContentContextProvider>
        </InputContextProvider>
      </ViewContextProvider>
    </AppContext.Provider>
  );

  function handleError(error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        return userDispatch({
          type: 'LOGOUT_AND_OPEN_SIGNIN_MODAL'
        });
      }
      if (status === 301) {
        window.location.reload();
      }
    }
    console.error(error.response || error);
    return Promise.reject(error);
  }
}
