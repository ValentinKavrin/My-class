module.exports = function (req, res, next) {
    if (req.method === "OPTION") {
        next()
    }
    try {
        const dateReg = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');
        const daysReg = new RegExp('^[0-6]$');
        const titleReg = new RegExp('^[a-zA-Z0-9 ]+$');
        const numberReg = new RegExp('^[0-9]+$');

        const teacherIds = req.body.teacherIds;
        const title = req.body.title.trim();
        const days = req.body.days;
        const firstDate = req.body.firstDate;
        const lessonsCount = req.body.lessonsCount;
        const lastDate = req.body.lastDate;

        if (!teacherIds || !title || !days.length || !firstDate || (!lessonsCount && !lastDate)) {
            return res.status(400).json('Ошибка! Недостаточно параметров для post запроса!');
        }

        if (teacherIds.length > 1) {
            for (let i = 0; i < teacherIds.length; i++) {
                if (!numberReg.test(teacherIds[i])) {
                    return res.status(400).json('Неверный формат в поле "teacherIds", ожидался массив чисел через запятую');
                }
            }
        } else {
            if (!numberReg.test(teacherIds)) return res.status(400).json('Неверный формат в поле "teacherIds", ожидалось число');
        }

        if (!titleReg.test(title)) {
            return res.status(400).json('Title должнен содержать только латинские буквы и цифры')
        }
        req.body.title = title;

        if (days.length !== 0) {
            for (let i = 0; i < days.length; i++) {
                if (!daysReg.test(days[i]) || (typeof days[i] !== "number")) {
                    return res.status(400).json('Неверный формат в поле "days", ожидался массив чисел через запятую ([0-6])');
                }
            }
        } else {
            return res.status(400).json('Неверный формат в поле "days", ожидался массив чисел через запятую ([0-6])');
        }

        if (!dateReg.test(firstDate)) return res.status(400).json('Неверный формат даты в поле "firstDate", ожидалось "yyyy-mm-dd"');

        if (lastDate) {
            if (!dateReg.test(lastDate)) return res.status(400).json('Неверный формат даты в поле "lastDate", ожидалось "yyyy-mm-dd"');
        } else {
            if (!numberReg.test(lessonsCount) || (typeof lessonsCount !== "number")) return res.status(400).json('Неверный формат в поле "lessonsCount", ожидалось число (1)');
        }

        next()
    } catch (e) {
        return res.status(400).json( {message: `Something went wrong, try again.`} )
    }
}