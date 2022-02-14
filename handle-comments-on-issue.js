
module.exports = handleCommentingOnIssue;
const { Octokit } = require("@octokit/core");

async function handleCommentingOnIssue(context) {
    const comment = context.payload.comment
    await checkCommentAuthor(comment, octokit, context)
}

async function checkCommentAuthor(comment, octokit, context) {
    const admins = ['blackgirlbytes'];
    const pendingMaintainerArray = context.payload.issue.title.match(/\@(.*)/)
    const pendingMaintainerUsername = pendingMaintainerArray[1]


    const commentAuthor = comment.user.login
    if (admins.includes(commentAuthor)) {
        console.log('an admin commented on this issue')
        await checkCommentBody(comment, octokit, context, pendingMaintainerUsername)
    } else if (commentAuthor === pendingMaintainerUsername) {
        console.log('this is not a comment from an admin')
    }
}

async function checkCommentBody(comment, octokit, context, pendingMaintainerUsername) {
    const commentBody = comment.body.toUpperCase();

    if (commentBody === 'APPROVED') {
        await addUserToTeam(pendingMaintainerUsername)
    }
}

async function addUserToTeam(pendingMaintainerUsername) {
    const octokit = new Octokit({
        // pass in GitHub personal access token
        auth: 'insert personal access token',
    });
    const result = await octokit.request('PUT /orgs/{org}/teams/{team_slug}/memberships/{pendingMaintainerUsername}', {
        org: 'gcodehouse',
        team_slug: 'mentors',
        username: pendingMaintainerUsername,
        role: 'member',
    }).catch(async (err) => {
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
