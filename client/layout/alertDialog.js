'use strict';
import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

export const rShowAlertDialog = new ReactiveVar(false);
let strAlertDialogTitle = '';
let strAlertDialogMessage = '';
let strAlertDialogDefaultValue = null;
let strAlertDialogType = 'alert';
let strAlertDialogInputType = 'text';
let strAlertDialogCustomSetting = '';
let funcAlertDialogCallback = null;
let blAlertDialogOK = false;

export const alertDialog = {
  dialog: function(options) {
    strAlertDialogType = options.type;
    strAlertDialogTitle = options.title;
    strAlertDialogMessage = options.message;
    strAlertDialogInputType = options.inputType || 'text';
    strAlertDialogDefaultValue = options.defaultValue || null;
    strAlertDialogCustomSetting = options.customSetting || '';
    funcAlertDialogCallback = options.callback;
    blAlertDialogOK = false;
    rShowAlertDialog.set(true);
  },
  alert: function(options) {
    const defaultOption = {
      type: 'alert',
      title: ''
    };

    if (typeof options === 'string') {
      defaultOption.message = options;
      options = {};
    }

    Object.assign(defaultOption, options);
    this.dialog(defaultOption);
  },
  confirm: function(options) {
    const defaultOption = {
      type: 'confirm',
      title: ''
    };

    Object.assign(defaultOption, options);
    this.dialog(defaultOption);
  },
  prompt: function(options) {
    const defaultOption = {
      type: 'prompt',
      title: ''
    };

    Object.assign(defaultOption, options);
    this.dialog(defaultOption);
  }
};

Template.alertDialog.onRendered(function() {
  const $form = this.$('form');
  if (strAlertDialogType === 'prompt') {
    $form
      .find('input:first')
      .trigger('focus');
  }
  else {
    $form
      .find('button:last')
      .trigger('focus');
  }

  $(document).on('keydown.alertDialog', (e) => {
    if (e.which === 13) {
      $form.trigger('submit');
    }
    else if (e.which === 27) {
      $form.trigger('reset');
    }
  });
});
Template.alertDialog.onDestroyed(function() {
  $(document).off('keydown.alertDialog');

  const callback = funcAlertDialogCallback;
  const ok = blAlertDialogOK;
  if (strAlertDialogType === 'prompt') {
    const value = this.$('input').val();
    this.$('input').val('');
    if (callback) {
      callback(ok && value);
    }
  }
  else if (callback) {
    callback(ok);
  }
});
Template.alertDialog.helpers({
  customInput() {
    return `
      <input id="alert-dialog-custom-input" class="form-control"
             type="${strAlertDialogInputType}"
             value="${(strAlertDialogDefaultValue === null) ? '' : strAlertDialogDefaultValue}"
             ${strAlertDialogCustomSetting} />
    `;
  },
  alertDialogTitle() {
    return strAlertDialogTitle;
  },
  alertDialogMessage() {
    return strAlertDialogMessage;
  },
  showTitle() {
    return strAlertDialogTitle.length > 0;
  },
  showInput() {
    return strAlertDialogType === 'prompt';
  },
  showCancelButton() {
    return strAlertDialogType !== 'alert';
  }
});
Template.alertDialog.events({
  reset(event) {
    event.preventDefault();
    blAlertDialogOK = false;
    rShowAlertDialog.set(false);
  },
  submit(event) {
    event.preventDefault();
    blAlertDialogOK = true;
    rShowAlertDialog.set(false);
  }
});
