# Frontend Setup

## Login Page Implementation

A login page has been successfully created with the following features:

### Features
- **GraphQL Integration**: Uses Apollo Client to connect to the GraphQL API
- **Configurable API URL**: Base URL is configured via environment variable `VITE_GRAPHQL_URI`
- **Login Form**: Username/password form with validation
- **Error Handling**: Displays GraphQL and network errors
- **Loading States**: Shows loading state during authentication
- **Token Storage**: Stores JWT token in localStorage on successful login

### Configuration
The GraphQL API base URL can be configured by setting the environment variable:
```
VITE_GRAPHQL_URI=http://localhost:3000/graphql
```

### Files Created/Modified
- `frontend/.env` - Environment configuration
- `frontend/src/config/apollo.ts` - Apollo Client setup
- `frontend/src/components/LoginPage.vue` - Login page component
- `frontend/src/main.ts` - Apollo Client provider setup
- `frontend/src/App.vue` - Updated to show login page

### Dependencies Added
- `@apollo/client` - GraphQL client
- `@vue/apollo-composable` - Vue 3 Apollo integration
- `graphql` - GraphQL JavaScript reference implementation

### Usage
1. Start the backend server (GraphQL API should be running on configured port)
2. Start the frontend development server: `pnpm run dev`
3. Navigate to the login page
4. Enter credentials to authenticate via GraphQL

### Note
The development server requires Node.js 20.19+ or 22.12+. If you're using Node.js 18.x, please upgrade to a compatible version.

### GraphQL Login Mutation
The login page uses the following GraphQL mutation:
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
    user {
      id
      username
      email
    }
  }
}
```

This matches the backend authentication resolver that expects `LoginInput` with `username` and `password` fields.