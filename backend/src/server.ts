import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import documentRoutes from './routes/documents';

ddotenv.config();

const server = Fastify({ logger: true });

server.register(cors, { origin: true });

const prisma = new PrismaClient();

// Pass prisma instance to routes via request decoration
server.decorate('prisma', prisma);

server.register(documentRoutes, { prefix: '/api/documents' });

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    server.log.info(`Server listening on ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
