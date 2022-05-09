module.exports = (db, seeder) => {
// Drop and Resync All Table and records

 db.sequelize.sync({ force: true }).then(() => {
   console.log('Drop and Resync with { force: true }');
   seeder.seed()
      setTimeout(function(){
          seeder.PivotTableSeeder()
      },1000)
  });


// newly created table Sync

  db.sequelize.sync({ force: false }).then(() => {
    console.log('Drop and Resync with { force: false }');
  });
}   