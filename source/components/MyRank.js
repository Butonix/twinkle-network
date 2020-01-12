import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { Color, borderRadius } from 'constants/css';
import { css } from 'emotion';

MyRank.propTypes = {
  myId: PropTypes.number,
  noBorderRadius: PropTypes.bool,
  rank: PropTypes.number,
  style: PropTypes.object,
  twinkleXP: PropTypes.number
};

export default function MyRank({
  myId,
  noBorderRadius,
  rank,
  style,
  twinkleXP
}) {
  const rankedColor = useMemo(
    () =>
      rank === 1
        ? Color.gold()
        : rank === 2
        ? '#fff'
        : rank === 3
        ? Color.bronze()
        : undefined,
    [rank]
  );
  return (
    <div
      style={{
        marginTop: '1rem',
        marginBottom: myId ? '1rem' : 0,
        borderBottom:
          !(rank > 0 && rank < 4) && noBorderRadius
            ? `1px solid ${Color.borderGray()}`
            : '',
        background: myId
          ? rank > 0
            ? rank < 4
              ? Color.black()
              : '#fff'
            : '#fff'
          : null,
        ...style
      }}
      className={css`
        width: 100%;
        margin-bottom: 0px;
        text-align: center;
        padding: 1rem;
        border: ${(rank > 0 && rank < 4) || noBorderRadius
          ? ''
          : `1px solid ${Color.borderGray()}`};
        border-radius: ${!noBorderRadius ? borderRadius : ''};
        p {
          font-weight: bold;
        }
        a {
          font-size: 1.5rem;
          font-weight: bold;
        }
      `}
    >
      {
        <p>
          <span
            style={{
              color: rankedColor || Color.logoGreen(),
              fontSize: twinkleXP > 1000000 ? '2.8rem' : '3rem'
            }}
          >
            {twinkleXP ? addCommasToNumber(twinkleXP) : 0}
          </span>{' '}
          <span
            style={{
              color: rankedColor || Color.gold(),
              fontSize: twinkleXP > 1000000 ? '2.8rem' : '3rem'
            }}
          >
            XP
          </span>
          &nbsp;&nbsp;
          <span
            style={{
              color:
                rankedColor ||
                (rank > 0 && rank <= 10 ? Color.pink() : Color.darkGray()),
              fontSize: twinkleXP > 1000000 ? '1.7rem' : '2rem'
            }}
          >
            {rank ? `Rank #${rank}` : 'Unranked'}
          </span>
        </p>
      }
    </div>
  );
}
