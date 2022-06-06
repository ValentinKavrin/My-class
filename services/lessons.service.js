const lessonsRepository = require('../repository/lessons.repository');
const getUniqueObjects = require('../helper/arrayFilters');
const db = require('../db/db');

class LessonsService {

    async createLessons(params) {
        const lessonsIds = [];
        const teachersId = [];

        let dayIndex = checkDay(params).dayIndex;
        let firstDate = checkDay(params).firstDate;
        let startDay = checkDay(params).startDay;

        params.teacherIds.forEach((id) => {
            teachersId.push({teacher_id: id});
        })

        if (params.hasOwnProperty('lessonsCount')) {
            for (let i = 0; i < params.lessonsCount; i++) {
                let newDate = new Date(firstDate)

                // Обнуление счетчика дней недели.
                if (dayIndex === params.days.length) {
                    params.days.forEach((element, index) => {
                        params.days[index] = element + 7
                    })
                    dayIndex = 0
                }

                const date = params.days[dayIndex] - startDay
                dayIndex++
                newDate.setDate(newDate.getDate() + date)

                if (checkCountAndDate(lessonsIds, newDate, firstDate)) {
                    break;
                }

                const lesson = await lessonsRepository.createLessons(params.title, newDate, teachersId)
                lessonsIds.push(lesson)
            }
        } else {
            let newDate = new Date;
            const lastDate = new Date(params.lastDate);

            while (newDate.getTime() < lastDate.getTime()){
                newDate = new Date(firstDate);

                // Обнуление счетчика дней недели.
                if (dayIndex === params.days.length) {
                    params.days.forEach((element, index) => {
                        params.days[index] = element + 7;
                    })
                    dayIndex = 0;
                }

                const date = params.days[dayIndex] - startDay;
                dayIndex++;
                newDate.setDate(newDate.getDate() + date);

                if (newDate.getTime() > lastDate.getTime()) {
                    break;
                }

                if (checkCountAndDate(lessonsIds, newDate, firstDate)) {
                    break;
                }

                const lesson = await lessonsRepository.createLessons(params.title, newDate, teachersId);
                lessonsIds.push(lesson);
            }
        }
        return lessonsIds
    }

    async getLessons(filter) {
        const whereArgs = []
        let page = filter.page ? filter.page : 1;
        let limit = filter.lessonsPerPage ? filter.lessonsPerPage : 5;
        if (Object.keys(filter).length !== 0) {
            if (filter.hasOwnProperty('status')) {
                whereArgs.push(['status', filter.status])
            }
            if (filter.hasOwnProperty('date')) {
                if (filter.date.includes(',')) {
                    const date = filter.date.split(',');
                    const startDate = new Date(date[0]);
                    const stopDate = new Date(date[1]);
                    whereArgs.push(['date', '>=', startDate]);
                    whereArgs.push(['date', '<=', stopDate]);
                } else {
                    const date = new Date(filter.date)
                    whereArgs.push(['date', date]);
                }
            }
            if (filter.hasOwnProperty('teacherIds')) {
                if (filter.teacherIds.includes(',')) {
                    const id = filter.teacherIds.split(',')
                    whereArgs.push([db.raw('teachers.id in (' + id.map( _ => '?').join(',') + ')', [...id])])
                } else {
                    whereArgs.push(['teachers.id', filter.teacherIds]);
                }
            }
            if (filter.hasOwnProperty('studentsCount')) {
                // TODO: разобраться в том, как учитывать этот параметр по другому
                const studentsCount = db.raw(`(select count(*) as studentsCount from lesson_students
                where lesson_students.lesson_id = lessons.id)`);
                if (filter.studentsCount.includes(',')) {
                    const countArray = filter.studentsCount.split(',');
                    whereArgs.push([studentsCount, '>=', countArray[0]]);
                    whereArgs.push([studentsCount, '<=', countArray[1]]);
                } else {
                    whereArgs.push([studentsCount, '=', filter.studentsCount]);
                }
            }
        }
        const lessonsArray = await lessonsRepository.getLessons(whereArgs, page, limit);
        // TODO: разобраться почему sql запрос возвращает повторяющиеся строки.
        return getUniqueLessons(lessonsArray);
    }
}

const getUniqueLessons = (array) => {
    const uniqueLessons = [];
    for (let i = 0; i < array.length; i++) {
        array[i].students = getUniqueObjects(array[i].students);
        array[i].teachers = getUniqueObjects(array[i].teachers);
        uniqueLessons.push(array[i])
    }
    return uniqueLessons
}

const checkDay = (params) => {
    let dayIndex = 0
    let firstDate = new Date(params.firstDate)
    let startDay = params.days.find(elem => elem >= firstDate.getDay())
    if (startDay !== undefined) {
        if (startDay !== firstDate.getDay()) {
            firstDate.setDate(firstDate.getDate() + (startDay - firstDate.getDay()))
        }
        dayIndex = params.days.indexOf(startDay)
    } else {
        startDay = new Date(params.firstDate).getDay()
        params.days.forEach((element, index) => {
            params.days[index] = element + 7
        })
    }
    return {
        startDay,
        dayIndex,
        firstDate,
    }
}

const checkCountAndDate = (lessonsIds, newDate, firstDate) => {
    // Проверка на количество занятий.
    if (lessonsIds.length >= 300) {
        return lessonsIds;
    }
    // Проверка по дате (1 год).
    const daysCount = Math.ceil(Math.abs(newDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24));
    if (daysCount >= 365) {
        return lessonsIds;
    }
}


module.exports = new LessonsService()