export const getNow = (req) => {
  //   console.log(process.env.TEST_MODE);

  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }

  return Date.now();
};
