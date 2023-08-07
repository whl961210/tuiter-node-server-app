import express from 'express';
import HelloController from "./controllers/hello-controller.js";
import UserController from "./users/users-controller.js";
import TuitsController from "./controllers/tuits/tuits-controller.js";
import cors from 'cors';
import session from "express-session";
import AuthController from "./users/auth-controller.js";
import "dotenv/config";

const app = express();

const allowedOrigins = ['https://hanlun5610a1.netlify.app', process.env.FRONTEND_URL];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                return callback(new Error('The CORS policy for this site does not allow access from the specified origin.'), false);
            }
            return callback(null, true);
        },
        credentials: true
    })
);

app.use(express.json());

const sessionOptions = {
    secret: "any string",
    resave: false,
    saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
    };
}
app.use(session(sessionOptions));

TuitsController(app);
AuthController(app);
HelloController(app);
UserController(app);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
