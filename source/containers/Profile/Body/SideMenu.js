import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

LeftMenu.propTypes = {
  className: PropTypes.string,
  menuItems: PropTypes.array.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  selectedKey: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default function LeftMenu({
  className,
  onMenuClick,
  menuItems,
  selectedKey,
  style
}) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        ...style
      }}
    >
      <div
        className={css`
          position: -webkit-sticky;
          > nav {
            padding: 1rem;
            font-size: 2rem;
            font-weight: bold;
            color: ${Color.buttonGray()};
            &:hover {
              color: ${Color.black()};
            }
          }
        `}
        style={{
          paddingLeft: '1rem',
          position: 'sticky',
          top: '1rem'
        }}
      >
        {menuItems.map(({ key, label }, index) => (
          <nav
            key={key}
            onClick={() => onMenuClick({ item: key })}
            style={{
              cursor: 'pointer',
              color: selectedKey === key ? Color.black() : null,
              background: selectedKey === key ? '#fff' : null
            }}
          >
            {label}
          </nav>
        ))}
      </div>
    </div>
  );
}
