const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const xss = require("xss");
const config = require("../../config");

const AuthService = {
    getUserWithUserName(db, user_name) {
        return db('users')
            .where({ user_name })
            .first()
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
        })
    },
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
    serializeUser(user) {
        return {
            id: user.id,
            user_name: xss(user.user_name),
            password: xss(user.password),
            first_name: xss(user.first_name),
            last_name: xss(user.last_name)
        };
    }
}

module.exports = AuthService