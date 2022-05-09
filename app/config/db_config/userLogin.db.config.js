module.exports = (db) => {
    db.userLogin.belongsTo(db.user, { as: 'user', foreignKey: 'user_id', constraints: true });
}