const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../../middleware/jwt-auth')

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
    const { userName, password } = req.body;
    const loginUser = { userName, password };

    // validates that the request body contains the credentials fields
    for (const [key, value] of Object.entries(loginUser))
        if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`,
            });

    // uses the userName credential value to find a user from the database
    AuthService.getUserWithUserName(req.app.get("db"), loginUser.userName)
        .then((dbUser) => {
            if (!dbUser)
                return res.status(400).json({
                    error: "Incorrect userName or password",
                });

            // If a user is found by that posted userName, the password credential
            // is validated against the bcrypted password in the database, by using bcrypt compare
            return AuthService.comparePasswords(
                loginUser.password,
                dbUser.password
            ).then((compareMatch) => {
                if (!compareMatch)
                    return res.status(400).json({
                        error: "Incorrect user_name or password",
                    });

                const sub = dbUser.userName;
                const payload = { id: dbUser.id, user_name: dbUser.user_name, first_name: dbUser.first_name, last_name : dbUser.last_name};

                // if everything is good, an auth token is responded
                res.send({
                    authToken: AuthService.createJwt(sub, payload),
                    userId: AuthService.serializeUser(dbUser),
                });
            });
        })
        .catch(next);
})
authRouter.post('/refresh', requireAuth, (req, res) => {
    const sub = req.user.userName
    const payload = { user_id: req.user.id }
    res.send({
        authToken: AuthService.createJwt(sub, payload),
    })
});

module.exports = authRouter;