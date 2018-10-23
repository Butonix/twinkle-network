import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import ColorSelector from 'components/ColorSelector';
import Button from 'components/Button';
import AlertModal from 'components/Modals/AlertModal';
import ImageEditModal from 'components/Modals/ImageEditModal';
import {
  changeProfileTheme,
  uploadProfilePic
} from 'redux/actions/UserActions';
import { setTheme } from 'helpers/requestHelpers';
import { borderRadius, Color } from 'constants/css';
import { profileThemes } from 'constants/defaultValues';
import Icon from 'components/Icon';
import { connect } from 'react-redux';

class Cover extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      online: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      profilePicId: PropTypes.number,
      profileTheme: PropTypes.string,
      realName: PropTypes.string,
      username: PropTypes.string
    }),
    onSelectColor: PropTypes.func.isRequired,
    selectedTheme: PropTypes.string.isRequired,
    uploadProfilePic: PropTypes.func,
    userId: PropTypes.number
  };

  state = {
    alertModalShown: false,
    colorSelectorShown: false,
    imageEditModalShown: false,
    imageUri: null,
    processing: false
  };

  render() {
    const {
      userId,
      profile: {
        id,
        profilePicId,
        online,
        profileTheme = 'logoBlue',
        realName,
        username
      },
      selectedTheme
    } = this.props;
    const {
      alertModalShown,
      colorSelectorShown,
      imageEditModalShown,
      imageUri,
      processing
    } = this.state;
    return (
      <>
        <div
          style={{
            ...profileThemes[profileTheme],
            background: profileThemes[selectedTheme].background,
            height: '23rem',
            marginTop: '-1rem',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative'
          }}
        >
          <div
            style={{
              marginLeft: '30rem',
              color: '#fff',
              fontSize: '5rem',
              paddingTop: '12rem'
            }}
          >
            {username}
            <p style={{ fontSize: '2rem', lineHeight: '1rem' }}>({realName})</p>
          </div>
          <div
            style={{
              background: colorSelectorShown && '#fff',
              borderRadius,
              position: 'absolute',
              padding: '1rem',
              bottom: '1rem',
              right: '1rem'
            }}
          >
            {!colorSelectorShown &&
              id === userId && (
                <Button
                  style={{ marginBottom: '-1rem', marginRight: '-1rem' }}
                  default
                  filled
                  onClick={() => this.setState({ colorSelectorShown: true })}
                >
                  Change Theme
                </Button>
              )}
            {id !== userId && (
              <div
                style={{
                  background: '#fff',
                  marginBottom: '-1rem',
                  marginRight: '-1rem',
                  borderRadius
                }}
              >
                <Button
                  style={{ width: '100%', color: Color[selectedTheme]() }}
                  snow
                  onClick={() => this.setState({ colorSelectorShown: true })}
                >
                  <Icon icon="comments" />
                  <span style={{ marginLeft: '0.7rem' }}>
                    Chat with {username}
                  </span>
                </Button>
              </div>
            )}
            {colorSelectorShown &&
              id === userId && (
                <>
                  <ColorSelector
                    colors={['logoBlue', 'green', 'orange', 'pink']}
                    setColor={this.onSelectColor}
                    selectedColor={selectedTheme}
                    style={{
                      width: '100%',
                      height: 'auto',
                      justifyContent: 'center'
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      marginTop: '1rem',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button
                      style={{ fontSize: '1.2rem', marginRight: '1rem' }}
                      snow
                      onClick={this.onColorSelectCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ fontSize: '1.2rem' }}
                      primary
                      filled
                      onClick={this.onSetTheme}
                    >
                      Change
                    </Button>
                  </div>
                </>
              )}
          </div>
          <input
            ref={ref => {
              this.fileInput = ref;
            }}
            style={{ display: 'none' }}
            type="file"
            onChange={this.handlePicture}
            accept="image/*"
          />
        </div>
        <ProfilePic
          isProfilePage
          style={{
            position: 'absolute',
            width: '22rem',
            height: '22rem',
            left: '3rem',
            top: '5rem',
            fontSize: '2rem',
            zIndex: 10
          }}
          userId={id}
          onClick={userId === id ? () => this.fileInput.click() : undefined}
          profilePicId={profilePicId}
          online={userId === id || !!online}
          large
        />
        {imageEditModalShown && (
          <ImageEditModal
            imageUri={imageUri}
            onHide={() =>
              this.setState({
                imageUri: null,
                imageEditModalShown: false,
                processing: false
              })
            }
            processing={processing}
            onConfirm={this.uploadImage}
          />
        )}
        {alertModalShown && (
          <AlertModal
            title="Image is too large (limit: 5mb)"
            content="Please select a smaller image"
            onHide={() => this.setState({ alertModalShown: false })}
          />
        )}
      </>
    );
  }

  onColorSelectCancel = () => {
    const {
      onSelectColor,
      profile: { profileTheme = 'logoBlue' }
    } = this.props;
    this.setState({ colorSelectorShown: false });
    onSelectColor(profileTheme);
  };

  onSelectColor = color => {
    const { onSelectColor } = this.props;
    onSelectColor(color);
  };

  onSetTheme = async() => {
    const { changeProfileTheme, dispatch, selectedTheme } = this.props;
    await setTheme({ color: selectedTheme, dispatch });
    changeProfileTheme(selectedTheme);
    this.setState({ colorSelectorShown: false });
  };

  handlePicture = event => {
    const reader = new FileReader();
    const maxSize = 5000;
    const file = event.target.files[0];
    if (file.size / 1000 > maxSize) {
      return this.setState({ alertModalShown: true });
    }
    reader.onload = upload => {
      this.setState({
        imageEditModalShown: true,
        imageUri: upload.target.result
      });
    };

    reader.readAsDataURL(file);
    event.target.value = null;
  };

  uploadImage = async image => {
    const { uploadProfilePic } = this.props;
    this.setState({
      processing: true
    });
    await uploadProfilePic(image);
    this.setState({
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    });
  };
}

export default connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  dispatch => ({
    dispatch,
    uploadProfilePic: image => dispatch(uploadProfilePic(image)),
    changeProfileTheme: theme => dispatch(changeProfileTheme(theme))
  })
)(Cover);
