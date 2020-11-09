const path = require('path')
const express = require('express')
const xss = require('xss')
const habitService = require('./habit-service')
const habitRouter = express.Router()
const jsonParser = express.json()

const serializeHabit = habit => ({
    id: habit.id,
    category_id:habit.category_id,
    habit_name: xss(habit.habit_name),
    habit_description: xss(habit.habit_description),
    is_deleted: habit.is_deleted,
    date_created: habit.date_created
})

habitRouter
    .route('/')
    //relevant
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        habitService.getHabits(knexInstance)
            .then(habits => {
                res.json(habits.map(serializeHabit))
            })
            .catch(next)
    })
    //relevant
    .post(jsonParser, (req, res, next) => {
        const {
            habit_name,
            category_id,
            habit_description,
            is_deleted
            } = req.body
        const newHabit = {
            habit_name,
            category_id,
            habit_description,
            is_deleted
        }

        for (const [key, value] of Object.entries(newHabit))
            if (value == null)
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
        habitService.insertHabit(
                req.app.get('db'),
                newHabit
            )
            .then(habit => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${habit.id}`))
                    .json(serializeHabit(habit))
            })
            .catch(next)
    })

habitRouter
    .route('/:habit_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.habit_id))) {
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }
        habitService.getHabitById(
                req.app.get('db'),
                req.params.habit_id
            )
            .then(habit => {
                if (!habit) {
                    return res.status(404).json({
                        error: {
                            message: `Habit doesn't exist`
                        }
                    })
                }
                res.habit = habit
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeHabit(res.habit))
    })
    //relevant
    .patch(jsonParser, (req, res, next) => {
        const {
            habit_name,
            category_id,
            habit_description,
            is_deleted
        } = req.body
        const habitToUpdate = {
            habit_name,
            category_id,
            habit_description,
            is_deleted
        }

        const numberOfValues = Object.values(pancakeToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })

        habitService.updateHabit(
                req.app.get('db'),
                req.params.habit_id,
                habitToUpdate
            )
            .then(updatedHabit => {
                res.status(200).json(serializeHabit(updatedHabit[0]))
            })
            .catch(next)
    })
    //relevant
    .delete((req, res, next) => {
        habitService.deleteHabit(
                req.app.get('db'),
                req.params.habit_id
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = habitRouter
