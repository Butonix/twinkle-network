import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import ChatButton from './ChatButton';
import Icon from 'components/Icon';
import HeaderNav from './HeaderNav';
import TwinkleLogo from './TwinkleLogo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logout } from 'redux/actions/UserActions';
import {
  clearRecentChessMessage,
  getNumberOfUnreadMessages,
  increaseNumberOfUnreadMessages,
  turnChatOff,
  resetChat,
  updateApiServerToS3Progress
} from 'redux/actions/ChatActions';
import {
  changeRankingsLoadedStatus,
  changeSocketStatus,
  checkVersion,
  notifyChatSubjectChange,
  increaseNumNewPosts,
  increaseNumNewNotis
} from 'redux/actions/NotiActions';
import { closeSearch, initSearch } from 'redux/actions/SearchActions';
import { GENERAL_CHAT_ID } from 'constants/database';
import { css } from 'emotion';
import { Color, desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { recordUserAction } from 'helpers/userDataHelpers';
import { container } from './Styles';

Header.propTypes = {
  chatLoading: PropTypes.bool,
  chatMode: PropTypes.bool,
  changeRankingsLoadedStatus: PropTypes.func.isRequired,
  changeSocketStatus: PropTypes.func,
  checkVersion: PropTypes.func,
  clearRecentChessMessage: PropTypes.func,
  history: PropTypes.object.isRequired,
  getNumberOfUnreadMessages: PropTypes.func,
  increaseNumNewPosts: PropTypes.func,
  increaseNumNewNotis: PropTypes.func,
  increaseNumberOfUnreadMessages: PropTypes.func,
  initSearch: PropTypes.func,
  location: PropTypes.object,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func,
  mobileNavbarShown: PropTypes.bool,
  notifyChatSubjectChange: PropTypes.func,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onChatButtonClick: PropTypes.func,
  closeSearch: PropTypes.func.isRequired,
  onMobileMenuOpen: PropTypes.func,
  resetChat: PropTypes.func,
  searchMode: PropTypes.bool,
  showUpdateNotice: PropTypes.func,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number,
  turnChatOff: PropTypes.func,
  updateApiServerToS3Progress: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string,
  versionMatch: PropTypes.bool
};

function Header({
  changeRankingsLoadedStatus,
  chatLoading,
  chatMode,
  changeSocketStatus,
  checkVersion,
  clearRecentChessMessage,
  closeSearch,
  getNumberOfUnreadMessages,
  history,
  increaseNumNewPosts,
  increaseNumNewNotis,
  increaseNumberOfUnreadMessages,
  initSearch,
  location: { pathname },
  logout,
  loggedIn,
  mobileNavbarShown,
  notifyChatSubjectChange,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onChatButtonClick,
  onMobileMenuOpen,
  resetChat,
  searchMode,
  showUpdateNotice,
  style = {},
  totalRewardAmount,
  turnChatOff,
  updateApiServerToS3Progress,
  userId,
  username,
  versionMatch
}) {
  const [prevPathname, setPrevPathname] = useState();
  const prevUserIdRef = useRef(userId);
  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat_invitation', onChatInvitation);
    socket.on('receive_message', onReceiveMessage);
    socket.on('new_story_post', increaseNumNewPosts);
    socket.on('new_notification', increaseNumNewNotis);
    socket.on('receive_chat_file_upload_progress', onReceiveUploadProgress);
    socket.on('subject_change', onSubjectChange);

    return function cleanUp() {
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
      socket.removeListener('new_story_post', increaseNumNewPosts);
      socket.removeListener('new_notification', increaseNumNewNotis);
      socket.removeListener(
        'receive_chat_file_upload_progress',
        onReceiveUploadProgress
      );
      socket.removeListener('receive_message', onReceiveMessage);
      socket.removeListener('subject_change', onSubjectChange);
    };

    function onChatInvitation(data) {
      socket.emit('join_chat_channel', data.channelId);
      if (!chatMode) increaseNumberOfUnreadMessages();
    }
    function onConnect() {
      console.log('connected to socket');
      clearRecentChessMessage();
      changeSocketStatus(true);
      checkVersion();
      if (userId) {
        socket.emit('bind_uid_to_socket', userId, username);
        if (!chatMode) {
          getNumberOfUnreadMessages();
        }
      }
    }
    function onDisconnect() {
      console.log('disconnected from socket');
      changeSocketStatus(false);
    }
    function onReceiveMessage(data) {
      if (
        !chatMode &&
        data.channelId !== GENERAL_CHAT_ID &&
        data.userId !== userId
      ) {
        increaseNumberOfUnreadMessages();
      }
    }
    function onReceiveUploadProgress({ channelId, path, percentage }) {
      updateApiServerToS3Progress({
        progress: percentage / 100,
        channelId,
        path
      });
    }
    function onSubjectChange({ subject }) {
      notifyChatSubjectChange(subject);
    }
  });

  useEffect(() => {
    socket.connect();
    return function cleanUp() {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.disconnect();
    socket.connect();
    changeRankingsLoadedStatus(false);
    if (userId) {
      socket.emit('bind_uid_to_socket', userId, username);
      socket.emit('enter_my_notification_channel', userId);
      if (!chatMode) {
        getNumberOfUnreadMessages();
      }
    } else {
      if (prevUserIdRef.current) {
        socket.emit('leave_my_notification_channel', prevUserIdRef.current);
      }
    }
    prevUserIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    return function() {
      setPrevPathname(pathname);
    };
  }, [pathname]);

  useEffect(() => {
    showUpdateNotice(versionMatch);
  }, [versionMatch]);

  const isUsername =
    pathname.split('/')[1] !== 'featured' &&
    !['links', 'videos'].includes(pathname.split('/')[1]) &&
    pathname.length > 1;

  return (
    <nav
      className={`unselectable ${container} ${
        mobileNavbarShown ? '' : 'desktop'
      }`}
      style={{
        justifyContent: 'space-around',
        position: chatMode ? 'relative' : 'fixed',
        ...style
      }}
    >
      {chatMode && (
        <div className="chat-bar" onClick={turnChatOff}>
          <Icon icon="times" />
          <div style={{ marginLeft: '1rem' }}>Tap to close chat</div>
        </div>
      )}
      {!chatMode && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TwinkleLogo
            style={{ marginLeft: '3rem' }}
            closeSearch={closeSearch}
            history={history}
            isUsername={isUsername}
            numNewPosts={numNewPosts}
            pathname={pathname}
          />
          <div
            className={css`
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <HeaderNav
              className={`${searchMode || chatLoading ? 'hidden' : 'mobile'}`}
              alert={numNewNotis > 0 || totalRewardAmount > 0}
              alertColor={Color.gold()}
              imgLabel="user"
              onClick={onMobileMenuOpen}
            />
            <div
              className={`header-nav ${chatLoading ? 'hidden' : 'mobile'}`}
              onClick={searchMode ? closeSearch : initSearch}
              style={{ width: searchMode && '10%' }}
            >
              <a className={searchMode ? 'active' : ''}>
                {searchMode ? <Icon icon="times" /> : <Icon icon="search" />}
              </a>
            </div>
            <HeaderNav
              to="/"
              onClick={() => {
                closeSearch();
                window.scrollTo(0, 0);
              }}
              isHome
              className={chatLoading || searchMode ? 'hidden' : 'mobile'}
              imgLabel="home"
              alert={numNewPosts > 0}
              isUsername={isUsername}
            >
              Home
            </HeaderNav>
            <HeaderNav
              to="/featured"
              onClick={closeSearch}
              pathname={pathname}
              className={chatLoading || searchMode ? 'hidden' : 'mobile'}
              imgLabel="bolt"
            />
            {renderWorkNav()}
            <div
              className={`header-nav ${
                chatLoading || chatMode ? 'hidden' : 'mobile'
              }`}
              style={{ width: searchMode && '10%' }}
              onClick={onChatButtonClick}
            >
              <a
                style={{
                  color: numChatUnreads > 0 && Color.gold()
                }}
              >
                <Icon icon="comments" />
              </a>
            </div>
            <div className={`header-nav ${chatLoading ? 'mobile' : 'hidden'}`}>
              Loading...
            </div>
            <div>
              <ChatButton
                className="desktop"
                onClick={onChatButtonClick}
                chatMode={chatMode}
                loading={chatLoading}
                numUnreads={numChatUnreads}
              />
            </div>
          </div>
          <AccountMenu
            style={{ marginRight: '3rem' }}
            className={`desktop ${css`
              @media (min-width: ${desktopMinWidth}) {
                margin-left: 0.5rem;
              }
            `}`}
            history={history}
            loggedIn={loggedIn}
            logout={onLogout}
            title={username}
          />
        </div>
      )}
    </nav>
  );

  function onLogout() {
    recordUserAction({ action: 'logout' });
    logout();
    resetChat();
  }

  function renderWorkNav() {
    if (
      !prevPathname ||
      !['xp', 'links', 'videos'].includes(pathname.split('/')[1])
    ) {
      return (
        <HeaderNav
          to="/featured"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="search"
        >
          EXPLORE
        </HeaderNav>
      );
    }

    if (['links'].includes(prevPathname.split('/')[1])) {
      return (
        <HeaderNav
          to="/links"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="book"
        >
          LINKS
        </HeaderNav>
      );
    }

    if (['videos'].includes(prevPathname.split('/')[1])) {
      return (
        <HeaderNav
          to="/videos"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="film"
        >
          VIDEOS
        </HeaderNav>
      );
    }

    return (
      <HeaderNav
        to="/featured"
        onClick={closeSearch}
        pathname={pathname}
        className="desktop"
        imgLabel="bolt"
      >
        FEATURED
      </HeaderNav>
    );
  }
}

export default connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId,
    mobileNavbarShown: state.ViewReducer.mobileNavbarShown,
    numNewNotis: state.NotiReducer.numNewNotis,
    numNewPosts: state.NotiReducer.numNewPosts,
    numChatUnreads: state.ChatReducer.numUnreads,
    chatMode: state.ChatReducer.chatMode,
    searchMode: state.SearchReducer.searchMode,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    versionMatch: state.NotiReducer.versionMatch
  }),
  {
    changeRankingsLoadedStatus,
    changeSocketStatus,
    checkVersion,
    clearRecentChessMessage,
    getNumberOfUnreadMessages,
    increaseNumNewPosts,
    increaseNumNewNotis,
    increaseNumberOfUnreadMessages,
    initSearch,
    logout,
    notifyChatSubjectChange,
    closeSearch,
    resetChat,
    turnChatOff,
    updateApiServerToS3Progress
  }
)(withRouter(Header));
