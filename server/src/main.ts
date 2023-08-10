import 'reflect-metadata';
import {app,  createApolloServer, createSubscriptionServer } from  './servers';
 
async function main() {

  const {schema, server}  = await createApolloServer(app);

  createSubscriptionServer({schema, app}); 

  app.get('/health', async () => 'OK');

  await server.start();

  app.register(
    server.createHandler({
      cors: false,
    })
  );

  await app.listen({
    port: 4000,
  });

  console.log(`Server is ready at http://localhost:4000${server.graphqlPath}`);
}

main();
