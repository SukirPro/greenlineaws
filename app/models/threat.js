const imagePath = "threats"

module.exports = (sequelize, Sequelize) => {
    const Threat = sequelize.define('threats', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        threat_id: {
            type: Sequelize.STRING,
        },
        passport_number: {
            type: Sequelize.STRING,
        },
        threat_level: {
            type: Sequelize.STRING,
        },
        terrorism: {
            type: Sequelize.STRING
        },  
        smuggling: {
            type: Sequelize.STRING
        },  
        narcotics: {
            type: Sequelize.STRING
        },  
        illegal_immigration: {
            type: Sequelize.STRING
        },  
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',      
        paranoid: true
    });

    return Threat;
}   