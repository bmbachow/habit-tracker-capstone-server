const habitService = {
    //relevant
    getHabits(db) {
        return db
            .from('habits')
            .select('*')
    },
    getHabitById(db, habit_id) {
        return db
            .from('habits')
            .select('*')
            .where('habits.id', habit_id)
            .first()
    },
    //relevant
    insertHabit(db, newHabit) {
        return db
            .insert(newHabit)
            .into('habits')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateHabit(db, habit_id, newHabit) {
        return db('habits')
            .where({
                id: habit_id
            })
            .update(newHabit, returning = true)
            .returning('*')
    },
    //relevant
    deleteHabit(db, habit_id) {
        return db('habits')
            .where({
                'id': habit_id
            })
            .update(1, is_deleted)
    }
}

module.exports = habitService
