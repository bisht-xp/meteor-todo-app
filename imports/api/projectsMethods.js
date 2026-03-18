import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { ProjectsCollection } from '../db/ProjectsCollection';
import { TasksCollection } from '../db/TaskCollection';

Meteor.methods({
  async 'projects.insert'(name) {
    check(name, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }
    if (!name.trim()) {
      throw new Meteor.Error('name-required', 'Project name cannot be empty');
    }

    return await ProjectsCollection.insertAsync({
      name:      name.trim(),
      userId:    this.userId,
      createdAt: new Date(),
    });
  },

  async 'projects.remove'(projectId) {
    check(projectId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }

    // Also delete all tasks belonging to this project
    await TasksCollection.removeAsync({ projectId });
    return await ProjectsCollection.removeAsync(projectId);
  },

  // Add a task directly inside a project
  async 'tasks.insertInProject'(text, projectId) {
    check(text, String);
    check(projectId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }
    if (!text.trim()) {
      throw new Meteor.Error('text-required', 'Task text cannot be empty');
    }

    return await TasksCollection.insertAsync({
      text:      text.trim(),
      userId:    this.userId,
      projectId,           // link task to project
      createdAt: new Date(),
      isChecked: false,
    });
  },
});