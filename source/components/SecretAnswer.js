import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import { connect } from 'react-redux';
import { borderRadius, Color } from 'constants/css';
import { checkIfUserResponded } from 'helpers/requestHelpers';
import { useAppContext } from 'context';

SecretAnswer.propTypes = {
  answer: PropTypes.string.isRequired,
  changeSpoilerStatus: PropTypes.func.isRequired,
  shown: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  subjectId: PropTypes.number,
  userId: PropTypes.number
};

function SecretAnswer({
  answer,
  shown,
  userId,
  onClick,
  changeSpoilerStatus,
  style,
  subjectId
}) {
  const {
    view: {
      state: { pageVisible }
    }
  } = useAppContext();
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    if (userId) {
      init();
    } else {
      changeSpoilerStatus({ shown: false, subjectId });
    }

    async function init() {
      if (!shown) {
        const { responded } = await checkIfUserResponded(subjectId);
        if (mounted.current) {
          changeSpoilerStatus({ shown: responded, subjectId });
        }
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [pageVisible, userId]);

  return (
    <ErrorBoundary>
      <div
        onClick={shown ? () => {} : onClick}
        style={{
          cursor: shown ? '' : 'pointer',
          fontSize: '1.7rem',
          background: shown ? Color.ivory() : Color.darkerGray(),
          border: `1px solid ${shown ? Color.borderGray() : Color.black()}`,
          borderRadius,
          color: shown ? Color.black() : '#fff',
          textAlign: shown ? '' : 'center',
          padding: '1rem',
          ...style
        }}
      >
        {shown && <LongText>{answer}</LongText>}
        {!shown && (
          <span>Submit your response to view the secret message. Tap here</span>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(SecretAnswer);
