const imagePath = "aircrafts"

module.exports = (sequelize, Sequelize) => {
    const Aircraft = sequelize.define('aircrafts', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        aircraft_number: {
            type: Sequelize.STRING,
        },
        passenger_capacity: {
            type: Sequelize.STRING,
        },
        crew_capacity: {
            type: Sequelize.STRING
        },  
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',      
        paranoid: true
    });

    return Aircraft;
}   