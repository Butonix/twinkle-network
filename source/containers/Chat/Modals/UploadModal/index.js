import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';
import File from './File';
import { exceedsCharLimit } from 'helpers/stringHelpers';
// import { uploadFileData } from 'helpers/requestHelpers';
import { submitMessageAsync } from 'redux/actions/ChatActions';
import { connect } from 'react-redux';

UploadModal.propTypes = {
  channelId: PropTypes.number,
  fileObj: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string,
  profilePicId: PropTypes.number,
  submitMessage: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};

function UploadModal({
  channelId,
  dispatch,
  fileObj,
  onHide,
  submitMessage,
  userId,
  username,
  profilePicId
}) {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  useEffect(() => {
    setSelectedFile(fileObj);
  }, []);
  const captionExceedsCharLimit = exceedsCharLimit({
    inputType: 'message',
    contentType: 'chat',
    text: caption
  });

  return (
    <Modal onHide={onHide}>
      <header>Upload a file</header>
      <main>
        {fileObj ? (
          <File
            caption={caption}
            captionExceedsCharLimit={captionExceedsCharLimit}
            fileObj={fileObj}
            onCaptionChange={setCaption}
          />
        ) : (
          <Loading />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={captionExceedsCharLimit}
          color="blue"
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </footer>
    </Modal>
  );

  async function handleSubmit() {
    submitMessage({
      userId,
      username,
      profilePicId,
      channelId,
      fileToUpload: selectedFile
    });
    /*
    const data = await uploadFileData({
      dispatch,
      selectedFile,
      onUploadProgress: handleUploadProgress
    });
    console.log(data);
    */
  }

  /*
  function handleUploadProgress({ loaded, total }) {
    console.log((loaded * 100) / total, 'new');
  }
  */
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId
  }),
  dispatch => ({
    dispatch,
    submitMessage: params => dispatch(submitMessageAsync(params))
  })
)(UploadModal);
