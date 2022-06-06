const lessonsService = require('../services/lessons.service')

class LessonsController {
    async createLessons(req, res){
        try {
            const result = await lessonsService.createLessons(req.body)
            return res.status(201).json(result)
        } catch (error) {
            return res.status(500).send({
                message: "Something went wrong, try again.",
                error: error.message,
            });
        }
    }

    async getLessons(req, res){
        try {
            const result = await lessonsService.getLessons(req.query)
            if (result.length === 0) return res.status(400).json({message: 'Занятий с такими параметрами не найдено!'})
            return res.status(200).json(result)
        } catch (error) {
            res.status(500).json({
                message: "Something went wrong, try again.",
                error: error.message,
            });
        }
    }
}

module.exports = new LessonsController()