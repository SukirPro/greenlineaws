const db = require('../../db.config');

const users = [
    {
        first_name: "Administrator",
        last_name: "Admin",
        email: "test@gmail.com",
        username: "admin",
        password: '$2a$08$OfzRGp2mIMG5SbwZRvZfp.EXozR0bmFBDMPHwLSDoyiXbqAgj.6US' //secret
    }
];
db.user.bulkCreate(users);
