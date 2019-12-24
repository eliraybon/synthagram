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
      }
      likes
    }
  }
`;