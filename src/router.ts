import { FastifyInstance } from "fastify";
import userController from "./controller/userController";
import indexController from "./controller/indexController";
import complicationController from "./controller/complicationController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(userController, { prefix: "/api/v1/user" });
  fastify.register(complicationController, { prefix: "/api/v1/complication" });
  fastify.register(indexController, { prefix: "/" });
}
