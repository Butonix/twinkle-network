import React, { Component } from 'react';
import DropdownButton from 'components/Buttons/DropdownButton';
import { borderRadius, Color } from 'constants/css';
import { PropTypes } from 'prop-types';

export default class HomeFilter extends Component {
  static propTypes = {
    applyFilter: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    changeCategory: PropTypes.func.isRequired,
    displayOrder: PropTypes.string.isRequired,
    setDisplayOrder: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired
  };

  categoryObj = {
    uploads: {
      label: 'Uploads',
      desc: 'New to Old',
      asc: 'Old to New'
    },
    challenges: {
      label: 'Challenges',
      desc: 'Hard to Easy',
      asc: 'Easy to Hard'
    },
    responses: {
      label: 'Top Responses'
    },
    videos: {
      label: 'Popular Starred Videos'
    }
  };

  render() {
    const {
      applyFilter,
      category,
      changeCategory,
      displayOrder,
      selectedFilter,
      setDisplayOrder
    } = this.props;
    return (
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          background: '#fff',
          padding: '1rem',
          marginBottom: '1rem',
          border: `1px solid ${Color.borderGray()}`,
          borderRadius: borderRadius,
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex' }}>
          {category === 'uploads' && (
            <DropdownButton
              snow
              icon="caret-down"
              text={`${selectedFilter === 'url' ? 'link' : selectedFilter}${
                selectedFilter === 'all' ? '' : 's'
              }`}
              menuProps={[
                {
                  key: 'all',
                  label: 'All',
                  onClick: () => applyFilter('all')
                },
                {
                  key: 'video',
                  label: 'Videos',
                  onClick: () => applyFilter('video')
                },
                {
                  key: 'url',
                  label: 'Links',
                  onClick: () => applyFilter('url')
                },
                {
                  key: 'post',
                  label: 'Posts',
                  onClick: () => applyFilter('post')
                },
                {
                  key: 'comment',
                  label: 'Comments',
                  onClick: () => applyFilter('comment')
                }
              ].filter(prop => prop.key !== selectedFilter)}
            />
          )}
          <DropdownButton
            snow
            icon="caret-down"
            text={this.categoryObj[category].label}
            style={{ marginLeft: category === 'uploads' && '1rem' }}
            menuProps={[
              {
                key: 'uploads',
                label: this.categoryObj['uploads'].label,
                onClick: () => changeCategory('uploads')
              },
              {
                key: 'challenges',
                label: this.categoryObj['challenges'].label,
                onClick: () => changeCategory('challenges')
              },
              {
                key: 'responses',
                label: this.categoryObj['responses'].label,
                onClick: () => changeCategory('responses')
              },
              {
                key: 'videos',
                label: this.categoryObj['videos'].label,
                onClick: () => changeCategory('videos')
              }
            ].filter(prop => prop.key !== category)}
          />
          {(category === 'uploads' || category === 'challenges') && (
            <DropdownButton
              snow
              icon="caret-down"
              text={this.categoryObj[category][displayOrder]}
              style={{ marginLeft: '1rem' }}
              menuProps={[
                {
                  label:
                    displayOrder === 'desc'
                      ? this.categoryObj[category]['asc']
                      : this.categoryObj[category]['desc'],
                  onClick: setDisplayOrder
                }
              ]}
            />
          )}
        </div>
      </nav>
    );
  }
}