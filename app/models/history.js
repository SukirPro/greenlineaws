module.exports = (sequelize, Sequelize) => {
    const History = sequelize.define('historys', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        comments: {
            type: Sequelize.STRING,
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
    return History;
}