import React, { useEffect, useRef } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import FeaturedPlaylistPanel from './Panels/FeaturedPlaylistsPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { loadUploads, searchContent } from 'helpers/requestHelpers';
import {
  closeAddPlaylistModal,
  closeAddVideoModal,
  getInitialVideos,
  getPlaylists,
  openAddVideoModal,
  openAddPlaylistModal,
  setSearchedPlaylists,
  postPlaylist
} from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { scrollElementToCenter } from 'helpers';

Videos.propTypes = {
  addPlaylistModalShown: PropTypes.bool.isRequired,
  closeAddPlaylistModal: PropTypes.func.isRequired,
  getInitialVideos: PropTypes.func.isRequired,
  getPlaylists: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMorePlaylistsButton: PropTypes.bool.isRequired,
  loadMoreSearchedPlaylistsButton: PropTypes.bool.isRequired,
  openAddPlaylistModal: PropTypes.func.isRequired,
  playlists: PropTypes.array.isRequired,
  playlistsLoaded: PropTypes.bool.isRequired,
  searchedPlaylists: PropTypes.array.isRequired,
  setSearchedPlaylists: PropTypes.func.isRequired,
  postPlaylist: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function Videos({
  addPlaylistModalShown,
  closeAddPlaylistModal,
  getPlaylists,
  getInitialVideos,
  history,
  loaded,
  loadMorePlaylistsButton,
  loadMoreSearchedPlaylistsButton,
  openAddPlaylistModal,
  playlists: allPlaylists = [],
  postPlaylist,
  playlistsLoaded,
  searchedPlaylists,
  setSearchedPlaylists,
  userId
}) {
  const { handleSearch, searching, searchText } = useSearch({
    onSearch: searchPlaylist,
    onClear: () =>
      setSearchedPlaylists({ playlists: [], loadMoreButton: false })
  });
  const AllPlaylistsPanelRef = useRef(null);

  useEffect(() => {
    init();

    async function init() {
      if (history.action === 'PUSH' || !loaded) {
        getPlaylists();
        const { results: videos, loadMoreButton } = await loadUploads({
          type: 'video'
        });
        getInitialVideos({ videos, loadMoreButton });
      }
    }
  }, []);

  const playlists = !stringIsEmpty(searchText)
    ? searchedPlaylists
    : allPlaylists;

  return (
    <div>
      <FeaturedPlaylistPanel history={history} />
      <PlaylistsPanel
        key={'allplaylists'}
        innerRef={AllPlaylistsPanelRef}
        buttonGroup={() => (
          <ButtonGroup
            style={{ marginLeft: 'auto' }}
            buttons={[
              {
                label: '+ Add Playlist',
                onClick: openAddPlaylistModal,
                skeuomorphic: true,
                color: 'darkerGray',
                disabled: !userId
              }
            ]}
          />
        )}
        title="All Playlists"
        loadMoreButton={
          !stringIsEmpty(searchText)
            ? loadMoreSearchedPlaylistsButton
            : loadMorePlaylistsButton
        }
        userId={userId}
        playlists={playlists}
        loaded={playlistsLoaded}
        isSearching={searching}
        onSearch={handleSearch}
        searchQuery={searchText}
      />
      {addPlaylistModalShown && (
        <AddPlaylistModal
          postPlaylist={postPlaylist}
          onHide={closeAddPlaylistModal}
          focusPlaylistPanelAfterUpload={() =>
            scrollElementToCenter(AllPlaylistsPanelRef.current, 150)
          }
        />
      )}
    </div>
  );

  async function searchPlaylist(text) {
    const { results, loadMoreButton } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 3
    });
    setSearchedPlaylists({ playlists: results, loadMoreButton });
  }
}

export default connect(
  state => ({
    addPlaylistModalShown: state.VideoReducer.addPlaylistModalShown,
    addVideoModalShown: state.VideoReducer.addVideoModalShown,
    loaded: state.VideoReducer.loaded,
    loadMorePlaylistsButton: state.VideoReducer.loadMorePlaylistsButton,
    loadMoreSearchedPlaylistsButton:
      state.VideoReducer.loadMoreSearchedPlaylistsButton,
    playlistsLoaded: state.VideoReducer.allPlaylistsLoaded,
    playlists: state.VideoReducer.allPlaylists,
    searchedPlaylists: state.VideoReducer.searchedPlaylists,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId
  }),
  {
    getPlaylists,
    getInitialVideos,
    openAddVideoModal,
    openAddPlaylistModal,
    setSearchedPlaylists,
    closeAddPlaylistModal,
    closeAddVideoModal,
    postPlaylist
  }
)(Videos);