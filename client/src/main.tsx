import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import './index.css'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL server endpoint
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)


 

 
 