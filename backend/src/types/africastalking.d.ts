declare module 'africastalking' {
  interface AfricasTalkingOptions {
    apiKey:   string;
    username: string;
  }

  interface SMSSendOptions {
    to:      string[];
    message: string;
    from?:   string;
  }

  interface SMSSendResponse {
    SMSMessageData: {
      Message:    string;
      Recipients: Array<{
        statusCode: number;
        number:     string;
        status:     string;
        cost:       string;
        messageId:  string;
      }>;
    };
  }

  interface SMS {
    send(options: SMSSendOptions): Promise<SMSSendResponse>;
  }

  interface AfricasTalkingInstance {
    SMS: SMS;
  }

  function AfricasTalking(options: AfricasTalkingOptions): AfricasTalkingInstance;
  export = AfricasTalking;
}
