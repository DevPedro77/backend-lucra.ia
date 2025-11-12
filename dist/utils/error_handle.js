// src/errors/appErrors.ts
import createError from "http-errors";
export const Errors = {
    Unauthorized: (message = "Usuário não autenticado") => createError.Unauthorized(message),
    NotFound: (message = "Não encontrado") => createError.NotFound(message),
    BadRequest: (message = "Requisição inválida") => createError.BadRequest(message),
    Conflict: (message = "Conflito de dados") => createError.Conflict(message),
    Internal: (message = "Erro interno") => createError.InternalServerError(message),
};
export default Errors;
