import { Meteor }   from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Task.html';

Template.task.events({
  async 'click .toggle-checked'() {
    try {
      await Meteor.callAsync('tasks.setIsChecked', this._id, !this.isChecked);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  },

  async 'click .delete'() {
    try {
      await Meteor.callAsync('tasks.remove', this._id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  },
});