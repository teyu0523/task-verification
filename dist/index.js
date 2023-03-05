const core = require('@actions/core');
const github = require('@actions/github');


async function getSuccessLabelStatus() {
  let successStatus = core.getInput('success-label-status')
  if (successStatus === undefined || successStatus === null || successStatus === '') {
    throw new Error("Empty success label.")
  } else {
    console.log("Found label status")
  }
  return successStatus
}

async function getFailureLabelStatus() {
  let failureStatus = core.getInput('failure-label-status')
  if (failureStatus === undefined || failureStatus === null || failureStatus === '') {
    throw new Error("Empty failure label.")
  } else {
    console.log("Found label status")
  }
  return failureStatus
}

async function getContextStringStatus() {
  let status = core.getInput('context-string-status')
  if (status === undefined || status === null || status === '') {
    throw new Error("Empty success context string.")
  } else {
    console.log("Found context string status")
  }
  return status
}

async function setLabelStatus(status) {
  // console.log(`Apply label status: ${status}`);
  // obtain token
  const octokit = github.getOctokit(core.getInput('github-token'));
  octokit.rest.issues.addLabels({ 
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.pull_request.number,
    labels: status
  });
}

async function removeLabelStatus(status) {
  // console.log(`Remove label status: ${status}`);
  // obtain token
  const octokit = github.getOctokit(core.getInput('github-token')); 
  octokit.rest.issues.removeLabel({ 
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.pull_request.number,
    name: status
  });
}

async function setContextStringStatus(description, state) {
  // console.log(`Apply context string status: ${status}`);
  // obtain token
  try {
    const octokit = github.getOctokit(core.getInput('github-token'));


    // console.log(octokit)
    octokit.rest.repos.setStatusCheckContexts({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: github.context.payload.pull_request.head.sha,
      state: state,
      target_url: `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/pull/${github.context.payload.pull_request.number}`,
      description: description,
      context: 'Task validator'
    });
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function run() 
{
  try {

    // inputs
    const statusTypes = core.getInput('status-types')

    // get description body
    const prBody = github.context.payload.pull_request.body;
    const taskComplete = core.getInput('check-boxes');
    const taskStatus = prBody.includes(`- [x] ${taskComplete}`);

    console.log(taskStatus);

    // update the status
    switch (statusTypes) {
      case "label":
        setLabelStatus(taskStatus?getSuccessLabelStatus():getFailureLabelStatus())
        removeLabelStatus(taskStatus?getFailureLabelStatus():getSuccessLabelStatus())
        break;

      case "context-string":
        setContextStringStatus(getContextStringStatus(), taskStatus?'success':'failure')
        break;

      case "label/context-string":
        setContextStringStatus(getContextStringStatus(), taskStatus?'success':'failure')
        // label specific
        setLabelStatus(taskStatus?getSuccessLabelStatus():getFailureLabelStatus())
        removeLabelStatus(taskStatus?getFailureLabelStatus():getSuccessLabelStatus())
        break;
      default:
        alert("Unsupported type: ${statusTypes}. Do nothing...")
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()