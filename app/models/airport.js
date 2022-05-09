const imagePath = "airports"

module.exports = (sequelize, Sequelize) => {
    const Airport = sequelize.define('airports', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        iata_code: {
            type: Sequelize.STRING,
        },
        iso_alpha_3_code: {
            type: Sequelize.STRING
        },
        long_name: {
            type: Sequelize.STRING
        },
        long_location: {
            type: Sequelize.STRING
        },

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',

        paranoid: true
    });

    return Airport;
}   