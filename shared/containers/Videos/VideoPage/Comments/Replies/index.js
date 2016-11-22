import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Reply from './Reply';
import {scrollElementToCenter} from 'helpers/domHelpers';
import Button from 'components/Button';

export default class Replies extends Component {
  constructor() {
    super()
    this.state = {
      lastDeletedCommentIndex: null,
      deleteListenerToggle: false,
      deletedFirstReply: false
    }
    this.deleteCallback = this.deleteCallback.bind(this)
    this.loadMoreReplies = this.loadMoreReplies.bind(this)
  }

  componentDidUpdate(prevProps) {
    const length = this.props.replies.length;
    const lastReply = this.props.replies[length - 1] || [];
    const newlyAdded = lastReply ? lastReply.newlyAdded : false;
    const addedFromPanel = lastReply.addedFromPanel;
    const replyToReply = lastReply ? !!lastReply.targetUserId : false;
    const {deleteListenerToggle, deletedFirstReply} = this.state;
    if (length > prevProps.replies.length && newlyAdded && replyToReply && !addedFromPanel) {
      scrollElementToCenter(this.refs[lastReply.id])
    }
    if (length < prevProps.replies.length) {
      if (length === 0) {
        if (deletedFirstReply) return scrollElementToCenter(this.Replies);
        return;
      }
      this.setState({deleteListenerToggle: !deleteListenerToggle})
    }
  }

  render() {
    const {
      comment, replies, userId, onEditDone, onLikeClick, onDelete, onReplySubmit, commentId, videoId
    } = this.props;
    const {lastDeletedCommentIndex, deleteListenerToggle} = this.state;
    return (
      <div
        className="media container-fluid"
        style={{paddingLeft: '0px', paddingRight: '0px'}}
        ref={ref => {this.Replies = ref}}
      >
        {comment.loadMoreReplies &&
          <Button
            className="btn btn-default"
            style={{
              width: '100%',
              marginBottom: replies.length === 0 && '1em'
            }}
            onClick={this.loadMoreReplies}
          >
            Load More
          </Button>
        }
        {replies.map((reply, index) => {
          return (
            <Reply
              {...reply}
              index={index}
              ref={reply.id}
              commentId={commentId}
              videoId={videoId}
              onReplySubmit={onReplySubmit}
              onEditDone={onEditDone}
              onLikeClick={onLikeClick}
              onDelete={onDelete}
              myId={userId}
              key={reply.id}
              userIsOwner={reply.userId === userId}
              deleteCallback={this.deleteCallback}
              lastDeletedCommentIndex={lastDeletedCommentIndex}
              deleteListenerToggle={deleteListenerToggle}
              isFirstReply={index === 0}
            />
          )
        })}
      </div>
    )
  }

  deleteCallback(index, isFirstReply) {
    this.setState({
      lastDeletedCommentIndex: index,
      deletedFirstReply: isFirstReply
    });
  }

  loadMoreReplies() {
    const {comment, replies, onLoadMoreReplies} = this.props;
    const lastReplyId = !!replies[0] ? replies[0].id : '0';
    onLoadMoreReplies(lastReplyId, comment.id, 'default')
  }
}
