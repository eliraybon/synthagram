import React from 'react';
import { Query } from 'react-apollo';
import { 
  EXPLORE_USERS, 
  EXPLORE_PHOTOS,
  CURRENT_USER 
} from '../../graphql/queries';
import UserIndex from '../users/UserIndex';
import ThumbIndex from '../thumbnails/ThumbIndex';


export default class Explore extends React.Component {
  render() {
    return (
      <Query query={CURRENT_USER}>
        {({ loading, error, data }) => {

          if (loading) return null;
          if (error) return <p>Error</p>

          const { currentUser } = data;

          return (
            <div className="explore">
              <Query query={EXPLORE_USERS}>
                {({ loading, error, data }) => {

                  if (loading) return null;
                  if (error) return <p>Error</p>

                  const { exploreUsers } = data;
          
                  return (
                    <UserIndex 
                      users={exploreUsers} 
                      currentUser={currentUser} 
                    />
                  )
                }}
              </Query>

              <Query query={EXPLORE_PHOTOS}>
                {({ loading, error, data }) => {

                  if (loading) return null;
                  if (error) return <p>Error</p>

                  const { explorePhotos } = data;

                  return (
                    <ThumbIndex thumbs={Array.from(explorePhotos).reverse()} />
                  )
                }}
              </Query>
            </div>
          )
        }}
      </Query>
    )

  }
}