import * as usersDao from "./users-dao.js";


const AuthController = (app) => {
    const register = (req, res) => {
        const username = req.body.username;
        const user = usersDao.findUserByUsername(username);
        if (user) {
            console.log(user);
            res.status(409).json({ message: 'Username already exists.' });
            return;
        }
        const newUser = usersDao.createUser(req.body);
        req.session["currentUser"] = newUser;
        res.json(newUser);
    };
    
    const login = (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const user = usersDao.findUserByCredentials(username, password);
        if (user) {
            req.session["currentUser"] = user;
            res.json(user);
        } else {
            res.status(404).json({ message: 'Wrong credentials.' });
        }
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(404);
            return;
        }
        res.json(currentUser);
    };
    const logout = async (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const update = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(404).json({ message: "User not logged in." });
            return;
        }
    
        const userId = currentUser._id;
        const updates = req.body;
    
        try {
            const result = await usersDao.updateUser(userId, updates);
            if (result && result.status === 'ok') {
                // Fetch the updated user data
                const updatedUser = await usersDao.findUserById(userId);
                
                // Update the session with the fetched data
                req.session["currentUser"] = updatedUser;
    
                res.json({ message: "User updated successfully.", user: updatedUser });
            } else {
                res.status(500).json({ message: "Failed to update user." });
            }
        } catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    };
    
    

    app.post("/api/users/register", register);
    app.post("/api/users/login", login);
    app.post("/api/users/profile", profile);
    app.post("/api/users/logout", logout);
    app.put("/api/users/update", update);
};
export default AuthController;