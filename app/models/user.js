const imagePath = "users"

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: Sequelize.STRING,
        },
        last_name: {
            type: Sequelize.STRING
        },
        company: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            // allowNull: false
        },
        reset_link: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        temp_password: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING,
            get() {
                const img = this.getDataValue('image');
                if(img != null) {
                    const image = `http://${process.env.APP_ADDRESS}:${process.env.APP_PORT}/${imagePath}/${img}`
                    return image;
                }
            },
        },
        access_failed_count: {
            type: Sequelize.INTEGER
        },
        lockOut_End:{
            type: Sequelize.DATE,
        },
        lockout_enabled:{
            type: Sequelize.BOOLEAN,
            defaultValue:false
        },
        is_active:{
            type: Sequelize.BOOLEAN,
            defaultValue:true
        },
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        
        paranoid: true
    });

    let logAttributes  = [ 'id', 'first_name', 'last_name', 'email', 'username', 'is_active', 'image']
    return User;
}