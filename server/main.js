import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/db/TaskCollection';
import '/imports/api/tasksMethods';
import '/imports/api/projectsMethods';       // ← missing!
import '/imports/api/tasksPublications';
import '/imports/api/projectsPublications';


const SEED_USERNAME = "meteorite";
const SEED_PASSWORD = "password";

Meteor.startup(async () => {
  // ✅ Get or create the seed user FIRST, then use their _id
  let user = await Meteor.users.findOneAsync({ username: SEED_USERNAME });

  if (!user) {
    console.log("--- CREATING SEED USER ---");
    try {
      const userId = await Accounts.createUserAsync({
        username: SEED_USERNAME,
        password: SEED_PASSWORD,
      });
      user = await Meteor.users.findOneAsync(userId);
      console.log("--- SEED USER CREATED SUCCESSFULLY ---");
    } catch (e) {
      console.error("Error creating user:", e.reason || e.message);
      return; // stop if user creation failed
    }
  } else {
    console.log("--- SEED USER ALREADY EXISTS ---");
  }

  // ✅ Now user._id is safely available here
  if ((await TasksCollection.find().countAsync()) === 0) {
    console.log("--- SEEDING TASKS ---");
    const seedTasks = [
      "First Task", "Second Task", "Third Task",
      "Fourth Task", "Fifth Task", "Sixth Task", "Seventh Task",
    ];

    for (const text of seedTasks) {
      await TasksCollection.insertAsync({
        text,
        userId: user._id,   // ✅ now correctly scoped
        createdAt: new Date(),
        isChecked: false,
      });
    }
  }
});