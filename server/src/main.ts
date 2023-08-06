import 'reflect-metadata';
import { createServer } from './utils/create-server';

async function main() {
  const { app, server } = await createServer();

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
