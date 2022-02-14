// /**
//  * This is the main entrypoint to your Probot app
//  * @param {import('probot').Probot} app
//  */
// module.exports = (app) => {
//   app.log.info("Yay, the app was loaded!");

//   app.on("star.created", async (context) => {
//     const user = context.payload.sender.login
//     return context.octokit.rest.issues.create({
//       owner: 'gcodehouse',
//       repo: 'automation-invite',
//       title: `Pending invitation for @${user}`,
//       body: `If you are interested in joining this organization, please respond to the following questions in a comment below:
// - [ ] What is your current involvement with G{Code}?
// - [ ] Which repository do you want to contribute to?
// - [ ] Why do you want to contribute to that repository?`,
//       labels: ['pending-invitation']
//     });
//   });
// }

module.exports = invite;

const handleStarringRepo = require("./webhook-handlers/handle-starring.js");
const handleCommentingOnIssue = require("./webhook-handlers/handle-comments-on-issue.js");

/**
 * @param {import('probot').Probot} app
 */
function invite(app) {
  // listen to all relevant star event actions
  app.on(
    [
      "star.created",
    ],
    handleStarringRepo.bind(null, app)
  );

  app.on(
    [
      "issue_comment.created",
    ],
    handleCommentingOnIssue.bind(null, app)
  );
}