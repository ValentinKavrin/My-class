const db = require('../db/db');

class LessonsRepository {

    async createLessons(title, date, teachersId) {
        try {
            let arrayIds;
            await db.transaction(function (trx) {
                const lesson = [
                    {title: title, date: date}
                ];
                return trx
                    .insert(lesson, 'id')
                    .into('lessons')
                    .then(function (ids) {
                        teachersId.forEach((lesson_teachers) => {
                            lesson_teachers.lesson_id = ids[0].id;
                        })
                        arrayIds = ids[0].id;
                        return trx('lesson_teachers').insert(teachersId);
                    })
            })
            return arrayIds
        }
        catch (error) {
            throw error
        }
    }

    async getLessons(whereArgs, page, limit) {
        try {
            const select = ['lessons.id as id', 'lessons.date as date', 'lessons.title as title', 'lessons.status as status',
                db.raw(`(select count(*) as visitCount from lesson_students
                where lesson_students.lesson_id = lessons.id and lesson_students.visit = true)`),
                db.raw(`json_agg(jsonb_build_object(
                'id', students.id, 'name', students.name, 'visit', lesson_students.visit)) as students`),
                db.raw(`json_agg(jsonb_build_object(
                'id', teachers.id, 'name', teachers.name)) as teachers`)
            ];
            let query = db('lessons')
                .leftJoin('lesson_students', 'lesson_students.lesson_id', 'lessons.id')
                .leftJoin('students', 'students.id', 'lesson_students.student_id')
                .leftJoin('lesson_teachers', 'lessons.id',  'lesson_teachers.lesson_id')
                .leftJoin('teachers', 'teachers.id', 'lesson_teachers.teacher_id')
                .select(select)
                .groupBy('lessons.id')
                .limit(limit)
                .offset((page - 1) * limit)
            whereArgs.reduce((q, currentWhereStmtArg) => q.where(...currentWhereStmtArg), query);
            return await query
        }
        catch (error) {
            throw error
        }
    }
}

module.exports = new LessonsRepository()

