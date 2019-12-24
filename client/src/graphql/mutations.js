import gql from "graphql-tag";

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      loggedIn
      _id
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token) {
      loggedIn
      _id
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      username
      token
      loggedIn
      _id
    }
  }
`;

export const NEW_PHOTO = gql`
  mutation NewPhoto($photoUrl: String!, $body: String!, $user: ID!) {
    newPhoto(photoUrl: $photoUrl, body: $body, user: $user) {
      _id
      photoUrl
      body
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_LIKE = gql`
  mutation AddLike($photoId: ID!, $userId: ID!) {
    addLike(photoId: $photoId, userId: $userId) {
      _id
      likes
    }
  }
`;

export const REMOVE_LIKE = gql`
  mutation RemoveLike($photoId: ID!, $userId: ID!) {
    removeLike(photoId: $photoId, userId: $userId) {
      _id
      likes
    }
  }
`;