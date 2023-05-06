import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { resolve } from 'path';
import axios from 'axios';
import nodeHtmlToImage from 'node-html-to-image';
import { promises as fs } from 'fs';


export default async function indexController(fastify: FastifyInstance) {
  // GET /
  fastify.get('/', async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const query = request.query as any
      const id = query.id;
      const width = query.width;
      const height = query.height;

      console.log(id, width, height);

      const imagePath = getImagePath(id, width, height);
      const exists = await imageExists(imagePath);

      if (exists) {
        const imageContent = await fs.readFile(imagePath);
        reply.type('image/png').send(imageContent);
      } else {
        const url = "https://express-complication.onrender.com/newipe-complication-"+id+".html?width="+width+"&height="+height+"&batteryStatus=30";
        const response = await axios.get(url);
        const htmlContent = response.data;

        const image = await nodeHtmlToImage({
          html: htmlContent,
          output: imagePath,
          quality: 100,
          type: 'png',
        });

        reply.type('image/png').send(image);
      }
    } catch (error) {
      reply.send(error);
    }
  });
}



function getImagePath(id: string, width: string, height: string): string {
  return resolve(__dirname, `../../static/images/id-${id}_w-${width}_h-${height}.png`);
}

async function imageExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

imageExists.type = () => Promise.resolve(false);