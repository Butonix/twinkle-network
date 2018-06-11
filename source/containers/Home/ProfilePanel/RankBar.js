import React from 'react'
import PropTypes from 'prop-types'
import { addCommasToNumber } from 'helpers/stringHelpers'
import { borderRadius, mobileMaxWidth, Color } from 'constants/css'
import { css } from 'emotion'

RankBar.propTypes = {
  profile: PropTypes.object.isRequired
}
export default function RankBar({ profile }) {
  const rankColor =
    profile.rank === 1
      ? Color.gold()
      : profile.rank === 2
        ? Color.silver()
        : profile.rank === 3
          ? '#fff'
          : undefined
  return (
    <div
      className={css`
          padding: 1.5rem 0;
          font-size: 2rem;
          color: ${rankColor};
          font-weight: bold;
          text-align: center;
          border-bottom-left-radius: ${borderRadius};
          border-bottom-right-radius: ${borderRadius};
          ${profile.rank > 3 ? `border: 1px solid #e7e7e7;` : ''}
          background: ${
            profile.rank < 3
              ? Color.black(1 - (profile.rank - 1) / 10)
              : profile.rank === 3
                ? Color.orange()
                : Color.whiteGray()
          };
          @media (max-width: ${mobileMaxWidth}) {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        `}
    >
      <span>
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoBlue() : Color.buttonGray())
          }}
        >
          Rank
        </span>{' '}
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoBlue() : Color.buttonGray())
          }}
        >
          #{profile.rank}
        </span>{' '}
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoBlue() : Color.buttonGray())
          }}
        >
          with
        </span>
      </span>{' '}
      <span>
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.logoGreen() : Color.buttonGray())
          }}
        >
          {addCommasToNumber(profile.twinkleXP)}
        </span>{' '}
        <span
          style={{
            color:
              rankColor ||
              (profile.rank <= 10 ? Color.gold() : Color.buttonGray())
          }}
        >
          XP
        </span>
      </span>
    </div>
  )
}
