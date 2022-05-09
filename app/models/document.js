module.exports = (sequelize, Sequelize) => {
    const Document = sequelize.define('documents', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        mime: {
            type: Sequelize.STRING
        },
        extension: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.STRING
        },
        documentable_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        documentable_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        
        paranoid: true
    });
    return Document;
}