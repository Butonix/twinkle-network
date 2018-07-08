import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Heading from './Heading'
import Contents from './Contents'
import Loading from 'components/Loading'
import { container } from './Styles'

export default class ContentPanel extends Component {
  static propTypes = {
    autoShowComments: PropTypes.bool,
    contentObj: PropTypes.object.isRequired,
    inputAtBottom: PropTypes.bool,
    methodObj: PropTypes.object.isRequired,
    selfLoadingDisabled: PropTypes.bool,
    userId: PropTypes.number
  }

  state = {
    attachedVideoShown: false,
    feedLoaded: false
  }

  componentDidMount() {
    const { methodObj, contentObj, selfLoadingDisabled } = this.props
    const { feedLoaded } = this.state
    if (!feedLoaded && !selfLoadingDisabled && !contentObj.newPost) {
      this.setState({ feedLoaded: true })
      methodObj.loadContent(contentObj)
    }
  }

  render() {
    const {
      autoShowComments,
      contentObj,
      inputAtBottom,
      methodObj,
      userId
    } = this.props
    const { attachedVideoShown } = this.state
    const methods = {
      Heading: {
        onUploadAnswer: methodObj.uploadComment,
        onLikeClick: methodObj.likeContent
      },
      Contents: {
        commentActions: {
          attachStar: methodObj.attachStar,
          onDelete: methodObj.deleteComment,
          onLikeClick: methodObj.likeComment,
          onEditDone: methodObj.editComment,
          onReplySubmit: methodObj.uploadComment,
          onLoadMoreReplies: methodObj.loadMoreReplies,
          onRewardCommentEdit: methodObj.editRewardComment
        },
        attachStar: methodObj.attachStar,
        feedVideoStar: methodObj.starVideo,
        loadMoreComments: methodObj.loadMoreComments,
        onCommentSubmit: methodObj.uploadComment,
        onContentDelete: methodObj.deleteContent,
        onContentEdit: methodObj.editContent,
        onRewardCommentEdit: methodObj.editRewardComment,
        onLikeCommentClick: methodObj.likeComment,
        onLikeQuestionClick: methodObj.likeQuestion,
        onLikeContentClick: methodObj.likeContent,
        showFeedComments: methodObj.showComments,
        TargetContent: {
          attachStar: methodObj.attachStar,
          onDeleteComment: methodObj.deleteComment,
          onEditComment: methodObj.editComment,
          onLikeClick: methodObj.likeTargetComment,
          onRewardCommentEdit: methodObj.editRewardComment,
          uploadComment: methodObj.uploadTargetComment
        }
      }
    }
    return (
      <div
        className={container}
        style={{ height: !contentObj.loaded && '15rem' }}
      >
        {!contentObj.loaded && <Loading absolute />}
        {contentObj.loaded && (
          <Heading
            contentObj={contentObj}
            methods={methods.Heading}
            myId={userId}
            action={
              contentObj.commentId
                ? contentObj.targetObj.comment.notFound
                  ? 'replied on'
                  : 'replied to'
                : contentObj.rootType === 'question'
                  ? 'answered'
                  : 'commented on'
            }
            onPlayVideoClick={() => this.setState({ attachedVideoShown: true })}
            attachedVideoShown={attachedVideoShown}
          />
        )}
        <div className="body">
          {contentObj.loaded && (
            <Contents
              autoShowComments={autoShowComments}
              contentObj={contentObj}
              inputAtBottom={inputAtBottom}
              methods={methods.Contents}
              attachedVideoShown={attachedVideoShown}
              myId={userId}
            />
          )}
        </div>
      </div>
    )
  }
}
