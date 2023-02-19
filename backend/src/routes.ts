// /** @module Routes */
// import cors from "cors";
// import {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
// import {User} from "./db/models/user";
// import {IPHistory} from "./db/models/ip_history";
//
// /**
//  * App plugin where we construct our routes
//  * @param {FastifyInstance} app our main Fastify app instance
//  */
// export async function doggr_routes(app: FastifyInstance): Promise<void> {
//
// 	// Middleware
// 	// TODO: Refactor this in favor of fastify-cors
// 	app.use(cors());
//
// 	/**
// 	 * Route replying to /test path for test-testing
// 	 * @name get/test
// 	 * @function
// 	 */
// 	app.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
// 		reply.send("GET Test");
// 	});
//
// 	/**
// 	 * Route serving login form.
// 	 * @name get/users
// 	 * @function
// 	 */
// 	app.get("/users", async (req, reply) => {
// 		let users = await app.db.user.find();
// 		reply.send(users);
// 	});
//
// 	// CRUD impl for users
// 	// Create new user
//
// 	// Appease fastify gods
// 	const post_users_opts: RouteShorthandOptions = {
// 		schema: {
// 			body: {
// 				type: 'object',
// 				properties: {
// 					name: {type: 'string'},
// 					email: {type: 'string'}
// 				}
// 			},
// 			response: {
// 				200: {
// 					type: 'object',
// 					properties: {
// 						user: {type: 'object'},
// 						ip_address: {type: 'string'}
// 					}
// 				}
// 			}
// 		}
// 	};
//
//
//
// 	/**
// 	 * Route allowing creation of a new user.
// 	 * @name post/users
// 	 * @function
// 	 * @param {string} name - user's full name
// 	 * @param {string} email - user's email address
// 	 * @returns {IPostUsersResponse} user and IP Address used to create account
// 	 */
// 	app.post<{
// 		Body: IPostUsersBody,
// 		Reply: IPostUsersResponse
// 	}>("/users", post_users_opts, async (req, reply: FastifyReply) => {
//
// 		const {name, email} = req.body;
//
// 		const user = new User();
// 		user.name = name;
// 		user.email = email;
//
// 		const ip = new IPHistory();
// 		ip.ip = req.ip;
// 		ip.user = user;
// 		// transactional, transitively saves user to users table as well IFF both succeed
// 		await ip.save();
//
// 		//manually JSON stringify due to fastify bug with validation
// 		// https://github.com/fastify/fastify/issues/4017
// 		await reply.send(JSON.stringify({user, ip_address: ip.ip}));
// 	});
// }
//
// // Appease typescript request gods
// interface IPostUsersBody {
// 	name: string,
// 	email: string,
// }
//
// /**
//  * Response type for post/users
//  */
// export type IPostUsersResponse = {
// 	/**
// 	 * User created by request
// 	 */
// 	user: User,
// 	/**
// 	 * IP Address user used to create account
// 	 */
// 	ip_address: string
// }
