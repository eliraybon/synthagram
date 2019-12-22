import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import { IS_LOGGED_IN } from '../graphql/queries';

const AuthRoute = ({
  component: Component,
  path,
  exact,
  routeType,
  ...rest
}) => (
    <Query query={IS_LOGGED_IN}>
      {({ data }) => {
        if (routeType === "auth") {
          return (
            <Route
              path={path}
              exact={exact}
              render={props =>
                !data.isLoggedIn ? <Component {...props} /> : <Redirect to="/products" />
              }
            />
          );
        } else {
          return (
            <Route
              {...rest}
              render={props =>
                data.isLoggedIn ? (
                  <Component {...props} />
                ) : (
                    <Redirect to="/home" />
                  )
              }
            />
          );
        }
      }}
    </Query>
  );

  

export default AuthRoute;