import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import { Color } from 'constants/css'
import Button from 'components/Button'
import { openSigninModal } from 'redux/actions/UserActions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Details, Heading, Names } from './Styles'

ProfileWidget.propTypes = {
  history: PropTypes.object,
  openSigninModal: PropTypes.func,
  profilePicId: PropTypes.number,
  realName: PropTypes.string,
  twinkleXP: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string
}
function ProfileWidget({
  history,
  openSigninModal,
  twinkleXP,
  userId,
  username,
  profilePicId,
  realName
}) {
  return (
    <div className={Container}>
      {username && (
        <div className={Heading}>
          <ProfilePic
            style={{
              width: '35%',
              height: '35%',
              cursor: userId ? 'pointer' : 'default'
            }}
            userId={userId}
            profilePicId={profilePicId}
            onClick={() => (userId ? history.push(`/users/${username}`) : null)}
          />
          <div className={Names}>
            <div>
              <Link to={`/users/${username}`}>{username}</Link>
            </div>
            {realName && (
              <div>
                <span>({realName})</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={Details}>
        {userId && (
          <div>
            <div style={{ fontWeight: 'bold' }}>
              <span>{twinkleXP || 0}</span>
              &nbsp;<span style={{ color: Color.logoGreen }}>Twin</span>
              <span style={{ color: Color.logoBlue }}>kle</span>
              &nbsp;<span style={{ color: Color.orange }}>XP</span>
            </div>
            <Link to="/twinklexp">Leaderboard</Link>
          </div>
        )}
        {!userId && (
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Log in to access all features!
          </div>
        )}
        {!userId && (
          <Button
            className="btn btn-success"
            style={{ marginTop: '2rem' }}
            onClick={openSigninModal}
          >
            Log In / Sign Up
          </Button>
        )}
      </div>
    </div>
  )
}

export default connect(
  state => ({
    realName: state.UserReducer.realName,
    twinkleXP: state.UserReducer.twinkleXP,
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    profilePicId: state.UserReducer.profilePicId
  }),
  { openSigninModal }
)(ProfileWidget)
