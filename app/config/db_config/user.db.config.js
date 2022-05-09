module.exports = (db) => {
   
    // db.user.hasOne(db.address, {as: 'address', foreignKey: 'addressable_id', constraints: false,
    // scope: {
    //     addressable_type: 'user'
    //   }
    // });

    //  // contact
    //  db.user.hasOne(db.contact, {as: 'contact', foreignKey: 'contactable_id', constraints: false,
    //  scope: {
    //     contactable_type: 'user'
    //    }
    //  });
    // db.user.belongsToMany(db.birthCertificateRequest, { as: 'birthCertificateRequests',  through: 'birth_certificate_request_user', foreignKey: 'user_id', otherKey: 'birth_certificate_request_id', onDelete: 'cascade' });
    // db.user.belongsToMany(db.marriedCertificateRequest, { as: 'marriedCertificateRequests',  through: 'married_certificate_request_user', foreignKey: 'user_id', otherKey: 'married_certificate_request_id', onDelete: 'cascade' });
    // db.user.belongsToMany(db.deathCertificateRequest, { as: 'deathCertificateRequests',  through: 'death_certificate_request_user', foreignKey: 'user_id', otherKey: 'death_certificate_request_id', onDelete: 'cascade' });

}