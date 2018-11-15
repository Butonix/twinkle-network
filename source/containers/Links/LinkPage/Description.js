import PropTypes from 'prop-types';
import React, { Component } from 'react';
import UsernameText from 'components/Texts/UsernameText';
import DropdownButton from 'components/Buttons/DropdownButton';
import { timeSince } from 'helpers/timeStampHelpers';
import LongText from 'components/Texts/LongText';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import AlreadyPosted from 'components/AlreadyPosted';
import {
  cleanString,
  exceedsCharLimit,
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';
import { connect } from 'react-redux';
import { css } from 'emotion';

class Description extends Component {
  static propTypes = {
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    description: PropTypes.string,
    linkId: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    userCanEditThis: PropTypes.bool,
    uploaderId: PropTypes.number,
    uploaderName: PropTypes.string,
    userIsUploader: PropTypes.bool,
    url: PropTypes.string.isRequired
  };

  constructor({ title, content, description }) {
    super();
    this.state = {
      editedTitle: cleanString(title),
      editedUrl: content,
      editedDescription: description,
      onEdit: false
    };
  }

  render() {
    const {
      canDelete,
      canEdit,
      linkId,
      title,
      description,
      userCanEditThis,
      uploaderName,
      timeStamp,
      onDelete,
      uploaderId,
      url,
      userIsUploader
    } = this.props;
    const { onEdit, editedTitle, editedDescription, editedUrl } = this.state;
    const editButtonShown = userIsUploader || userCanEditThis;
    const editMenuItems = [];
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ onEdit: true })
      });
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Delete',
        onClick: onDelete
      });
    }
    return (
      <div style={{ position: 'relative', padding: '2rem 1rem 0 1rem' }}>
        {editButtonShown &&
          !onEdit && (
            <DropdownButton
              snow
              opacity={0.8}
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              direction="left"
              menuProps={editMenuItems}
            />
          )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            {onEdit ? (
              <>
                <Input
                  type="text"
                  className={css`
                    width: 80%;
                  `}
                  style={this.titleExceedsCharLimit(editedTitle)}
                  placeholder="Enter Title..."
                  value={editedTitle}
                  onChange={text => {
                    this.setState({ editedTitle: text });
                  }}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({
                        editedTitle: addEmoji(event.target.value)
                      });
                    }
                  }}
                />
                {this.titleExceedsCharLimit(editedTitle) && (
                  <small style={{ color: 'red' }}>
                    {renderCharLimit({
                      contentType: 'url',
                      inputType: 'title',
                      text: editedTitle
                    })}
                  </small>
                )}
              </>
            ) : (
              <h2>{title}</h2>
            )}
          </div>
          <div>
            <small>
              Added by{' '}
              <UsernameText user={{ id: uploaderId, username: uploaderName }} />{' '}
              ({timeSince(timeStamp)})
            </small>
          </div>
        </div>
        <div
          style={{
            marginTop: '2rem',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
        >
          <AlreadyPosted
            style={{
              marginLeft: '-1rem',
              marginRight: '-1rem'
            }}
            contentId={Number(linkId)}
            type="url"
            url={url}
            uploaderId={uploaderId}
          />
          {onEdit ? (
            <div>
              <Input
                placeholder="Enter URL"
                className={css`
                  margin-bottom: '1rem';
                `}
                style={this.urlExceedsCharLimit(editedUrl)}
                value={editedUrl}
                onChange={text => {
                  this.setState({ editedUrl: text });
                }}
              />
              <Textarea
                minRows={4}
                placeholder="Enter Description"
                value={editedDescription}
                onChange={event => {
                  this.setState({ editedDescription: event.target.value });
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      editedDescription: addEmoji(event.target.value)
                    });
                  }
                }}
                style={{
                  marginTop: '1rem',
                  ...(this.descriptionExceedsCharLimit(editedDescription) || {})
                }}
              />
              {this.descriptionExceedsCharLimit(editedDescription) && (
                <small style={{ color: 'red' }}>
                  {renderCharLimit({
                    contentType: 'url',
                    inputType: 'description',
                    text: editedDescription
                  })}
                </small>
              )}
              <div style={{ justifyContent: 'center', display: 'flex' }}>
                <Button
                  transparent
                  style={{ marginRight: '1rem' }}
                  onClick={this.onEditCancel}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  disabled={this.determineEditButtonDoneStatus()}
                  onClick={this.onEditFinish}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <LongText lines={20}>{description || ''}</LongText>
          )}
        </div>
      </div>
    );
  }

  determineEditButtonDoneStatus = () => {
    const { editedDescription, editedTitle, editedUrl } = this.state;
    const urlIsEmpty = stringIsEmpty(editedUrl);
    const urlIsValid = isValidUrl(editedUrl);
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== this.props.title;
    const urlChanged = this.state.editedUrl !== this.props.url;
    const descriptionChanged = editedDescription !== this.props.description;
    if (!urlIsValid) return true;
    if (urlIsEmpty) return true;
    if (titleIsEmpty) return true;
    if (!titleChanged && !descriptionChanged && !urlChanged) return true;
    if (this.titleExceedsCharLimit(editedTitle)) return true;
    if (this.descriptionExceedsCharLimit(editedDescription)) return true;
    if (this.urlExceedsCharLimit(editedUrl)) return true;
    return false;
  };

  onEditCancel = () => {
    const { description, title, url } = this.props;
    this.setState({
      editedUrl: url,
      editedTitle: cleanString(title),
      editedDescription: description,
      onEdit: false,
      editDoneButtonDisabled: true
    });
  };

  onEditFinish = () => {
    const { onEditDone, linkId } = this.props;
    const { editedTitle, editedDescription, editedUrl } = this.state;
    return onEditDone({
      editedUrl,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      linkId
    }).then(() => this.setState({ onEdit: false }));
  };

  descriptionExceedsCharLimit = description => {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'description',
      text: description
    });
  };

  titleExceedsCharLimit = title => {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'title',
      text: title
    });
  };

  urlExceedsCharLimit = url => {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'url',
      text: url
    });
  };
}

export default connect(state => ({
  canDelete: state.UserReducer.canDelete,
  canEdit: state.UserReducer.canEdit
}))(Description);
