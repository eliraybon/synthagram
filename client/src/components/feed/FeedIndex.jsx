import React from 'react';
import { Query } from 'react-apollo';
import { CURRENT_USER } from '../../graphql/queries'
import FeedIndexItem from './FeedIndexItem';

export default class FeedIndex extends React.Component {
  render() {
    const { photos, currentUser } = this.props;
    return (
      <ul className="feed">
        {photos.map(photo => {
          return (
            <FeedIndexItem 
              photo={photo} 
              currentUser={currentUser}
              key={photo._id} 
            />
          )
        })}
      </ul>
    )
  }
}