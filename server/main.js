import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/tasksMethods';
import '/imports/api/projectsMethods';  
import '/imports/api/tasksPublications';
import '/imports/api/projectsPublications';


Meteor.startup(async () => {
  const exists = await Meteor.users.findOneAsync({ username: 'meteorite' });
  if (!exists) {
    await Accounts.createUserAsync({
      username: 'meteorite',
      password: 'password',
    });
  }
});