const mongoose = require('mongoose');
 
const Event = require('../models/events');
const User = require('../models/user');
 
const DB_TITLE = 'I<3HACK';
 
mongoose.connect(`mongodb://localhost/${DB_TITLE}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
 
Event.collection.drop();
User.collection.drop();
 
const data = [/*HERE WE WILL HAVE THEEVENTS AND USERS DATA*/]

let users = [];
data.forEach(event => {
    users = users.concat(event.user);
});
 
User.create(users)
  .then(users => {
    console.log(`${users.length} users created.`);
 
    //
    // 2. Create users
    //
 
    //
    const usersIds = users.map(user => user.id); 
    let nth = 0;
 
    // In each event, replace each user object by it's ID (created in 1.)
    const events = data.map(event => {
        event.user.forEach((user, i) => {
        event.user[i] = usersIds[++nth];
      });
      return event;
    });
 
    Event.create(events)
      .then(events => {
        console.log(`${events.length} events created.`);
 
        mongoose.connection.close();
      })
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));