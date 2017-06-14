import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ProfileCard from '../ProfileCard'
import Body from './Body'
import ExecutionEnvironment from 'exenv'
import {connect} from 'react-redux'
import {checkValidUsername, unmountProfile} from 'redux/actions/UserActions'
import NotFound from 'components/NotFound'
import Loading from 'components/Loading'
import {browserHistory} from 'react-router'

@connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId,
    profile: state.UserReducer.profile
  }),
  {checkValidUsername, unmountProfile}
)
export default class Profile extends Component {
  static propTypes = {
    checkValidUsername: PropTypes.func,
    match: PropTypes.object,
    userId: PropTypes.number,
    profile: PropTypes.object,
    username: PropTypes.string
  }

  constructor(props) {
    super()
    const {checkValidUsername, match} = props
    const {username} = match.params
    if (ExecutionEnvironment.canUseDOM) checkValidUsername(username)
  }

  componentDidUpdate(prevProps) {
    const {checkValidUsername, userId, profile: {unavailable}, match} = this.props
    if (ExecutionEnvironment.canUseDOM) {
      if (prevProps.match.params.username !== match.params.username) {
        return checkValidUsername(match.params.username)
      }

      if (match.params.username === 'undefined' && !prevProps.userId && !!userId && !!unavailable) {
        browserHistory.push(`/${this.props.username}`)
      }
    }
  }

  render() {
    const {profile: {unavailable, id}, userId} = this.props
    return !unavailable ? (
      <div style={{width: '100%'}}>
        {!id && <Loading text="Loading Profile..." />}
        {!!id &&
          <div style={{width: '100%'}}>
            <ProfileCard {...this.props} />
            <Body {...this.props} />
          </div>
        }
      </div>
    ) : <NotFound title={!userId && 'For Registered Users Only'} text={!userId && 'Please Log In or Sign Up'} />
  }
}
