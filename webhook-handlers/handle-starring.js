module.exports = handleStarringRepo;

async function handleStarringRepo(app, context) {
    app.log.info("Yay, the app was loaded!");
    const user = context.payload.sender.login
    return context.octokit.rest.issues.create({
        owner: 'gcodehouse',
        repo: 'automation-invite',
        title: `Pending invitation for @${user}`,
        body: `If you are interested in joining this organization, please respond to the following questions in a comment below:
- [ ] What is your current involvement with G{Code}?
- [ ] Which repository do you want to contribute to?
- [ ] Why do you want to contribute to that repository?`,
        labels: ['pending-invitation']
    });
}