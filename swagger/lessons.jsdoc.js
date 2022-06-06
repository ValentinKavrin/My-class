/**
 * @swagger
 * /api/lessons:
 *  post:
 *      tags: [lessons]
 *      summary: Create new lessons
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          teacherIds:
 *                              type: Array[integer]
 *                              description: Ids for add teachers.
 *                              example: [1,2]
 *                          title:
 *                              type: string
 *                              description: The lessons title.
 *                              example: Russian language
 *                          days:
 *                              type: array[integer]
 *                              description: Days of the week for which you need to create classes.
 *                              example: [0,1,4,6]
 *                          firstDate:
 *                              type: date
 *                              description: The first date from which to create classes.
 *                              example: 2022-05-17
 *                          lastDate:
 *                              type: date
 *                              description: The last date from which to create classes.
 *                              example: 2022-05-17
 *                          lessonsCount:
 *                              type: integer
 *                              description: Number of classes. This parameter is mutually exclusive with lastDate
 *                              example: 6
 *      responses:
 *          201:
 *              description: Lessons ids array
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: array[integer]
 *                                  description: The array lesson id.
 *                                  example: [1,2,3,4]
 *          400:
 *              description: RangeError.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Something went wrong, try again.
 *                              error:
 *                                  type: string
 *                                  example: Ошибка валидации входных данных!
 *          500:
 *              description: Serverside error.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Something went wrong, try again.
 *                              error:
 *                                  type: string
 *                                  example: Error.
 * /api/?param=:
 *  get:
 *      tags: [lessons]
 *      summary: Get list lessons with different parameters.
 *      description: There may be several parameters or there may not be any at all, if there are no parameters, the request will return all classes
 *      parameters:
 *      - in: query
 *        name: page
 *        required: true
 *        description: Pagination page number.
 *        schema:
 *            type: integer
 *            example: 1
 *      - in: query
 *        name: lessonsPerPage
 *        description: Number of classes per page.
 *        schema:
 *            type: integer
 *            example: 20
 *      - in: query
 *        name: studentsCount
 *        description: Search by the number of students in the class.
 *        schema:
 *            type: integer
 *            example: 3
 *      - in: query
 *        name: date
 *        description: Search by date, either by one or by range.
 *        schema:
 *            type: date or array[date]
 *            example: 2022-05-17,2022-05-20
 *      - in: query
 *        name: teacherIds
 *        description: Search by teachers, either one or more teachers.
 *        schema:
 *            type: integer or array[integer]
 *            example: 1,2
 *      - in: query
 *        name: status
 *        description: Search by status.
 *        schema:
 *            type: integer
 *            example: 1
 *      produces:
 *         application/json
 *      responses:
 *          200:
 *              description: Lessons array
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: The lesson id.
 *                                  example: 1
 *                              date:
 *                                  type: date
 *                                  description: Date of the lesson.
 *                                  example: 2022-05-17
 *                              title:
 *                                  type: string
 *                                  description: The lessons title.
 *                                  example: Russian language
 *                              status:
 *                                  type: integer
 *                                  description: The lesson class.
 *                                  example: 1
 *                              visitCount:
 *                                  type: integer
 *                                  description: Number of students in the class.
 *                                  example: 5
 *                              students:
 *                                  type: array[object]
 *                                  description: Teacher of the lesson.
 *                                  example: [{id: 1, name: Vasya, visit: true}]
 *                              teachers:
 *                                  type: array[object]
 *                                  description: Teacher of the lesson.
 *                                  example: [{id: 1, name: Svetlana}]
 *          400:
 *              description: RangeError.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Something went wrong, try again.
 *                              error:
 *                                  type: string
 *                                  example: Ошибка валидации входных данных!
 *          500:
 *              description: Serverside error.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Something went wrong, try again.
 *                              error:
 *                                  type: string
 *                                  example: Error.
 */