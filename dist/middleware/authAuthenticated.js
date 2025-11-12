import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
export async function authMiddleware(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.status(401).send({ error: "Token não fornecido" });
        }
        const [, token] = authHeader.split(" "); // Bearer <token>
        if (!token) {
            return reply.status(401).send({ error: "Token inválido" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        // Coloca dados do usuário no request para ser usado nas rotas
        request.user = decoded;
    }
    catch (err) {
        return reply.status(401).send({ error: "Token inválido ou expirado" });
    }
}
