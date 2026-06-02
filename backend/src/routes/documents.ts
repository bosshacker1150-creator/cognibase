import { FastifyPluginAsync } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { randomUUID } from 'node:crypto';

// Configure Multer to store files in ./uploads temporarily
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

const documents: FastifyPluginAsync = async (fastify, opts) => {
  // GET /api/documents - list all documents
  fastify.get('/', async (request, reply) => {
    const docs = await fastify.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return docs;
  });

  // POST /api/documents - upload a file
  fastify.post('/', { preHandler: upload.single('file') }, async (request, reply) => {
    const file = (request as any).file as Express.Multer.File;
    if (!file) {
      return reply.code(400).send({ error: 'File missing' });
    }
    // Move file to a permanent location under ./storage
    const storageDir = path.resolve(__dirname, '../../storage');
    await fs.promises.mkdir(storageDir, { recursive: true });
    const ext = path.extname(file.originalname);
    const newName = `${randomUUID()}${ext}`;
    const destPath = path.join(storageDir, newName);
    await fs.promises.rename(file.path, destPath);

    // Create DB record
    const doc = await fastify.prisma.document.create({
      data: {
        id: randomUUID(),
        title: file.originalname,
        path: destPath,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
    return reply.code(201).send(doc);
  });

  // GET /api/documents/:id - get metadata
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const doc = await fastify.prisma.document.findUnique({ where: { id } });
    if (!doc) return reply.code(404).send({ error: 'Not found' });
    return doc;
  });
};

export default documents;
