const HabitService = {
    getAllHabits(knex) {
        return knex
        .from('habits')
        .select('*')
    },

    insertHabit(knex,newHabit) {
        console.log('habit=>',newHabit)
        return knex
        .insert(newHabit)
        .into('habits')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    getHabitById(knex,id) {
        return knex
        .from('habits')
        .select('*')
        .where('id',id)
        .first()
    },
    updateHabit(db, habit_id, newHabit) {
        return db('habits')
            .update(newHabit, returning = true)
            .where({
                id: habit_id
            })
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getHabitByUserId(knex,user_id) {
        return knex
        .from('habits')
        .select('*')
        .where('user_id',user_id)
    },

    deleteHabit(db, habit_id) {
        return db('habits')
            .where({
                'id': habit_id
            })
            .delete()
    }

}
module.exports = HabitService