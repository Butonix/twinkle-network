import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Context from './Context';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Heading from './Heading';
import Body from './Body';
import Loading from 'components/Loading';
import ContentListItem from 'components/ContentListItem';
import TargetContent from './TargetContent';
import Embedly from 'components/Embedly';
import Profile from './Profile';
import { css } from 'emotion';
import { cleanString } from 'helpers/stringHelpers';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { container } from './Styles';
import { loadContent } from 'helpers/requestHelpers';
import { withRouter } from 'react-router';

ContentPanel.propTypes = {
  autoExpand: PropTypes.bool,
  commentsLoadLimit: PropTypes.number,
  contentObj: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  inputAtBottom: PropTypes.bool,
  userId: PropTypes.number,
  onAddTags: PropTypes.func,
  onAddTagToContents: PropTypes.func,
  onAttachStar: PropTypes.func.isRequired,
  onChangeSpoilerStatus: PropTypes.func.isRequired,
  onCommentSubmit: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onDeleteContent: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
  onEditRewardComment: PropTypes.func.isRequired,
  onInitContent: PropTypes.func.isRequired,
  onLikeContent: PropTypes.func.isRequired,
  onLoadMoreComments: PropTypes.func.isRequired,
  onLoadMoreReplies: PropTypes.func.isRequired,
  onLoadTags: PropTypes.func,
  onLoadRepliesOfReply: PropTypes.func,
  onReplySubmit: PropTypes.func.isRequired,
  onSetCommentsShown: PropTypes.func.isRequired,
  onSetRewardLevel: PropTypes.func,
  onShowTCReplyInput: PropTypes.func.isRequired,
  onLoadComments: PropTypes.func.isRequired,
  onByUserStatusChange: PropTypes.func,
  onTargetCommentSubmit: PropTypes.func.isRequired,
  style: PropTypes.object
};

