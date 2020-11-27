const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
    serializeUser(user) {
        // console.log(user)
        return {
            id: user.id,
            user_name: xss(user.user_name),
        }
    },
    getAllUsers(knex) {
        return knex.select('*').from('users')
    },
    hasUserWithUserName(db, user_name) {
        console.log('user name=>', user_name)
        return db('users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(user_password) {
        // console.log("password =>", user_password)
        if (user_password.length < 6) {
            return 'Password must be longer than 6 characters'
        }
        if (user_password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (user_password.startsWith(' ') || user_password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
    },
    hashPassword(user_password) {
        return bcrypt.hash(user_password, 12)
    },
    deleteUser(knex, id) {
        return knex('users')
            .where({ id })
            .delete()
    },

    deleteAllUsers(knex,id) {
        return knex('users')
            .delete()
    },

    getById(knex, id) {
        return knex
            .from('users')
            .select('*')
            .where('id', id)
            .first()
    },
}

module.exports = UsersService