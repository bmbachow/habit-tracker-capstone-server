const categoryService = {
    //relevant
    getCategories(db) {
        return db
            .from('categories')
            .select('*')
    },
    getCategoryById(db, category_id) {
        return db
            .from('categories')
            .select('*')
            .where('categories.id', category_id)
            .first()
    },
    //relevant
    insertCategory(db, newCategory) {
        return db
            .insert(newCategory)
            .into('categories')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateCategory(db, category_id, newCategory) {
        return db('categories')
            .where({
                id: category_id
            })
            .update(newCategory, returning = true)
            .returning('*')
    },
    //relevant
    deleteCategory (db, category_id) {
        return db('categories')
            .where({
                'id': category_id
            })
            .update(1, is_deleted)
    }
}

module.exports = categoryService