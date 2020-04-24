import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import ReactPlayer from 'react-player';
import ExtractedThumb from 'components/ExtractedThumb';
import Icon from 'components/Icon';
import { v1 as uuidv1 } from 'uuid';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';
import { isMobile } from 'helpers';
import { useAppContext, useContentContext } from 'contexts';

FileViewer.propTypes = {
  autoPlay: PropTypes.bool,
  contentId: PropTypes.number,
  contextType: PropTypes.string.isRequired,
  isMuted: PropTypes.bool,
  isThumb: PropTypes.bool,
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  modalOverModal: PropTypes.bool,
  style: PropTypes.object,
  thumbUrl: PropTypes.string,
  videoHeight: PropTypes.string
};

export default function FileViewer({
  autoPlay,
  contentId,
  contextType,
  isMuted = true,
  isThumb,
  filePath,
  fileName,
  fileSize,
  modalOverModal,
  style,
  thumbUrl,
  videoHeight
}) {
  const {
    requestHelpers: { uploadThumb }
  } = useAppContext();
  const {
    actions: { onSetThumbUrl }
  } = useContentContext();
  const mobile = isMobile(navigator);
  const [muted, setMuted] = useState(isMuted);
  const PlayerRef = useRef(null);
  const { fileType } = getFileInfoFromFileName(fileName);
  const src = `${cloudFrontURL}/attachments/${contextType}/${filePath}/${encodeURIComponent(
    fileName
  )}`;

  return (
    <div
      style={{
        width: '100%',
        padding:
          !isThumb && !['image', 'video', 'audio'].includes(fileType)
            ? '1rem'
            : '',
        ...style
      }}
    >
      {fileType === 'image' ? (
        <ImagePreview
          isThumb={isThumb}
          modalOverModal={modalOverModal}
          src={src}
          fileName={fileName}
        />
      ) : fileType === 'video' || fileType === 'audio' ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {!isThumb && (
            <div
              style={{
                width: '100%',
                padding: contextType === 'feed' && '0 1rem 0 1rem'
              }}
            >
              <a
                style={{ fontWeight: 'bold' }}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fileName}
              </a>
            </div>
          )}
          <div
            style={{
              marginTop: isThumb ? 0 : '1rem',
              width: '100%',
              position: 'relative',
              paddingTop:
                fileType === 'video'
                  ? '56.25%'
                  : fileType === 'audio'
                  ? '3rem'
                  : ''
            }}
            onClick={handlePlayerClick}
          >
            {contextType === 'chat' && (
              <ExtractedThumb
                src={src}
                isHidden
                onThumbnailLoad={handleThumbnailLoad}
                thumbUrl={thumbUrl}
              />
            )}
            <ReactPlayer
              loop={!mobile && autoPlay && muted}
              ref={PlayerRef}
              playing={!mobile && autoPlay}
              playsInline
              muted={(!mobile && autoPlay && muted) || isThumb}
              style={{
                cursor: muted ? 'pointer' : 'default',
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                paddingBottom:
                  fileType === 'audio' || fileType === 'video' ? '1rem' : 0
              }}
              width="100%"
              height={fileType === 'video' ? videoHeight || '100%' : '5rem'}
              url={src}
              controls={(!isThumb && mobile) || !muted || !autoPlay}
            />
            {!isThumb && !mobile && autoPlay && muted && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '5rem',
                  fontWeight: 'bold',
                  background: '#fff',
                  color: '#000',
                  position: 'absolute',
                  top: '0',
                  fontSize: '2rem',
                  padding: '1rem'
                }}
              >
                <Icon size="lg" icon="volume-mute" />
                <span style={{ marginLeft: '0.7rem' }}>TAP TO UNMUTE</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <FileInfo
          isThumb={isThumb}
          fileName={fileName}
          fileType={fileType}
          fileSize={fileSize}
          src={src}
        />
      )}
    </div>
  );

  function handlePlayerClick() {
    if (!mobile && muted && autoPlay) {
      setMuted(false);
      PlayerRef.current.getInternalPlayer()?.pause();
    }
  }

  function handleThumbnailLoad(thumb) {
    const dataUri = thumb.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataUri, 'base64');
    const file = new File([buffer], 'thumb.png');
    handleUploadThumb();

    async function handleUploadThumb() {
      const thumbUrl = await uploadThumb({
        contentType: 'chat',
        contentId,
        file,
        path: uuidv1()
      });
      onSetThumbUrl({
        contentId,
        contentType: 'chat',
        thumbUrl
      });
    }
  }
}
