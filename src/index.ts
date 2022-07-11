import { ApolloServer } from 'apollo-server';
import { schema } from './schema/schema';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

export const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
});

const port = 8000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server is ready at ${url} 🚀`);
});
