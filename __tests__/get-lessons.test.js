const app = require('../index');
const supertest = require('supertest');

// Тесты для проверки поведения метода getLessons в зависимости от поступающих валидных параметров.
describe('GET lessons', () => {
    const parameters = {
        date: "2022-06-06",
        status: 0,
        teacherIds: 2,
        studentsCount: 3,
        lessonsPerPage: 10
    }
    test('It responds with an array of lessons', async () => {
        const response = await supertest(app).get("/api");
        expect(response.body.length).toBe(5);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("title");
        expect(response.body[0]).toHaveProperty("date");
        expect(response.body[0]).toHaveProperty("status");
        expect(response.body[0]).toHaveProperty("visitcount");
        expect(response.body[0]).toHaveProperty("students");
        expect(response.body[0]).toHaveProperty("teachers");
        expect(response.statusCode).toBe(200);
    });
    test('This test checks the response to the request with the status parameter', async () => {
        const response = await supertest(app).get(`/api?status=${parameters.status}`);
        response.body.forEach((lesson) => {
            expect(lesson.status).toBe(parameters.status);
        });
        expect(response.body.length).toBe(5);
        expect(response.statusCode).toBe(200);
    });
    test('This test checks the response to the request with the studentsCount parameter', async () => {
        const response = await supertest(app).get(`/api?studentsCount=${parameters.studentsCount}`);
        response.body.forEach((lesson) => {
            expect(lesson.students.length).toBe(parameters.studentsCount);
        });
        expect(response.statusCode).toBe(200);
    });
    test('This test checks the response to the request with the teacherIds parameter', async () => {
        const response = await supertest(app).get(`/api?teacherIds=${parameters.teacherIds}`);
        expect(response.body[0].teachers[0].id).toBe(parameters.teacherIds);
        expect(response.statusCode).toBe(200);
    });
    test('This test checks the response to the request with the date parameter', async () => {
        const response = await supertest(app).get(`/api?date=${parameters.date}`);
        const date = new Date((new Date(parameters.date)).getTime() - 1000 * 60 * 180);
        expect(new Date(response.body[0].date)).toEqual(date);
        expect(response.statusCode).toBe(200);
    });
    test('This test checks the response to the request with the lessonsPerPage parameter', async () => {
        const response = await supertest(app).get(`/api?lessonsPerPage=${parameters.lessonsPerPage}`);
        expect(response.body.length).toBe(parameters.lessonsPerPage);
        expect(response.statusCode).toBe(200);
    });
    // Тесты для проверки поведения метода getLessons в зависимости от поступающих невалидных параметров.
    const badParameters = {
        date: "2019a-09-02",
        status: 3,
        teacherIds: "2a",
        studentsCount: "3a",
        lessonsPerPage: "ff"
    }
    test('This test checks the response to a request with an invalid date parameter', async () => {
        const response = await supertest(app).get(`/api?date=${badParameters.date}`);
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the response to a request with an invalid status parameter', async () => {
        const response = await supertest(app).get(`/api?status=${badParameters.status}`);
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the response to a request with an invalid teacherIds parameter', async () => {
        const response = await supertest(app).get(`/api?teacherIds=${badParameters.teacherIds}`);
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the response to a request with an invalid studentsCount parameter', async () => {
        const response = await supertest(app).get(`/api?studentsCount=${badParameters.studentsCount}`);
        expect(response.statusCode).toBe(400);
    });
    test('This test checks the response to a request with an invalid lessonsPerPage parameter', async () => {
        const response = await supertest(app).get(`/api?lessonsPerPage=${badParameters.lessonsPerPage}`);
        expect(response.statusCode).toBe(400);
    });
});