import { Meteor }      from 'meteor/meteor';
import { Accounts }    from 'meteor/accounts-base';
import { Template }    from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './Login.html';

Template.login.onCreated(function () {
  this.showSignup = new ReactiveVar(false);
  this.authError  = new ReactiveVar('');
});

Template.login.helpers({
  showSignup() { return Template.instance().showSignup.get(); },
  authError()  { return Template.instance().authError.get(); },
});

Template.login.events({
  'click .auth-toggle-link'(e, instance) {
    instance.showSignup.set(!instance.showSignup.get());
    instance.authError.set('');
  },

  'submit .login-fields'(e, instance) {
    e.preventDefault();
    instance.authError.set('');

    const username = e.target.username.value.trim();
    const password = e.target.password.value;

    if (!username || !password) {
      instance.authError.set('Please fill in all fields.');
      return;
    }

    Meteor.loginWithPassword(username, password, (err) => {
      if (err) {
        const messages = {
          'User not found':         'No account found with that username.',
          'Incorrect password':     'Incorrect password. Please try again.',
          'Match failed':           'Please fill in all fields.',
        };
        instance.authError.set(
          messages[err.reason] || 'Login failed. Please try again.'
        );
      }
    });
  },

  // ── Signup ────────────────────────────────────────────
  'submit .register-fields'(e, instance) {
    e.preventDefault();
    instance.authError.set('');

    const username        = e.target.username.value.trim();
    const password        = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!username || !password) {
      instance.authError.set('Please fill in all fields.');
      return;
    }
    if (username.length < 3) {
      instance.authError.set('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 6) {
      instance.authError.set('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      instance.authError.set('Passwords do not match.');
      return;
    }

    Accounts.createUser({ username, password }, (err) => {
      if (err) {
        const messages = {
          'Username already exists': 'That username is already taken.',
        };
        instance.authError.set(
          messages[err.reason] || 'Could not create account. Try again.'
        );
      }
    });
  },
});