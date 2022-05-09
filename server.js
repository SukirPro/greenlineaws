// const express = require('express');
// const app = express()
// const port = 3100;

// app.get('/', (req, res) => res.send('Welcome!'));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const express = require('express');
const path = require('path');

const IN_PROD = process.env.NODE_ENV === 'production' ? 'production': 'development'
const SESSION_SECRET = process.env.SESSION_SECRET ?  process.env.SESSION_SECRET : 'session'

const app = express();
const cors = require("cors");

const session = require('express-session');

app.use(session({
    name: 'sid',
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: true,
        secure: IN_PROD,
    }
}));

const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json")
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

const logger = require('morgan');
app.use(logger('dev'));

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json())
global.requireContext = require('require-context')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
    next();
});
// /**
//  * @swagger
//  * /api
//  *  getusers
//  */
app.use('/api', require('./app/api'));
// app.use('/', require('./app/routes/web'));

// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./app/api/v1.0/swagger/swagger.json');
// // SwaggerUi
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Set the default views directory to html folder
app.set('views', path.join(__dirname, 'app/views'));
app.set("view engine", "ejs");

app.use(express.static('app/storage'))

const db = require('./app/config/db_config/db.config');

const initial = require('./app/config/db_config/seeds/seeder');

//force: true will drop the table if it already exists
require('./db.migrate')(db, initial)

/**
 * @swgger
 * /test:
 *   get:
 *    desccription:test
 *      responses:
 *          '200':
 *                 description:teetdjhdsfhj
 */
app.get("/test", (req,res)=>{
    res.send('test')
});

require('./service')
const { validator, cache } = require('./app/util')
global.validator = validator
global.cache = cache

global.env = require('./app/config/env')


// Create a Server
const server = app.listen( process.env.PORT || 8082,  function () {

    const host = server.address().address
    const port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})
