import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import DropdownButton from 'components/Buttons/DropdownButton';
import LongText from 'components/Texts/LongText';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import AlreadyPosted from 'components/AlreadyPosted';
import { timeSince } from 'helpers/timeStampHelpers';
import {
  cleanString,
  exceedsCharLimit,
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
import { css } from 'emotion';
import { useAppContext } from 'context';

Description.propTypes = {
  content: PropTypes.string,
  description: PropTypes.string,
  linkId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.string.isRequired,
  userCanEditThis: PropTypes.bool,
  uploader: PropTypes.object,
  userIsUploader: PropTypes.bool,
  url: PropTypes.string.isRequired
};

export default function Description({
  content,
  description,
  onDelete,
  onEditDone,
  linkId,
  timeStamp,
  title,
  uploader,
  url,
  userCanEditThis,
  userIsUploader
}) {
  const {
    user: {
      state: { canDelete, canEdit }
    }
  } = useAppContext();
  const [editedTitle, setEditedTitle] = useState(cleanString(title));
  const [editedUrl, setEditedUrl] = useState(content);
  const [editedDescription, setEditedDescription] = useState(description);
  const [onEdit, setOnEdit] = useState(false);
  const descriptionExceedsCharLimit = exceedsCharLimit({
    contentType: 'url',
    inputType: 'description',
    text: editedDescription
  });
  const titleExceedsCharLimit = exceedsCharLimit({
    contentType: 'url',
    inputType: 'title',
    text: editedTitle
  });
  const urlExceedsCharLimit = exceedsCharLimit({
    contentType: 'url',
    inputType: 'url',
    text: editedUrl
  });
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () => setOnEdit(true)
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
      {editButtonShown && !onEdit && (
        <DropdownButton
          skeuomorphic
          color="darkerGray"
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
                className={css`
                  width: 80%;
                `}
                style={titleExceedsCharLimit?.style}
                placeholder="Enter Title..."
                value={editedTitle}
                onChange={text => {
                  setEditedTitle(text);
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    setEditedTitle(addEmoji(event.target.value));
                  }
                }}
              />
              {titleExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {titleExceedsCharLimit.message}
                </small>
              )}
            </>
          ) : (
            <h2>{title}</h2>
          )}
        </div>
        <div>
          <small>
            Added by <UsernameText user={uploader} /> ({timeSince(timeStamp)})
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
          contentType="url"
          url={url}
          uploaderId={uploader.id}
        />
        {onEdit ? (
          <div>
            <Input
              placeholder="Enter URL"
              className={css`
                margin-bottom: '1rem';
              `}
              style={urlExceedsCharLimit?.style}
              value={editedUrl}
              onChange={text => {
                setEditedUrl(text);
              }}
            />
            <Textarea
              minRows={4}
              placeholder="Enter Description"
              value={editedDescription}
              onChange={event => {
                setEditedDescription(event.target.value);
              }}
              onKeyUp={event => {
                if (event.key === ' ') {
                  setEditedDescription(addEmoji(event.target.value));
                }
              }}
              style={{
                marginTop: '1rem',
                ...(descriptionExceedsCharLimit?.style || {})
              }}
            />
            {descriptionExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {descriptionExceedsCharLimit?.message}
              </small>
            )}
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <Button
                transparent
                style={{ marginRight: '1rem' }}
                onClick={onEditCancel}
              >
                Cancel
              </Button>
              <Button
                color="blue"
                disabled={determineEditButtonDoneStatus()}
                onClick={onEditFinish}
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

  function determineEditButtonDoneStatus() {
    const urlIsEmpty = stringIsEmpty(editedUrl);
    const urlIsValid = isValidUrl(editedUrl);
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== title;
    const urlChanged = editedUrl !== url;
    const descriptionChanged = editedDescription !== description;
    if (!urlIsValid) return true;
    if (urlIsEmpty) return true;
    if (titleIsEmpty) return true;
    if (!titleChanged && !descriptionChanged && !urlChanged) return true;
    if (titleExceedsCharLimit) return true;
    if (descriptionExceedsCharLimit) return true;
    if (urlExceedsCharLimit) return true;
    return false;
  }

  function onEditCancel() {
    setEditedUrl(url);
    setEditedTitle(cleanString(title));
    setEditedDescription(description);
    setOnEdit(false);
  }

  async function onEditFinish() {
    await onEditDone({
      editedUrl,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      contentId: linkId,
      contentType: 'url'
    });
    setOnEdit(false);
  }
}
