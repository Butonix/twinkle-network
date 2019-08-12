import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Message from '../Message';
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
    channelName: PropTypes.string,
    chessCountdownObj: PropTypes.object,
    chessOpponent: PropTypes.object,
    className: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    currentChannel: PropTypes.object,
    currentChannelId: PropTypes.number.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    loadMoreButton: PropTypes.bool,
    messages: PropTypes.array,
    loadMoreMessages: PropTypes.func,
    loading: PropTypes.bool,
    onChessBoardClick: PropTypes.func,
    onChessSpoilerClick: PropTypes.func,
    onSendFileMessage: PropTypes.func.isRequired,
    selectedChannelId: PropTypes.number,
    recepientId: PropTypes.number,
    statusText: PropTypes.string
  };

  state = {
    deleteModal: {
      shown: false,
      fileName: '',
      filePath: '',
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
    setTimeout(() => this.setScrollToBottom(), 500);
  }

  getSnapshotBeforeUpdate() {
    return scrollIsAtTheBottom(this.content, this.messagesContainer);
  }

  componentDidUpdate(prevProps, prevState, scrollAtBottom) {
    const { userId } = this.props;
    const prevMessages = prevProps.messages;
    const currentMessages = this.props.messages;
    const switchedChannel =
      prevProps.currentChannel?.id !== this.props.currentChannel?.id;
    const newMessageArrived =
      prevMessages.length >= 0 &&
      prevMessages.length < currentMessages.length &&
      (prevMessages[0] ? prevMessages[0].id === currentMessages[0].id : false);
    const statusTextAppeared = !prevProps.statusText && this.props.statusText;
    const messageDeleted =
      prevProps.currentChannelId === this.props.currentChannelId &&
      prevMessages.length > currentMessages.length;
    const firstMessagePosted =
      prevProps.messages.length === 0 && currentMessages.length === 1;
    if (switchedChannel) {
      this.setState({
        fillerHeight:
          this.messagesContainer.offsetHeight > this.messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
            : 0
      });
      this.setScrollToBottom();
      return setTimeout(() => this.setScrollToBottom(), 500);
    }
    if (messageDeleted) {
      return this.setState({
        fillerHeight:
          this.messagesContainer.offsetHeight > this.messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
            : 0
      });
    }
    if (newMessageArrived || statusTextAppeared) {
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
    if (firstMessagePosted) {
      this.setScrollToBottom();
    }
  }

  render() {
    const {
      className,
      loadMoreButton,
      loading,
      currentChannelId,
      statusText
    } = this.props;
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
                    color="lightBlue"
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
              {statusText && (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center'
                  }}
                >
                  {statusText}
                </div>
              )}
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
                color="orange"
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
                  deleteModal: { shown: false, filePath: '', messageId: null }
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

  onDelete = async () => {
    const { deleteMessage } = this.props;
    const { fileName, filePath, messageId } = this.state.deleteModal;
    try {
      await deleteMessage({ fileName, filePath, messageId });
      this.setState({
        deleteModal: {
          shown: false,
          fileName: '',
          filePath: '',
          messageId: null
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  onLoadMoreButtonClick = async () => {
    const messageId = this.props.messages[0].id;
    const channelId = this.props.messages[0].channelId;
    const { userId, loadMoreMessages } = this.props;
    const { loadMoreButtonLock } = this.state;
    if (!loadMoreButtonLock) {
      this.setState({ loadMoreButtonLock: true });
      await loadMoreMessages({ userId, messageId, channelId });
      this.setState({ loadMoreButtonLock: false });
    }
  };

  renderMessages = () => {
    const {
      channelName,
      chessCountdownObj,
      chessOpponent,
      messages,
      onChessBoardClick,
      onChessSpoilerClick,
      onSendFileMessage,
      selectedChannelId,
      recepientId
    } = this.props;
    return messages.map((message, index) => {
      let { isNotification } = message;
      return (
        <Message
          key={message.id || 'newMessage' + index}
          channelId={selectedChannelId}
          channelName={channelName}
          chessCountdownObj={chessCountdownObj}
          chessOpponent={chessOpponent}
          checkScrollIsAtTheBottom={() =>
            scrollIsAtTheBottom(this.content, this.messagesContainer)
          }
          onDelete={this.onShowDeleteModal}
          index={index}
          onChessBoardClick={onChessBoardClick}
          onChessSpoilerClick={onChessSpoilerClick}
          onSendFileMessage={onSendFileMessage}
          isNotification={!!isNotification}
          message={message}
          isLastMsg={index === messages.length - 1}
          recepientId={recepientId}
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

  onShowDeleteModal = ({ fileName, filePath, messageId }) => {
    this.setState({
      deleteModal: {
        shown: true,
        fileName,
        filePath,
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
