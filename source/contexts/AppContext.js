import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import UserActions from './User/actions';
import UserReducer from './User/reducer';
import requestHelpers from './requestHelpers';
import { ChatContextProvider } from './Chat';
import { ContentContextProvider } from './Content';
import { ExploreContextProvider } from './Explore';
import { HomeContextProvider } from './Home';
import { InputContextProvider } from './Input';
import { NotiContextProvider } from './Notification';
import { ProfileContextProvider } from './Profile';
import { ViewContextProvider } from './View';

export const AppContext = createContext();
export const initialUserState = {
  authLevel: 0,
  canDelete: false,
  canEdit: false,
  canEditRewardLevel: false,
  canStar: false,
  canEditPlaylists: false,
  canPinPlaylists: false,
  defaultSearchFilter: '',
  hideWatched: false,
  isCreator: false,
  loadMoreButton: false,
  loggedIn: false,
  profileTheme: 'logoBlue',
  profiles: [],
  profilesLoaded: false,
  searchedProfiles: [],
  signinModalShown: false
};

AppContextProvider.propTypes = {
  children: PropTypes.node
};

export function AppContextProvider({ children }) {
  const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
  return (
    <ChatContextProvider>
      <ProfileContextProvider>
        <ExploreContextProvider>
          <ViewContextProvider>
            <NotiContextProvider>
              <HomeContextProvider>
                <InputContextProvider>
                  <ContentContextProvider>
                    <AppContext.Provider
                      value={{
                        user: {
                          state: userState,
                          actions: UserActions(userDispatch)
                        },
                        requestHelpers: requestHelpers(handleError)
                      }}
                    >
                      {children}
                    </AppContext.Provider>
                  </ContentContextProvider>
                </InputContextProvider>
              </HomeContextProvider>
            </NotiContextProvider>
          </ViewContextProvider>
        </ExploreContextProvider>
      </ProfileContextProvider>
    </ChatContextProvider>
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