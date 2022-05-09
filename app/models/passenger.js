const imagePath = "passengers"

module.exports = (sequelize, Sequelize) => {
    const Passenger = sequelize.define('passengers', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        passport_number: {
            type: Sequelize.STRING
        },
        flight_number: {
            type: Sequelize.STRING,
        },
        threat_level: {
            type: Sequelize.STRING,
        },
        forename: {
            type: Sequelize.STRING
        },
        family_name: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        dob: {
            type: Sequelize.DATE,
        },
        nationality: {
            type: Sequelize.STRING,
            allowNull: false
        },
        revenue: {
            type: Sequelize.STRING,
            // allowNull: false
        },
        seat_number: {
            type: Sequelize.STRING
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',

        paranoid: true
    });

    return Passenger;
}   