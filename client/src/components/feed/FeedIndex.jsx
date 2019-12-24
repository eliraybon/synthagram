import React from 'react';
import FeedIndexItem from './FeedIndexItem';

export default class FeedIndex extends React.Component {
  render() {
    const { photos } = this.props;
    return (
      <ul className="feed">
        {photos.map(photo => {
          return <FeedIndexItem photo={photo} key={photo._id} />
        })}
      </ul>
    )
  }
}