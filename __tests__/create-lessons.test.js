const app = require('../index');
const supertest = require('supertest');

describe('POST lessons', () => {
    // Тесты для проверки создания занятий при валидных входных данных.
    const defaultBody = {
        teacherIds: [1,2],
        title: "  Math  ",
        days: [1,2,3,4,5],
        firstDate: "2022-06-05",
        lessonsCount: 50
    };
    test('This test checks the creation of lessons with the default parameters', async () => {
        const response = await supertest(app).post(`/api/lessons`).send(defaultBody);
        expect(response.body.length).toBe(50);
        expect(response.statusCode).toBe(201);
    });
    const bodyWithPropertyLessonsCount = {
        teacherIds: [1,2],
        title: "  Math  ",
        days: [1,2,3,4,5,6],
        firstDate: "2022-06-05",
        lessonsCount: 500
    }
    test('This test checks the creation of lessons with the lessonsCount parameter', async () => {
        const response = await supertest(app).post(`/api/lessons`).send(bodyWithPropertyLessonsCount);
        expect(response.body.length).toBe(300);
        expect(response.statusCode).toBe(201);
    });
    const bodyWithPropertyLastDate = {
        teacherIds: [1,2],
        title: "  Math  ",
        days: [1,2],
        firstDate: "2022-06-05",
        lastDate: "2023-06-05"
    };
    test('This test checks the creation of lessons with the lastDate parameter', async () => {
        const response = await supertest(app).post(`/api/lessons`).send(bodyWithPropertyLastDate);
        expect(response.body.length).toBe(105);
        expect(response.statusCode).toBe(201);
    });
    // Тесты для проверки валидации входных данных
    test('This test checks the creation of lessons with empty parameters', async () => {
        const response = await supertest(app).post(`/api/lessons`).send({
            title: "Red Color"
        });
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the creation of lessons with an invalid title parameters', async () => {
        const response = await supertest(app).post(`/api/lessons`).send({
            teacherIds: [1,2],
            title: "  Math@@@  ",
            days: [1,2],
            firstDate: "2022-06-05",
            lessonsCount: 50
        });
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the creation of lessons with an invalid teacherIds parameters', async () => {
        const response = await supertest(app).post(`/api/lessons`).send({
            teacherIds: ["as1",2],
            title: "  Math  ",
            days: [1,2],
            firstDate: "2022-06-05",
            lessonsCount: 50
        });
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the creation of lessons with an invalid days parameters', async () => {
        const response = await supertest(app).post(`/api/lessons`).send({
            teacherIds: [1,2],
            title: "  Math  ",
            days: [11,2],
            firstDate: "2022-06-05",
            lessonsCount: 50
        });
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the creation of lessons with an invalid date parameters', async () => {
        const response = await supertest(app).post(`/api/lessons`).send({
            teacherIds: [1,2],
            title: "  Math  ",
            days: [11,2],
            firstDate: "20222-06-05",
            lessonsCount: 50
        });
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the creation of lessons with an invalid lessonsCount parameters', async () => {
        const response = await supertest(app).post(`/api/lessons`).send({
            teacherIds: [1,2],
            title: "  Math  ",
            days: [11,2],
            firstDate: "20222-06-05",
            lessonsCount: "adq"
        });
        expect(response.statusCode).toBe(400);
    });
});