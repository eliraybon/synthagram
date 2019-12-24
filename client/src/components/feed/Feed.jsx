import React from 'react';
import { Query } from 'react-apollo';

import FeedIndex from './FeedIndex';
import { CURRENT_USER, FEED } from '../../graphql/queries';

export default class Feed extends React.Component {

  render() {
    return (
      <Query
        query={CURRENT_USER}
      >
        {({ loading, error, data }) => {

          if (loading) return null;
          if (error) return <p>Error</p>

          const { currentUser } = data;

          return (
            <Query
              query={FEED}
              variables={{ currentUserId: currentUser }}
            >
              {({ loading, error, data }) => {

                if (loading) return null;
                if (error) return <p>Error</p>

                const { feed } = data;

                return (
                  <div className="feed-container">
                    <FeedIndex photos={feed} />
                  </div>
                )
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}