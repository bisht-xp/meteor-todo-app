import { Template }     from 'meteor/templating';
import { Meteor }       from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from '../db/TaskCollection';
import { Projects }        from './projects/Projects.jsx';  // ✅ import component
import './App.html';
import './task/Task.js';
import './login/Login.js';

const getUser      = () => Meteor.user();
const isUserLogged = () => !!getUser();

const HIDE_COMPLETED_STRING = 'hideCompleted';

const getTasksFilter = () => {
  const user                = getUser();
  const hideCompletedFilter = { isChecked: { $ne: true } };
  const userFilter          = user ? { userId: user._id } : {};
  const pendingOnlyFilter   = { ...hideCompletedFilter, ...userFilter };
  return { userFilter, pendingOnlyFilter };
};

Template.mainContainer.onCreated(function () {
  this.state = new ReactiveDict();
  this.subscribe('tasks');
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
    const instance      = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) return [];

    // Only show tasks NOT linked to a project in the main list
    const baseFilter = hideCompleted ? pendingOnlyFilter : userFilter;
    return TasksCollection.find(
      { ...baseFilter, projectId: { $exists: false } },
      { sort: { createdAt: -1 } }
    ).fetch();
  },

  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },

  incompleteCount() {
    if (!isUserLogged()) return '';
    const { pendingOnlyFilter } = getTasksFilter();
    const count = TasksCollection.find({
      ...pendingOnlyFilter,
      projectId: { $exists: false },
    }).count();
    return count ? `(${count})` : '';
  },

  isUserLogged() { return isUserLogged(); },
  getUser()      { return getUser(); },

  // ✅ This is all you need — return the component reference
  projectsComponent() {
    return Projects;
  },
});

Template.form.events({
  'submit .task-form'(event) {
    event.preventDefault();
    const text = event.target.text.value;
    Meteor.call('tasks.insert', text, (err) => {
      if (err) alert(err.reason);
    });
    event.target.text.value = '';
  },
});