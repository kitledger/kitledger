import { Hono } from "hono";
import { apiV1Prefix, apiV1Router } from "./api/v1/router.ts";

const server = new Hono();

server.get("/", (c) => {
	return c.text("Hello, Kitledger!");
});

server.route(apiV1Prefix, apiV1Router);

export default server;
