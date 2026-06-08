import { REQUESTS_PER_MINUTE } from "./config.js";

export const authUsers = [{
    username: 'wanderaquino',
    password: '123123',
    role: 'admin',
},
{
    username: 'charlesnelson',
    password: '1234',
    role: 'member'
}]

export const JWT_SECRET = "supersecret";
const adminSecret = "adminsupersecret";
const issuedServiceTokens = new Map();

export const rateLimitOptions = {
    max: REQUESTS_PER_MINUTE,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.headers?.authorization?.replace(/bearer\s/i, '') ?? request.ip
}

export function initAuthRoute(fastify) {
    fastify.addHook('onRequest', async (request, reply) => {

        const publicRoutes = ["/v1/health", "/v1/auth/login", "/v1/auth/service-token"];

        if (publicRoutes.includes(request.url)) {
            return;
        };

        const token = request.headers.authorization?.replace(/bearer\s/i, '');
        const serviceUser = issuedServiceTokens.get(token);
        
        if (serviceUser) {
            request.user = serviceUser;
            return;
        };

        try {
            await request.jwtVerify();
        } catch (error) {
            console.error('Error verifying JWT:', error);
            return reply.code(401).send({ message: 'Unauthorized' });
        }
    });

    fastify.post("/v1/auth/login", {
        schema: {
            body: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string" }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                    }
                },
                401: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    },
        async (request, reply) => {
            const { username, password } = request.body;
            const user = authUsers.find(
                user => user.username.toLocaleLowerCase() === username.toLocaleLowerCase() &&
                    user.password === password);
            if (!user) {
                return reply.code(401).send({ message: 'Invalid username or password' });
            }

            const token = fastify.jwt.sign({ username: user.username, role: user.role }, { expiresIn: '1h' });
            console.log('Generated JWT for user:', user.username, 'with role:', user.role);
            reply.send({ token });
        }
    );

    fastify.post("/v1/auth/service-token", {
        schema: {
            body: {
                type: "object",
                required: ["username", "password", "adminSuperSecret"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                    adminSuperSecret: { type: "string" }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        role: {type: "string"},
                        serviceToken: { type: "string" },
                    }
                },
                401: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    },
        async (request, reply) => {
            const { username, password, adminSuperSecret } = request.body;

            if (adminSuperSecret !== adminSecret) {
                return reply.code(401).send({ message: 'unauthorized' });
            };

            const user = authUsers.find(
                user => user.username.toLocaleLowerCase() === username.toLocaleLowerCase() &&
                    user.password === password);

            if (!user) {
                return reply.code(401).send({ message: 'Invalid credentials' });
            }

            const serviceToken = crypto.randomUUID();
            issuedServiceTokens.set(serviceToken, { username: user.username, role: user.role });

            reply.send({ role: user.role, serviceToken });
        }
    );
    
}

export function requireRole(role) {
    return async (request, reply) => {
        if (!request.user || request.user.role !== role) {
            return reply.code(403).send({ message: 'Forbidden: insufficient permissions' });
        }
    };
}