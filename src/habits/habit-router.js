const express = require('express')
const xss = require('xss')
const HabitService = require('./habit-service')
const habitRouter = express.Router()
const jsonParser = express.json()

const serializeHabits = habit => ({
    id: habit.id,
    user_id: habit.user_id,
    name: xss(habit.name),
    notes: xss(habit.notes),
    times_completed: habit.times_completed
});

habitRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        HabitService.getAllHabits(knexInstance)
            .then(habits => {
                if (habits.length == 0) {
                    return res.status(404).json({
                        error: { message: `No habits for this user` }
                    })
                }
                else {
                    res.status(200).json(habits)
                }
            })
            .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const { name, user_id, notes } = req.body
        const payload = {
            user_id,
            name,
            notes
        }
        HabitService.insertHabit(
            req.app.get('db'),
            payload
        )
            .then(habit => {
                res
                    .status(201)
                    .json(habit)
            })
            .catch(next)
    })

habitRouter
    .route('/:habit_id')
    .all((req, res, next) => {
        HabitService.getHabitById(
            req.app.get('db'),
            req.params.habit_id
        )
            .then(habit => {
                if (!habit) {
                    return res.status(404).json({
                        error: { message: 'habit does not exist' }
                    })
                }
                res.habit = habit
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeHabits(res.habit))
    })
    .patch(jsonParser, (req, res, next) => {

        //take the input from the user
        const {
            user_id,
            name,
            notes,
            times_completed
        } = req.body
        const habitToUpdate = {
            user_id,
            name,
            notes,
            times_completed
        }

        //validate the input by checking the length of the habitToUpdate object to make sure that we have all the values
        const numberOfValues = Object.values(habitToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            //if there is an error show it
            return res.status(400).json({
                error: {
                    message: `Request body is not complete`
                }
            })
        }

        //save the input in the db
        HabitService.updateHabit(
            req.app.get('db'),
            req.params.habit_id,
            habitToUpdate
        )
            .then(updatedHabit => {



                //get each one of the objects from the results and serialize them
                res.status(200).json(updatedHabit)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        HabitService.deleteHabit(
            req.app.get('db'),
            req.params.habit_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    });

habitRouter
    .route('/user/:user_id')
    .all((req, res, next) => {
        HabitService.getHabitByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(habit => {
                if (!habit) {
                    return res.status(404).json({
                        error: { message: 'habit does not exist' }
                    })
                }
                res.habit = habit
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.habit)
    })





module.exports = habitRouter