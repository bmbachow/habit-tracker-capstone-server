const knex = require('knex')
const userFixtures = require('./user.fixtures')
const app = require('../src/app')
const UsersService = require('../src/users/users-service')


describe('Login Users Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({client: 'pg', connection: process.env.TEST_DATABASE_URL})
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    beforeEach('clean the table', async () => {
        await UsersService.deleteAllUsers(db)
        await UsersService.insertUser(db, {
            id: 1,
            user_name: 'admin',
            user_password: await UsersService.hashPassword('123'),
            user_email: 'admin@gmail.com'
        })
    })

    afterEach('clean the table', async () => {
        await UsersService.deleteAllUsers(db)
    })


    describe(`POST /api/users`, () => {
        it(`creates a user, responding with 201 and the new user`, function () {
            this.retries(3)
            const newUser = {
                id: 1,
                user_name: 'admin',
                user_password: '123',
                user_email: 'admin@gmail.com'
            }
            return supertest(app).post('/api/users').send(newUser).expect(res => {}).expect(201).expect(res => {
                expect(res.body.id).to.have.property('id')
                expect(res.body.user_name).to.eql(newUser.user_name)
                expect(res.body.user_password).to.eql(newUser.user_password)
                expect(res.body.user_email).to.eql(newUser.user_email)
                expect(actual).to.eql(expected)
            }).then(res => supertest(app).get(`/api/users/${
                res.body.id
            }`).expect(res.body))
        })

        const requiredFields = ['user_name', 'user_password', 'user_email']

        requiredFields.forEach(field => {
            const newUser = {
                id: 1,
                user_name: 'admin',
                user_password: '123',
                user_email: 'admin@gmail.com'
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newUser[field]

                return supertest(app).post('/api/users').send(newUser).expect(400, {
                    error: {
                        message: `Missing '${field}' in request body`
                    }
                })
            })
        })
    })


})
