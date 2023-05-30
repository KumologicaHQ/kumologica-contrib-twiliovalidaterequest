module.exports = function (App) {
  const { KLNode } = require('@kumologica/devkit');
  class TwilioError extends Error {
    constructor(error) {
      super(error);
      this.name = 'Twilio validation check Failed';
      this.message = error.message;
      this.statusCode = '400';
      this.originalError = error;
    }
  }
  class TwilioValidateRequestNode extends KLNode {
    constructor(props) {
      super(App, props);
      this.name = props.name;
      this.message = props.message;
      this.url = props.url;
      this.twilioSignature = props.twilioSignature;
      this.twilioauthtoken = props.twilioauthtoken;
    }
    async handle(msg) {
      var twilio = require('twilio');
      const Message = App.util.evaluateDynamicField(this.message, msg, this);
      const Url = App.util.evaluateDynamicField(
        this.url,
        msg,
        this
      );
      const TwilioSignature = App.util.evaluateDynamicField(
        this.twilioSignature,
        msg,
        this
      );
      const Twilioauthtoken = App.util.evaluateDynamicField(this.twilioauthtoken, msg, this);

      try {
        msg.header.twilioreqstatus = {};
        let res = {};
        const requestIsValid = twilio.validateRequest(
          Twilioauthtoken,
          TwilioSignature,
          Url,
          Message
        );
          msg.header.twilioreqstatus = requestIsValid;
          this.send(msg);
      } catch (error) {
        this.sendError(new TwilioError(error), msg);
      }
    }
  }
  App.nodes.registerType('TwilioValidateRequest', TwilioValidateRequestNode);
};
