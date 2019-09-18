import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from 'components/Loading';
import ImageEditModal from 'components/Modals/ImageEditModal';
import AlertModal from 'components/Modals/AlertModal';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ProfileWidget from 'components/ProfileWidget';
import HomeMenuItems from 'components/HomeMenuItems';
import Notification from 'components/Notification';
import { uploadProfilePic } from 'helpers/requestHelpers';
import { onUploadProfilePic } from 'redux/actions/UserActions';
import { Route, Switch } from 'react-router-dom';
import { container, Left, Center, Right } from './Styles';
const People = React.lazy(() => import('./People'));
const Stories = React.lazy(() => import('./Stories'));

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onUploadProfilePic: PropTypes.func.isRequired
};

function Home({ dispatch, history, location, onUploadProfilePic }) {
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [processing, setProcessing] = useState(false);

  return (
    <ErrorBoundary>
      <div className={container}>
        <div className={Left}>
          <ProfileWidget
            history={history}
            showAlert={() => setAlertModalShown(true)}
            loadImage={upload => {
              setImageEditModalShown(true);
              setImageUri(upload.target.result);
            }}
          />
          <HomeMenuItems
            style={{ marginTop: '1rem' }}
            history={history}
            location={location}
          />
        </div>
        <div className={Center}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route
                path="/users"
                render={({ history, location }) => (
                  <People location={location} history={history} />
                )}
              />
              <Route
                exact
                path="/"
                render={({ location, history }) => (
                  <Stories location={location} history={history} />
                )}
              />
            </Switch>
          </Suspense>
        </div>
        <Notification className={Right} location="home" />
        {imageEditModalShown && (
          <ImageEditModal
            imageUri={imageUri}
            onHide={() => {
              setImageUri(null);
              setImageEditModalShown(false);
              setProcessing(false);
            }}
            processing={processing}
            onConfirm={uploadImage}
          />
        )}
        {alertModalShown && (
          <AlertModal
            title="Image is too large (limit: 5mb)"
            content="Please select a smaller image"
            onHide={() => setAlertModalShown(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );

  async function uploadImage(image) {
    setProcessing(true);
    const data = await uploadProfilePic({ dispatch, image });
    onUploadProfilePic(data);
    setImageUri(null);
    setProcessing(false);
    setImageEditModalShown(false);
  }
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    onUploadProfilePic: params => dispatch(onUploadProfilePic(params))
  })
)(Home);
