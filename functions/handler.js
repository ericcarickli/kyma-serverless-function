module.exports = {
    main: async function (event, context) {
      const message = `Hello ` + process.env.NAME
        + ` from the Kyma Function ${context["function-name"]}`
        + ` running on ${context.runtime}!`;
      console.log(message);
      return message;
    }
}