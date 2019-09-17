import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContentPanel from 'components/ContentPanel';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import request from 'axios';
import URL from 'constants/URL';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { useAppContext } from 'context';
import { connect } from 'react-redux';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

ContentPage.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.number
};

function ContentPage({
  history,
  match: {
    params: { contentId },
    url
  },
  userId
}) {
  const contentType = url.split('/')[1].slice(0, -1);
  const {
    content: {
      state,
      actions: {
        onAttachStar,
        onChangeSpoilerStatus,
        onDeleteComment,
        onEditComment,
        onEditContent,
        onEditRewardComment,
        onInitContent,
        onLikeContent,
        onLoadComments,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadRepliesOfReply,
        onSetCommentsShown,
        onSetRewardLevel,
        onShowTCReplyInput,
        onUploadTargetComment,
        onUploadComment,
        onUploadReply
      }
    }
  } = useAppContext();
  const [{ loaded, exists }, setContentStatus] = useState({
    loaded: false,
    exists: false
  });
  const contentState = state?.[contentType + contentId] || {};
  const mounted = useRef(null);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  useEffect(() => {
    mounted.current = true;
    document.getElementById('App').scrollTop = 0;
    BodyRef.current.scrollTop = 0;
    initContent();
    async function initContent() {
      try {
        const {
          data: { exists }
        } = await request.get(
          `${URL}/content/check?contentId=${contentId}&contentType=${contentType}`
        );
        if (mounted.current) {
          setContentStatus({
            loaded: true,
            exists
          });
          onInitContent({ contentId: contentId, contentType });
        }
      } catch (error) {
        console.error(error);
        setContentStatus({
          loaded: true,
          exists: false
        });
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [contentId, url]);

  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <div
        className={css`
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          margin-top: 1rem;
          padding-bottom: 20rem;
        `}
      >
        <section
          className={css`
            width: 65%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              min-height: 100vh;
            }
          `}
        >
          {loaded ? (
            exists ? (
              <ContentPanel
                key={contentType + contentId}
                autoExpand
                inputAtBottom={contentState.contentType === 'comment'}
                commentsLoadLimit={5}
                contentObj={contentState}
                userId={userId}
                onAttachStar={onAttachStar}
                onChangeSpoilerStatus={onChangeSpoilerStatus}
                onCommentSubmit={onUploadComment}
                onDeleteComment={onDeleteComment}
                onDeleteContent={() => history.push('/')}
                onEditComment={onEditComment}
                onEditContent={onEditContent}
                onEditRewardComment={onEditRewardComment}
                onLikeContent={onLikeContent}
                onInitContent={onInitContent}
                onLoadMoreComments={onLoadMoreComments}
                onLoadMoreReplies={onLoadMoreReplies}
                onLoadRepliesOfReply={onLoadRepliesOfReply}
                onReplySubmit={onUploadReply}
                onSetCommentsShown={onSetCommentsShown}
                onSetRewardLevel={onSetRewardLevel}
                onShowTCReplyInput={onShowTCReplyInput}
                onLoadComments={onLoadComments}
                onUploadTargetComment={onUploadTargetComment}
              />
            ) : (
              <NotFound />
            )
          ) : (
            <Loading />
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(ContentPage);
