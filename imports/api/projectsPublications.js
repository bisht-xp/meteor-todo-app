import { Meteor } from 'meteor/meteor';
import { ProjectsCollection } from '../db/ProjectsCollection';
import { TasksCollection } from '../db/TaskCollection';

// Publish all projects for the logged-in user
Meteor.publish('projects', function publishProjects() {
  if (!this.userId) return this.ready();
  return ProjectsCollection.find({ userId: this.userId });
});

// Publish tasks that belong to projects (separate from regular tasks)
Meteor.publish('projectTasks', function publishProjectTasks() {
  if (!this.userId) return this.ready();
  return TasksCollection.find({
    userId:    this.userId,
    projectId: { $exists: true }, // only tasks linked to a project
  });
});