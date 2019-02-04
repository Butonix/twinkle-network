import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'components/Button';
import { Color } from 'constants/css';
import Loading from 'components/Loading';
import Message from './Message';
import SubjectHeader from './SubjectHeader';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { connect } from 'react-redux';
import { deleteMessage } from 'redux/actions/ChatActions';
import SubjectMsgsModal from '../Modals/SubjectMsgsModal';

const scrollIsAtTheBottom = (content, container) => {
  return content.offsetHeight <= container.offsetHeight + container.scrollTop;
};

class MessagesContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    currentChannelId: PropTypes.number.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    loadMoreButton: PropTypes.bool,
    messages: PropTypes.array,
    loadMoreMessages: PropTypes.func,
    loading: PropTypes.bool
  };

  state = {
    deleteModal: {
      shown: false,
      messageId: null
    },
    fillerHeight: 20,
    maxScroll: 0,
    newUnseenMessage: false,
    loadMoreButtonLock: false,
    subjectMsgsModal: {
      shown: false,
      subjectId: null,
      content: ''
    }
  };

  messages = {};
  messagesContainer = {};

  componentDidMount() {
    this.setScrollToBottom();
    this.setState({
      fillerHeight:
        this.messagesContainer.offsetHeight > this.messages.offsetHeight
          ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
          : 0
    });
    this.setScrollToBottom();
    setTimeout(() => this.setScrollToBottom(), 300);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return scrollIsAtTheBottom(this.content, this.messagesContainer);
  }

  componentDidUpdate(prevProps, prevState, scrollAtBottom) {
    const { userId } = this.props;
    const prevMessages = prevProps.messages.filter(message => !message.deleted);
    const currentMessages = this.props.messages.filter(
      message => !message.deleted
    );
    const switchedChannel =
      prevProps.currentChannelId !== this.props.currentChannelId;
    const newMessageArrived =
      prevMessages.length >= 0 &&
      prevMessages.length < currentMessages.length &&
      (prevMessages[0] ? prevMessages[0].id === currentMessages[0].id : false);
    const messageDeleted =
      prevProps.currentChannelId === this.props.currentChannelId &&
      prevMessages.length > currentMessages.length;
    if (switchedChannel) {
      this.setState({
        fillerHeight:
          this.messagesContainer.offsetHeight > this.messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
            : 0
      });
      this.setScrollToBottom();
      return setTimeout(() => this.setScrollToBottom(), 300);
    }
    if (messageDeleted) {
      return this.setState({
        fillerHeight:
          this.messagesContainer.offsetHeight > this.messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
            : 0
      });
    }
    if (newMessageArrived) {
      const messageSenderId =
        currentMessages[currentMessages.length - 1].userId;
      if (messageSenderId !== userId && !scrollAtBottom) {
        this.setState({ newUnseenMessage: true });
      } else {
        this.setState({
          fillerHeight:
            this.messagesContainer.offsetHeight > this.messages.offsetHeight
              ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
              : 0
        });
        this.setScrollToBottom();
      }
    }
  }

  render() {
    const { className, loadMoreButton, loading, currentChannelId } = this.props;
    const {
      deleteModal,
      loadMoreButtonLock,
      newUnseenMessage,
      subjectMsgsModal
    } = this.state;
    return (
      <>
        {subjectMsgsModal.shown && (
          <SubjectMsgsModal
            subjectId={subjectMsgsModal.subjectId}
            subjectTitle={subjectMsgsModal.content}
            onHide={() =>
              this.setState({
                subjectMsgsModal: { shown: false, subjectId: null, content: '' }
              })
            }
          />
        )}
        <div className={className}>
          {loading && <Loading />}
          <div
            ref={ref => (this.messagesContainer = ref || {})}
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              bottom: '0',
              opacity: loading && '0.3',
              top: currentChannelId === 2 ? '7rem' : 0,
              overflowY: 'scroll'
            }}
            onScroll={() => {
              const content = this.content;
              const container = this.messagesContainer;
              if (scrollIsAtTheBottom(content, container)) {
                this.setState({ newUnseenMessage: false });
              }
            }}
          >
            <div
              ref={ref => {
                this.content = ref || {};
              }}
              style={{ width: '100%' }}
            >
              {loadMoreButton ? (
                <div
                  style={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <Button
                    filled
                    info
                    disabled={loadMoreButtonLock}
                    onClick={this.onLoadMoreButtonClick}
                  >
                    Load More
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    height: this.state.fillerHeight + 'px'
                  }}
                />
              )}
              <div
                ref={ref => {
                  this.messages = ref || {};
                }}
              >
                {this.renderMessages()}
              </div>
            </div>
          </div>
          {!loading && currentChannelId === 2 && <SubjectHeader />}
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {newUnseenMessage && (
              <Button
                filled
                warning
                onClick={() => {
                  this.setState({ newUnseenMessage: false });
                  const content = this.content;
                  const container = this.messagesContainer;
                  container.scrollTop = Math.max(
                    container.offsetHeight,
                    content.offsetHeight
                  );
                }}
              >
                New Message
              </Button>
            )}
          </div>
          {deleteModal.shown && (
            <ConfirmModal
              onHide={() =>
                this.setState({
                  deleteModal: { shown: false, messageId: null }
                })
              }
              title="Remove Message"
              onConfirm={this.onDelete}
            />
          )}
        </div>
      </>
    );
  }

  onDelete = async() => {
    const { deleteMessage } = this.props;
    const { messageId } = this.state.deleteModal;
    try {
      await deleteMessage(messageId);
      this.setState({
        deleteModal: { shown: false, messageId: null }
      });
    } catch (error) {
      console.error(error);
    }
  };

  onLoadMoreButtonClick = async() => {
    const messageId = this.props.messages[0].id;
    const channelId = this.props.messages[0].channelId;
    const { userId, loadMoreMessages } = this.props;
    const { loadMoreButtonLock } = this.state;
    if (!loadMoreButtonLock) {
      this.setState({ loadMoreButtonLock: true });
      await loadMoreMessages(userId, messageId, channelId);
      this.setState({ loadMoreButtonLock: false });
    }
  };

  renderMessages = () => {
    const { messages } = this.props;
    return messages.map((message, index) => {
      let { isNotification } = message;
      let messageStyle = isNotification ? { color: Color.gray() } : null;
      return message.deleted ? null : (
        <Message
          key={message.id || 'newMessage' + index}
          onDelete={this.onShowDeleteModal}
          index={index}
          style={messageStyle}
          message={message}
          isLastMsg={index === messages.length - 1}
          setScrollToBottom={this.setScrollToBottom}
          showSubjectMsgsModal={({ subjectId, content }) =>
            this.setState({
              subjectMsgsModal: { shown: true, subjectId, content }
            })
          }
        />
      );
    });
  };

  onShowDeleteModal = messageId => {
    this.setState({
      deleteModal: {
        shown: true,
        messageId
      }
    });
  };

  setScrollToBottom = () => {
    this.messagesContainer.scrollTop = Math.max(
      this.state.maxScroll,
      this.messagesContainer.offsetHeight || 0,
      this.state.fillerHeight + this.messages.offsetHeight
    );
    this.setState({ maxScroll: this.messagesContainer.scrollTop });
  };
}

export default connect(
  null,
  { deleteMessage }
)(MessagesContainer);
