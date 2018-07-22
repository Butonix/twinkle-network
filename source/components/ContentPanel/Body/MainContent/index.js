import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { cleanString, stringIsEmpty } from 'helpers/stringHelpers'
import { Color } from 'constants/css'
import Embedly from 'components/Embedly'
import LongText from 'components/Texts/LongText'
import VideoPlayer from 'components/VideoPlayer'
import ContentEditor from '../ContentEditor'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'

MainContent.propTypes = {
  contentObj: PropTypes.object,
  contentId: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditContent: PropTypes.func.isRequired,
  onEditDismiss: PropTypes.func.isRequired,
  rootObj: PropTypes.object,
  urlRelated: PropTypes.object,
  type: PropTypes.string.isRequired
}
export default function MainContent({
  contentObj,
  contentId,
  isEditing,
  onEditContent,
  onEditDismiss,
  rootObj,
  urlRelated,
  type
}) {
  return (
    <ErrorBoundary>
      <div>
        {(type === 'video' || type === 'discussion') && (
          <VideoPlayer
            stretch
            isStarred={!!(contentObj.isStarred || rootObj.isStarred)}
            onEdit={isEditing}
            title={contentObj.title || rootObj.title}
            hasHqThumb={
              typeof contentObj.hasHqThumb === 'number'
                ? contentObj.hasHqThumb
                : rootObj.hasHqThumb
            }
            videoId={type === 'video' ? contentObj.id : contentObj.rootId}
            videoCode={type === 'video' ? contentObj.content : rootObj.content}
            style={{ paddingBottom: '0.5rem' }}
          />
        )}
        <div
          style={{
            marginTop: type !== 'question' && '1rem',
            marginBottom: type !== 'video' && '1rem',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBrea: 'break-word',
            fontSize: '1.6rem'
          }}
        >
          {!isEditing && (
            <Fragment>
              {type === 'comment' && (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  <LongText>{contentObj.content}</LongText>
                </div>
              )}
              {type === 'question' && (
                <div className="question">
                  <span style={{ color: Color.green() }}>Question: </span>
                  <span style={{ color: Color.darkGray() }}>
                    {cleanString(contentObj.content)}
                  </span>
                </div>
              )}
              {type === 'discussion' && (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                      fontSize: '2.5rem',
                      marginBottom: '1rem',
                      color: Color.green()
                    }}
                  >
                    Discuss:
                  </p>
                  <h3 style={{ marginBottom: '1rem' }}>
                    {cleanString(contentObj.title)}
                  </h3>
                </div>
              )}
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  marginBottom:
                    type === 'url' || type === 'question' ? '1rem' : '0.5rem'
                }}
              >
                <LongText>
                  {!stringIsEmpty(contentObj.description)
                    ? contentObj.description
                    : type === 'video' || type === 'url'
                      ? contentObj.title
                      : ''}
                </LongText>
              </div>
            </Fragment>
          )}
          {isEditing && (
            <ContentEditor
              comment={contentObj.content}
              content={contentObj.content || contentObj.rootContent}
              contentId={contentId}
              description={contentObj.description}
              onDismiss={onEditDismiss}
              onEditContent={onEditContent}
              style={{
                marginTop: (type === 'video' || type === 'discussion') && '1rem'
              }}
              title={contentObj.title}
              type={type}
            />
          )}
        </div>
        {!isEditing &&
          type === 'url' && (
            <Embedly
              title={cleanString(contentObj.title)}
              url={contentObj.content}
              id={contentObj.contentId}
              {...urlRelated}
            />
          )}
        {type === 'comment' &&
          contentObj.rootType === 'url' && (
            <Embedly
              small
              title={cleanString(rootObj.title)}
              url={rootObj.content}
              id={contentObj.rootId}
              {...urlRelated}
            />
          )}
      </div>
    </ErrorBoundary>
  )
}