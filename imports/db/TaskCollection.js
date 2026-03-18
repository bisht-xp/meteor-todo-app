import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TasksCollection = new Mongo.Collection('tasks');
