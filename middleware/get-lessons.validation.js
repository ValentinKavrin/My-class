module.exports = function (req, res, next) {
    if (req.method === "OPTION") {
        next()
    }
    try {
        const dateReg = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');
        const statusReg = new RegExp('^[0-1]$');
        const numberReg = new RegExp('^[0-9]+$');

        const date = req.query.date;
        const status = req.query.status;
        const teacherIds = req.query.teacherIds;
        const studentsCount = req.query.studentsCount;
        const page = req.query.page;
        const lessonsPerPage = req.query.lessonsPerPage;

        if (date) {
            if (date.includes(',')) {
                const arrayDate = date.split(',');
                if (!dateReg.test(arrayDate[0])) return res.status(400).json('Неверный формат даты, ожидалось "2000-01-01,2000-01-02"');
                if (!dateReg.test(arrayDate[1])) return res.status(400).json('Неверный формат даты, ожидалось "2000-01-01,2000-01-02"');
            } else {
                if (!dateReg.test(date)) return res.status(400).json('Неверный формат даты, ожидалось "2000-01-01"');
            }
        }
        if (status) {
            if (!statusReg.test(status)) return res.status(400).json('Неверный формат, ожидалось число (0 или 1)');
        }
        if (teacherIds) {
            if (teacherIds.includes(',')) {
                const arrayIds = teacherIds.split(',');
                for (let i = 0; i < arrayIds.length; i++) {
                    if (!numberReg.test(arrayIds[i])) {
                        return res.status(400).json('Неверный формат, ожидалась строка чисел через запятую');
                    }
                }
            } else {
                if (!numberReg.test(teacherIds)) return res.status(400).json('Неверный формат, ожидалось число');
            }
        }
        if (studentsCount) {
            if (studentsCount.includes(',')) {
                const arrayCount = studentsCount.split(',');
                if (!numberReg.test(arrayCount[0])) return res.status(400).json('Неверный формат, ожидалось "1,2"');
                if (!numberReg.test(arrayCount[1])) return res.status(400).json('Неверный формат, ожидалось "1,2"');
            } else {
                if (!numberReg.test(studentsCount)) return res.status(400).json('Неверный формат, ожидалось число');
            }
        }
        if (page) {
            if (!numberReg.test(page)) return res.status(400).json('Неверный формат, ожидалось число');
        }
        if (lessonsPerPage) {
            if (!numberReg.test(lessonsPerPage)) return res.status(400).json('Неверный формат, ожидалось число');
        }
       next()
    } catch (e) {
        return res.status(400).json( {message: `Something went wrong, try again.`} )
    }
}