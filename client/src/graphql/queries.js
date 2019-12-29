import gql from "graphql-tag";

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser @client
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($filter: String!) {
    searchUsers(filter: $filter) {
      _id
      username
      profileImg
    }
  }
`;

export const FEED = gql`
  query Feed($currentUserId: ID!) {
    feed(currentUserId: $currentUserId) {
      _id
      photoUrl
      body
      user {
        _id
        username
        profileImg
      }
      likes
      comments {
        _id
        body
        author {
          _id
          username
        }
        parentComment {
          _id
        }
        replies {
          _id
          body
          author {
            _id
            username
          }
          parentComment {
            _id
          }
        }
      }
    }
  }
`;

export const EXPLORE_USERS = gql`
  query ExploreUsers {
    exploreUsers {
      _id
      username
      profileImg
      followers {
        _id
      }
    }
  }
`;

export const EXPLORE_PHOTOS = gql`
  query ExplorePhotos {
    explorePhotos {
      _id
      photoUrl
      likes
      comments {
        _id
      }
    }
  }
`;

export const FETCH_USER = gql`
  query FetchUser($_id: ID!) {
    user(_id: $_id) {
      _id
      username
      profileImg
      followers {
        _id
        username
      }
      followedUsers {
        _id
        username
      }
      photos {
        _id
        photoUrl
        likes
        comments {
          _id
        }
      }
    }
  }
`;

export const FETCH_PHOTO = gql`
  query FetchPhoto($_id: ID!) {
    photo(_id: $_id) {
      _id
      photoUrl
      body
      user {
        _id
        username
        followers {
          _id
        }
        followedUsers {
          _id
        }
        photos {
          _id
        }
      }
      likes
      comments {
        _id
        body
        author {
          _id
          username
        }
        parentComment {
          _id
        }
        replies {
          _id
          body
          author {
            _id
            username
          }
          parentComment {
            _id
          }
        }
      }
    }
  }
`;
