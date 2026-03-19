import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../db/TaskCollection";

Meteor.methods({
  async "tasks.insert"(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in");
    }
    if (!text.trim()) {
      throw new Meteor.Error("text-required", "Task text cannot be empty");
    }

    return await TasksCollection.insertAsync({
      text: text.trim(),
      userId: this.userId,
      createdAt: new Date(),
      isChecked: false,
    });
  },

  async "tasks.remove"(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in");
    }

    return await TasksCollection.removeAsync(taskId);
  },

  async "tasks.setIsChecked"(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in");
    }

    return await TasksCollection.updateAsync(taskId, {
      $set: { isChecked },
    });
  },

  async "tasks.assignToProject"(taskId, projectId) {
    check(taskId, String);
    check(projectId, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in");
    }

    return await TasksCollection.updateAsync(taskId, {
      $set: { projectId },
    });
  },
});
