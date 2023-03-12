/** @module Auth0Plugin */
import fp from "fastify-plugin";
import {FastifyInstance, FastifyPluginOptions} from "fastify";
import {AuthenticationClient} from "auth0";

/**
 * Connects and decorates fastify with our Auth0 service
 * @function
 */
const Auth0Plugin = fp(async (app: FastifyInstance, options: FastifyPluginOptions, done: any) => {

    const auth0 = new AuthenticationClient({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
    });

    // this object will be accessible from any fastify server instance
    // app.status(200).send()
    // app.auth0
    app.decorate("auth0", auth0);

    done();
});

export default Auth0Plugin;

