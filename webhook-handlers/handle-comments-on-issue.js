
module.exports = handleCommentingOnIssue;
const { Octokit } = require("@octokit/core");
// const octokit = new Octokit();

async function handleCommentingOnIssue(app, context) {
    const comment = context.payload.comment
    await checkCommentAuthor(comment, context)
}

async function checkCommentAuthor(comment, context) {
    const admins = ['blackgirlbytes'];
    const pendingMaintainerArray = context.payload.issue.title.match(/\@(.*)/)
    const pendingMaintainerUsername = pendingMaintainerArray[1]


    const commentAuthor = comment.user.login
    if (admins.includes(commentAuthor)) {
        console.log('an admin commented on this issue')
        await checkCommentBody(comment, context, pendingMaintainerUsername)
    } else if (commentAuthor === pendingMaintainerUsername) {
        console.log('this is not a comment from an admin')
    }
}

async function checkCommentBody(comment, context, pendingMaintainerUsername) {
    const commentBody = comment.body.toUpperCase();
    console.log('show me the comment body', commentBody)
    if (commentBody === 'APPROVED') {
        await addUserToTeam(pendingMaintainerUsername)
    }
}

async function addUserToTeam(pendingMaintainerUsername) {
    const { personalAccessTokenData } = await require("./ssm-handler");
    const myOctokit = new Octokit({
        // pass in GitHub personal access token
        auth: await personalAccessTokenData,
    });
    const result = await myOctokit.request('PUT /orgs/{org}/teams/{team_slug}/memberships/{username}', {
        org: 'GCodeHouse',
        team_slug: 'Mentors',
        username: pendingMaintainerUsername,
        role: 'member',
    }).catch(async (err) => {
        console.log('this is an error', err)
        if (err.status === 403) {
            console.log(`Forbidden ${err.status}`)
        }
        if (err.status === 422) {
            console.log(`Unprocessable Entity ${err.status}`);
        }
    }
    );
    if (result) {
        if (result.status === 200) {
            console.log("user added to team. Success:", result.status);
        }
    }
}
