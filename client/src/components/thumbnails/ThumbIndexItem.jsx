import React from 'react';

export default class ThumbIndexItem extends React.Component {
  render() {
    const { thumb } = this.props;
    return (
      <li className="thumb-index-item">
        <img
          src={thumb.photoUrl}
          // width="40px"
          // height="40px"
        />
      </li>
    )
  }
}