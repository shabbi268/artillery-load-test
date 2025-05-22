module.exports = {
    generatePayload: function (userContext, events, done) {
        // Helper functions for random values
        const randomFloatString = () => (Math.random()).toFixed(3);
        const randomContribution = () => [parseFloat((Math.random() * 0.01).toFixed(5))];
        const randomF = () => [parseFloat((Math.random() * 10).toFixed(2))];

        // Generate a random timestamp between 2023-08-08 and 2023-12-31
        const startDate = new Date('2023-08-08T00:00:00Z').getTime();
        const endDate = new Date('2023-12-31T23:59:59Z').getTime();
        const randomTimestamp = new Date(startDate + Math.random() * (endDate - startDate));
        const t = randomTimestamp.toISOString();

        // Generate random fileName string
        const fileName = Math.random().toString(36).substring(2, 15);

        // Store values in userContext.vars to use in the body
        userContext.vars.t = t;
        userContext.vars.fileName = fileName;
        userContext.vars.h = [randomFloatString()];
        userContext.vars.contribution = [randomContribution()];
        userContext.vars.f = [randomF()];
        userContext.vars["x-access-token"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIkMmEkMTAkbzJrd1ptNmtqSTFtT1k0Zlp0YWJxLktVNG9LU2FVSERJLjNpZFI0QnpQdURXUFF3Qmc1VXUiLCJjb21wYW55TmFtZSI6IkJ1enphIiwiQVBJTmFtZSI6ImRhdGFVcGxvYWRBUEkiLCJlTWFpbCI6ImJ1enphQHByZWRpY3Ryb25pY3MuY29tIiwiaWF0IjoxNzQ3OTMwNjk4LCJleHAiOjE3NDc5NTk0OTh9.T8Yyx1-QZlacPlehNCbWZncHb3t_ru5nXzLcioXPKAg";

        return done();
    },

    logResponse: function (requestParams, response, context, ee, next) {
        console.log("Response status:", response.statusCode);
        console.log("Response body:", response.body);

        // Access and log 't' and 'fileName' from userContext.vars
        console.log("t:", context.vars.t);
        console.log("fileName:", context.vars.fileName);
        return next();  // must call next() when done
    }
};
