import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});