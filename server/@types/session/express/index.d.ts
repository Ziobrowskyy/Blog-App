import Session from "../../../src/web/Session"

declare global {
    namespace Express {
        interface Request {
            Session : Session;
        }
    }
}