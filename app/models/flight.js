const imagePath = "flights"

module.exports = (sequelize, Sequelize) => {
    const Flight = sequelize.define('flights', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        flight_number: {
            type: Sequelize.STRING,
        },
        aircraft: {
            type: Sequelize.STRING,
        },
        departure: {
            type: Sequelize.STRING,
        },
        arrival: {
            type: Sequelize.STRING,
        },
        terminal: {
            type: Sequelize.STRING
        },  
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',      
        paranoid: true
    });

    return Flight;
}   