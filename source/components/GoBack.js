import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { withRouter } from 'react-router';
import { useMyState } from 'helpers/hooks';

GoBack.propTypes = {
  history: PropTypes.object.isRequired
};
function GoBack({ history }) {
  const { profileTheme } = useMyState();
  return useMemo(
    () => (
      <div
        className={css`
          background: #fff;
          border-bottom: 1px solid ${Color.borderGray()};
          font-size: 2rem;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          height: 100%;
          display: flex;
          padding: 1rem;
          align-items: center;
          transition: background 0.4s;
          &:hover {
            background: ${Color[profileTheme]()};
            color: #fff;
          }
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 3rem;
            &:hover {
              background: #fff;
              color: #000;
            }
          }
        `}
        onClick={() => history.goBack()}
      >
        <span>
          <Icon icon="arrow-left" /> Go Back
        </span>
      </div>
    ),
    [profileTheme]
  );
}

export default withRouter(GoBack);
