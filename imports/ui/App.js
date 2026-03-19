import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { GroupTasks } from "./react/GroupTasks.jsx";
import TaskList from "./react/components/TaskList.jsx";
import UserMenu from "./react/components/UserMenu.jsx";
import React from "react";

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

  userMenuComponent() {
    const username = getUser()?.username;
    return () => React.createElement(UserMenu, { username });
  },

  taskListComponent() {
    return TaskList;
  },

  reactComponent() {
    return GroupTasks;
  },
});
