import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from '../db/TaskCollection';
import './App.html';
import './task/Task.js';
import './login/Login.js';

const getUser       = () => Meteor.user();
const isUserLogged  = () => !!getUser();

const HIDE_COMPLETED_STRING = 'hideCompleted';

const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } };
  const userFilter          = user ? { userId: user._id } : {};
  const pendingOnlyFilter   = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
};

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
  this.subscribe('tasks'); // ✅ subscribe since autopublish is removed
});

Template.mainContainer.events({
  'click #hide-completed-button'(event, instance) {
    const current = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !current);
  },

  'click .user'() {
    Meteor.logout();
  },
});

Template.mainContainer.helpers({
  tasks() {
    const instance     = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) return [];

    return TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      { sort: { createdAt: -1 } }
    ).fetch();
  },

  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },

  incompleteCount() {
    if (!isUserLogged()) return '';

    const { pendingOnlyFilter } = getTasksFilter();
    const count = TasksCollection.find(pendingOnlyFilter).count();
    return count ? `(${count})` : '';
  },

  isUserLogged() {
    return isUserLogged();
  },

  getUser() {
    return getUser();
  },
});

Template.form.events({
  'submit .task-form'(event) {
    event.preventDefault();

    const target = event.target;
    const text   = target.text.value;

    Meteor.call('tasks.insert', text, (error) => {
      if (error) {
        alert(error.reason);
      }
    });

    target.text.value = '';
  },
});