import React from 'react';

export default class ThumbIndexItem extends React.Component {
  render() {
    const { thumb } = this.props;
    return (
      <li>
        <img
          src={thumb.photoUrl}
          width="40px"
          height="40px"
        />
      </li>
    )
  }
}