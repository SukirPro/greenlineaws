const imagePath = "airlines"

module.exports = (sequelize, Sequelize) => {
    const Airline = sequelize.define('airlines', {
        two_letter_code: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        company_name: {
            type: Sequelize.STRING,
        },
        country: {
            type: Sequelize.STRING
        },  
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',      
        paranoid: true
    });

    return Airline;
}   