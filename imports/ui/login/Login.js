import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Login.html';

Template.login.events({
  'submit .login-form'(e) {
    e.preventDefault();
    const target = e.target;
    const username = target.username.value;
    const password = target.password.value;

    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.error("Login Error:", error);
        alert("Login failed: " + error.reason);
      } else {
        console.log("Login successful!");
      }
    });
  }
});