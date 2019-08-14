import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { searchPage } from './Styles';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { setDefaultSearchFilter } from 'helpers/requestHelpers';
import { mobileMaxWidth } from 'constants/css';
import {
  changeFilter,
  closeSearch,
  recordSearchScroll,
  setResults
} from 'redux/actions/SearchActions';
import { updateDefaultSearchFilter } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { css } from 'emotion';
import TopFilter from './TopFilter';
import FirstPage from './FirstPage';
import Results from './Results';
import CloseText from './CloseText';

SearchPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  onSearchBoxFocus: PropTypes.func.isRequired,
  recordSearchScroll: PropTypes.func.isRequired,
  searchFilter: PropTypes.string,
  searchScrollPosition: PropTypes.number,
  searchText: PropTypes.string.isRequired,
  selectedFilter: PropTypes.string.isRequired,
  setResults: PropTypes.func.isRequired,
  updateDefaultSearchFilter: PropTypes.func.isRequired
};

function SearchPage({
  changeFilter,
  closeSearch,
  dispatch,
  onSearchBoxFocus,
  recordSearchScroll,
  searchFilter,
  searchScrollPosition,
  searchText,
  selectedFilter,
  setResults,
  updateDefaultSearchFilter
}) {
  const prevSearchText = useRef(searchText);
  const SearchPageRef = useRef(null);
  useEffect(() => {
    if (!selectedFilter) changeFilter(searchFilter || 'video');
    setTimeout(() => {
      if (SearchPageRef.current) {
        SearchPageRef.current.scrollTop = searchScrollPosition;
      }
    }, 10);
    if (
      !stringIsEmpty(prevSearchText.current) &&
      prevSearchText.current.length >= 2 &&
      (stringIsEmpty(searchText) || searchText.length < 2)
    ) {
      setResults({ results: [], loadMoreButton: false });
    }
    prevSearchText.current = searchText;

    return function onUnmount() {
      recordSearchScroll(SearchPageRef.current.scrollTop);
    };
  }, [searchText]);

  return (
    <div ref={SearchPageRef} className={searchPage}>
      <div
        className={css`
          width: 80%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <CloseText className="desktop" />
        {!stringIsEmpty(searchText) && (
          <TopFilter
            className={css`
              margin-top: 2rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: 0;
                border-top: 0;
              }
            `}
            applyFilter={handleChangeFilter}
            selectedFilter={selectedFilter}
          />
        )}
        {stringIsEmpty(searchText) ? (
          <FirstPage
            changeFilter={handleChangeFilter}
            defaultFilter={searchFilter}
            filter={selectedFilter}
            setDefaultSearchFilter={handleSetDefaultSearchFilter}
          />
        ) : (
          <Results
            changeFilter={handleChangeFilter}
            closeSearch={closeSearch}
            searchText={searchText}
            filter={selectedFilter}
          />
        )}
      </div>
    </div>
  );

  function handleChangeFilter(nextFilter) {
    setResults({ results: [], loadMoreButton: false });
    changeFilter(nextFilter);
    if (stringIsEmpty(searchText)) {
      onSearchBoxFocus();
    }
  }

  async function handleSetDefaultSearchFilter() {
    if (selectedFilter === searchFilter) return;
    await setDefaultSearchFilter({
      filter: selectedFilter,
      dispatch
    });
    updateDefaultSearchFilter(selectedFilter);
    if (stringIsEmpty(searchText)) {
      onSearchBoxFocus();
    }
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    searchFilter: state.UserReducer.searchFilter,
    searchScrollPosition: state.SearchReducer.searchScrollPosition,
    selectedFilter: state.SearchReducer.selectedFilter
  }),
  dispatch => ({
    dispatch,
    changeFilter: filter => dispatch(changeFilter(filter)),
    closeSearch: () => dispatch(closeSearch()),
    recordSearchScroll: scrollTop => dispatch(recordSearchScroll(scrollTop)),
    setResults: data => dispatch(setResults(data)),
    updateDefaultSearchFilter: filter =>
      dispatch(updateDefaultSearchFilter(filter))
  })
)(SearchPage);
