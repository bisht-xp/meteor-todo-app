import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { GroupTasks } from "./react/GroupTasks.jsx";
import TaskList from "./react/components/TaskList.jsx";

import "./App.html";
import "./login/Login.js";

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

// ── Main container ────────────────────────────────────
Template.mainContainer.events({
  "click .user"() {
    Meteor.logout();
  },
});

Template.mainContainer.helpers({
  isLoggingIn() {
    return Meteor.loggingIn();
  },

  isUserLogged() {
    return isUserLogged();
  },

  getUser() {
    return getUser();
  },

  taskListComponent() {
    return TaskList;
  },

  reactComponent() {
    return GroupTasks;
  },
});
