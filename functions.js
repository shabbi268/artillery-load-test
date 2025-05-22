module.exports = {
    generatePayload: function (userContext, events, done) {
        let hLength = 10;
        let fLength = 20;
        let hAndFRange = [-2, 2];
        let contributionsLength = 10;
        // Random timestamp between Jan and Dec 2021
        const startDate = new Date('2021-01-08T00:00:00Z').getTime();
        const endDate = new Date('2021-12-31T23:59:59Z').getTime();

        // Utility to generate a float in a given range and return as a string
        const randomFloatStr = (min, max, decimals = 4) => {
            return (Math.random() * (max - min) + min).toFixed(decimals);
        };

        // `h`: array of 10 stringified floats in [-5, 5]
        const h = Array.from({ length: hLength }, () => randomFloatStr(hAndFRange[0], hAndFRange[1]));

        // `f`: array of 40 stringified floats in [-5, 5]
        const f = Array.from({ length: fLength }, () => randomFloatStr(hAndFRange[0], hAndFRange[1]));

        // `contribution`: array of 10 arrays of 5 float values in [-3, 3]
        const contribution = Array.from({ length: contributionsLength }, () =>
            Array.from({ length: 5 }, () => parseFloat(randomFloatStr(-3, 3)))
        );
        const randomTimestamp = new Date(startDate + Math.random() * (endDate - startDate));
        const t = randomTimestamp.toISOString();

        // Random filename
        const fileName = Math.random().toString(36).substring(2, 15);

        // Set context variables
        userContext.vars.t = t;
        userContext.vars.fileName = fileName;
        userContext.vars.h = h;
        userContext.vars.f = f;
        userContext.vars.contribution = contribution;
        userContext.vars["x-access-token"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIkMmEkMTAkM1c4dTV6QTloVnluQUt3SzRidDQudVRLd0ZKRFdKalFsMnZ4R2lPUkI0TTlTc1IxbmFSLmEiLCJjb21wYW55TmFtZSI6IkJ1enphIiwiQVBJTmFtZSI6ImRhdGFVcGxvYWRBUEkiLCJlTWFpbCI6ImJ1enphQHByZWRpY3Ryb25pY3MuY29tIiwiaWF0IjoxNzQ3OTQxMDA2LCJleHAiOjE3NDc5Njk4MDZ9.1TVmK3L_NMpfbIxEU45_SWQJcMZTOeG_QEz7aTCXPUU";
        userContext.vars.unitName = "LTR_080RB_200,EMA - Axis 6";
        userContext.vars.pid = 134;
        userContext.vars.uid = 3;
        userContext.vars.AssetID = 6284;

        return done();
    }
    ,

    logResponse: function (requestParams, response, context, ee, next) {
        // console.log("🚀 ~ requestParams.json.HealthAndFeatures:", requestParams.json.HealthAndFeatures)
        console.log("Response status:", response.statusCode);
        console.log("Response.body:", response.body);

        // Access and log 't' and 'fileName' from userContext.vars
        console.log("fileName:", context.vars.fileName);
        const { statusCode, body } = response;
        // Emit a custom stat for response code
        ee.emit('counter', `status_${statusCode}`, 1);

        // Emit a timer stat for response time
        ee.emit('histogram', 'post_response_time', response.timings.duration);

        // Optional: Check if DB write was acknowledged (depends on API response structure)
        try {
            const resBody = JSON.parse(body);
            if (resBody && resBody.status == "success") {
                ee.emit('counter', 'db_write_success', 1);
            } else {
                ee.emit('counter', 'db_write_fail', 1);
            }
        } catch (e) {
            ee.emit('counter', 'response_parse_fail', 1);
        }
        return next();  // must call next() when done
    }
};
