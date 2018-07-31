import React from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'
import { closeSearch } from 'redux/actions/SearchActions'
import { connect } from 'react-redux'

CloseText.propTypes = {
  className: PropTypes.string,
  closeSearch: PropTypes.func.isRequired,
  style: PropTypes.object
}
function CloseText({ className, closeSearch, style }) {
  return (
    <div className={className} style={{ textAlign: 'center' }}>
      <p
        style={{
          cursor: 'pointer',
          color: Color.darkGray(),
          fontSize: '1.7rem',
          lineHeight: 1,
          textDecoration: 'underline',
          fontWeight: 'bold',
          ...style
        }}
        onClick={closeSearch}
      >
        Tap to Close
      </p>
    </div>
  )
}

export default connect(
  null,
  { closeSearch }
)(CloseText)