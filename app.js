import express from 'express';
import HelloController from "./controllers/hello-controller.js";
import UserController from "./users/users-controller.js";
import TuitsController from "./controllers/tuits/tuits-controller.js";
import cors from 'cors';
import session from "express-session";
import AuthController from "./users/auth-controller.js";
import "dotenv/config";
import mongoose from "mongoose";
const CONNECTION_STRING = 'mongodb+srv://whl961210:Whw720717@tuiter.ultjclb.mongodb.net/?retryWrites=true&w=majority' || 'mongodb://127.0.0.1:27017/tuiter'
mongoose.connect(CONNECTION_STRING);
const app = express();

const allowedOrigins = ['https://hanlun5610a1.netlify.app', process.env.FRONTEND_URL,'https://silver-horse-c989b9.netlify.app'];

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
