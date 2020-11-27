const knex = require('knex')
const {makeHabitArray}  = require('./habits.fixtures')
const app = require('../src/app')


describe(' Habits Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('habits').truncate())

    afterEach('cleanup', () => db('habits').truncate())


    describe(`GET /api/habit/:user_id`, () => {
        context(`Given no users`, () => {
            it(`responds with 404`, () => {
                const userId = 123456
                return supertest(app)
                    .get(`/api/habit/user/${userId}`)
                    .expect(404, { error: { message: `User doesn't exist` } })
            })
        })

        context('Given there are habits in the database', () => {
            const testHabits = makeHabitArray()

            beforeEach('insert habit', () => {
                return db
                    .into('habits')
                    .insert(testHabits)
            })

            it('responds with 200 and the specified user', () => {
                const userId = 1
                return supertest(app)
                    .get(`/api/habit/user/${userId}`)
                    .expect(200, testHabits)
            })
        })

    })

    describe('POST /habit', function () {

        it('should create and return a new habit when provided valid data', function () {
          const newItem = {
            'name': "running",
            'notes': "example note"
          };
    
          return supertest(app)
            .post('/habit')
            .send(newItem)
            .expect(201)
            .expect(res => {
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys('user_id', 'name', 'notes');
              expect(res.body.name).to.equal(newItem.name);
              expect(res.body.notes).to.equal(newItem.notes);
            });
        });
    
        it('should respond with 400 status when given bad data', function () {
          const badItem = {
            foobar: 'broken item'
          };
          return supertest(app)
            .post('habit')
            .send(badItem)
            .expect(400);
        });
    
      });

      describe('DELETE /habit/:id', () => {

        beforeEach('insert some habit', () => {
          return db('habit').insert(habit);
        })
    
        it('should delete an item by id', () => {
          return db('habit')
            .first()
            .then(doc => {
              return supertest(app)
                .delete(`/habit/${doc.id}`)
                .expect(204);
            })
        });
    
        it('should respond with a 404 for an invalid id', function () {
          
          return supertest(app)
            .delete('/habit/aaaaaaaaaaaaaaaaaaaaaaaa')
            .expect(404);
        });
    
      });
})