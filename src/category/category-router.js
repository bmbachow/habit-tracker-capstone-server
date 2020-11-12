const path = require('path')
const express = require('express')
const xss = require('xss')
const categoryService = require('./category-service')
const categoryRouter = express.Router()
const jsonParser = express.json()

const serializeCategory = category => ({
    id: category.id,
    user_id: xss(category.user_id),
    category_name: category.category_name,
    category_description: category.category_description,
    is_deleted: category.is_deleted,
    date_created: category.date_created
})

categoryRouter
    .route('/')
    //relevant
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        categoryService.getCategories(knexInstance)
            .then(categories => {
                res.json(categories.map(serializeCategory))
            })
            .catch(next)
    })
    //relevant
    .post(jsonParser, (req, res, next) => {
        const {
            user_id,
            category_name,
            category_description,
            is_deleted
        } = req.body
        const newCategory = {
            user_id,
            category_name,
            category_description,
            is_deleted
        }

        for (const [key, value] of Object.entries(newCategory))
            if (value == null)
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
        categoryService.insertCategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${category.id}`))
                    .json(serializeCategory(category))
            })
            .catch(next)
    })

categoryRouter
    .route('/:category_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.category_id))) {
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }
        categoryService.getCategoryById(
            req.app.get('db'),
            req.params.category_id
        )
            .then(category => {
                if (!category) {
                    return res.status(404).json({
                        error: {
                            message: `Category doesn't exist`
                        }
                    })
                }
                res.category = category
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCategory(res.category))
    })
    //relevant
    .patch(jsonParser, (req, res, next) => {
        const {
            user_id,
            category_name,
            category_description
        } = req.body
        const categoryToUpdate = {
            user_id,
            category_name,
            category_description
        }

        const numberOfValues = Object.values(categoryToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain a user id, category name, or category description`
                }
            })

        categoryService.updateCategory(
            req.app.get('db'),
            req.params.category_id,
            categoryToUpdate
        )
            .then(updatedCategory => {
                res.status(200).json(serializeCategory(updatedCategory[0]))
            })
            .catch(next)
    })
    //relevant
    .delete((req, res, next) => {
        categoryService.deleteCategory(
            req.app.get('db'),
            req.params.category_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

categoryRouter
    .route('/user/:user_id')
    .all((req,res,next) => {
        categoryService.getCategoriesByUserId(
            req.app.get('db'),
            req.params.user_id
        )
        .then(categories => {
            if (!categories){
                return res.status(404).json({
                    error: {
                        message: `user_id doesn't exist`
                    }
                })
            }
            res.json(categories)
            next()
        })
        .catch(next)
    })

module.exports = categoryRouter