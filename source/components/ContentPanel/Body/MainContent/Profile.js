import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import RankBar from 'components/RankBar'
import UserDetails from 'components/UserDetails'
import Link from 'components/Link'
import { css } from 'emotion'
import { connect } from 'react-redux'

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  userId: PropTypes.number
}
function Profile({ profile, userId }) {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Link to={`/users/${profile.username}`}>
          <ProfilePic
            style={{ width: '15rem', height: '15rem' }}
            userId={profile.id}
            profilePicId={profile.profilePicId}
            online={userId === profile.id || !!profile.online}
            large
          />
        </Link>
        <UserDetails
          small
          unEditable
          profile={profile}
          style={{ width: 'CALC(100% - 18rem)', marginLeft: '1rem' }}
          userId={userId}
        />
      </div>
      {!!profile.twinkleXP && (
        <RankBar
          profile={profile}
          style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
        />
      )}
    </div>
  )
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(Profile)