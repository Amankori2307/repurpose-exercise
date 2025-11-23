import { createClient } from 'graphql-ws';
import WebSocket from 'ws';

// Required to allow graphql-ws to use ws in Node
global.WebSocket = WebSocket;

const client = createClient({
  url: 'ws://localhost:3000/graphql',
  connectionParams: {
    // Add JWT if your subscription requires auth:
    // Authorization: 'Bearer <YOUR_JWT>'
  },
});

console.log('📡 Subscribing to newPost...');

client.subscribe(
  {
    query: `
      subscription {
        newPost {
          id
          title
          content
          authorId
        }
      }
    `,
  },
  {
    next: (data) => {
      console.log('\n🔥 NEW POST RECEIVED:');
      console.log(JSON.stringify(data, null, 2));
    },
    error: (err) => console.error('❌ SUBSCRIPTION ERROR:', err),
    complete: () => console.log('Subscription completed'),
  },
);
