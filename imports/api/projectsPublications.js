import { Meteor } from 'meteor/meteor';
import { ProjectsCollection } from '../db/ProjectsCollection';
import { TasksCollection } from '../db/TaskCollection';

Meteor.publish('projects', function publishProjects() {
  if (!this.userId) return this.ready();
  return ProjectsCollection.find({ userId: this.userId });
});

Meteor.publish('projectTasks', function publishProjectTasks() {
  if (!this.userId) return this.ready();
  return TasksCollection.find({
    userId:    this.userId,
    projectId: { $exists: true },
  });
});