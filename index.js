/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("star.created", async (context) => {
    console.log('HERE IS THIS WORKING')
    return context.octokit.rest.issues.create({
      owner: 'gcodehouse',
      repo: 'automation-invite',
      title: 'this issue was opened by probot',
    });
  });
}