function ContentPanel({
  autoExpand,
  commentsLoadLimit,
  contentObj,
  contentObj: { commentsShown, contentId, feedId, newPost, secretShown, type },
  history,
  inputAtBottom,
  onAddTags,
  onAddTagToContents,
  onAttachStar,
  onByUserStatusChange,
  onChangeSpoilerStatus,
  onCommentSubmit,
  onDeleteComment,
  onDeleteContent,
  onEditComment,
  onEditContent,
  onEditRewardComment,
  onInitContent,
  onLikeContent,
  onLoadMoreComments,
  onLoadMoreReplies,
  onLoadTags,
  onLoadRepliesOfReply,
  onReplySubmit,
  onSetCommentsShown,
  onSetRewardLevel,
  onShowTCReplyInput,
  onLoadComments,
  onTargetCommentSubmit,
  style = {},
  userId
}) {
  const [urlMouseEntered, setUrlMouseEntered] = useState(false);
  const [profileMouseEntered, setProfileMouseEntered] = useState(false);
  const [videoShown, setVideoShown] = useState(false);
  const [commentsHidden, setCommentsHidden] = useState(true);
  const loading = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    if (!contentObj.loaded && !loading.current) {
      onMount();
    }
    async function onMount() {
      if (!newPost && mounted.current) {
        loading.current = true;
        onInitContent({
          content: await loadContent({ contentId, type }),
          feedId
        });
        loading.current = false;
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [contentObj]);
  const isThreaded = !!contentObj.targetObj;
  return (
    <Context.Provider
      value={{
        commentsLoadLimit,
        onAddTags,
        onAddTagToContents,
        onAttachStar,
        onByUserStatusChange,
        onCommentSubmit,
        onDeleteComment,
        onDeleteContent,
        onEditComment,
        onEditContent,
        onEditRewardComment,
        onLoadComments,
        onLikeContent,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadTags,
        onLoadRepliesOfReply,
        onReplySubmit,
        onSetRewardLevel,
        onTargetCommentSubmit
      }}
    >
      <ErrorBoundary>
        <div
          style={{
            height: !contentObj.loaded && '15rem',
            position: 'relative',
            ...style
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              boxShadow: isThreaded ? `0 4px 10px -3px ${Color.black(0.8)}` : ''
            }}
            className={container}
          >
            {!contentObj.loaded && <Loading />}
            {contentObj.loaded && (
              <>
                <Heading
                  contentObj={contentObj}
                  myId={userId}
                  action={
                    contentObj.commentId
                      ? contentObj.targetObj.comment.notFound
                        ? 'replied on'
                        : 'replied to'
                      : contentObj.rootType === 'subject'
                      ? 'responded to'
                      : contentObj.rootType === 'user'
                      ? 'left a message to'
                      : 'commented on'
                  }
                  onPlayVideoClick={() => setVideoShown(true)}
                  attachedVideoShown={videoShown}
                />
                <div className="body">
                  <Body
                    autoExpand={autoExpand}
                    commentsHidden={commentsHidden}
                    commentsShown={commentsShown}
                    contentObj={contentObj}
                    inputAtBottom={inputAtBottom}
                    attachedVideoShown={videoShown}
                    myId={userId}
                    secretShown={secretShown}
                    onChangeSpoilerStatus={onChangeSpoilerStatus}
                    onSetCommentsHidden={setCommentsHidden}
                    onSetCommentsShown={onSetCommentsShown}
                  />
                </div>
              </>
            )}
          </div>
          {contentObj.loaded && contentObj.targetObj?.comment && (
            <TargetContent
              style={{
                position: 'relative',
                zIndex: 2,
                boxShadow:
                  contentObj.targetObj?.subject ||
                  contentObj.rootType === 'video' ||
                  contentObj.rootType === 'url' ||
                  contentObj.rootType === 'user'
                    ? `0 4px 10px -3px ${Color.black(0.8)}`
                    : ''
              }}
              targetObj={contentObj.targetObj}
              rootObj={contentObj.rootObj}
              rootId={contentObj.rootId}
              rootType={contentObj.rootType}
              secretShown={secretShown}
              feedId={feedId}
              onShowTCReplyInput={onShowTCReplyInput}
            />
          )}
          {contentObj.loaded && contentObj.targetObj?.subject && (
            <div>
              <ContentListItem
                comments={contentObj.childComments}
                style={{
                  zIndex: 1,
                  position: 'relative',
                  boxShadow:
                    contentObj.rootType === 'video' ||
                    contentObj.rootType === 'url'
                      ? `0 4px 10px -3px ${Color.black(0.8)}`
                      : ''
                }}
                expandable
                onClick={() =>
                  history.push(`/subjects/${contentObj.targetObj.subject.id}`)
                }
                contentObj={contentObj.targetObj.subject}
                onChangeSpoilerStatus={onChangeSpoilerStatus}
                secretShown={secretShown}
              />
            </div>
          )}
          {type === 'comment' && contentObj.rootType === 'video' && (
            <ContentListItem
              style={{
                position: 'relative'
              }}
              expandable
              onClick={() => history.push(`/videos/${contentObj.rootObj.id}`)}
              contentObj={contentObj.rootObj}
            />
          )}
          {(type === 'comment' || type === 'subject') &&
            contentObj.rootType === 'url' && (
              <div
                onTouchStart={() => setUrlMouseEntered(true)}
                onMouseEnter={() => setUrlMouseEntered(true)}
                className={css`
                  padding: 1rem;
                  background: ${Color.whiteGray()};
                  margin-top: ${urlMouseEntered ? '-0.5rem' : '-2rem'};
                  border: 1px solid ${Color.borderGray()};
                  border-radius: ${borderRadius};
                  transition: margin-top 0.5s, background 0.5s;
                  &:hover {
                    background: #fff;
                  }
                  @media (max-width: ${mobileMaxWidth}) {
                    margin-top: -0.5rem;
                  }
                `}
              >
                <Embedly
                  small
                  title={cleanString(contentObj.rootObj.title)}
                  url={contentObj.rootObj.content}
                  contentId={contentObj.rootId}
                  thumbUrl={contentObj.rootObj.thumbUrl}
                  actualTitle={contentObj.rootObj.actualTitle}
                  actualDescription={contentObj.rootObj.actualDescription}
                  siteUrl={contentObj.rootObj.siteUrl}
                />
              </div>
            )}
          {type === 'comment' && contentObj.rootType === 'user' && (
            <div
              onTouchStart={() => setProfileMouseEntered(true)}
              onMouseEnter={() => setProfileMouseEntered(true)}
              className={css`
                cursor: pointer;
                background: ${Color.whiteGray()};
                margin-top: ${profileMouseEntered ? '-0.5rem' : '-2rem'};
                border: 1px solid ${Color.borderGray()};
                border-radius: ${borderRadius};
                transition: margin-top 0.5s, background 0.5s;
                padding-bottom: 1rem;
                &:hover {
                  background: #fff;
                }
                @media (max-width: ${mobileMaxWidth}) {
                  border-left: 0;
                  border-right: 0;
                  margin-top: -0.5rem;
                }
              `}
              onClick={() =>
                window.open(`/users/${contentObj.rootObj.username}`)
              }
            >
              <Profile profile={contentObj.rootObj} />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Context.Provider>
  );
}

export default withRouter(ContentPanel);
