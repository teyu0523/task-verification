const core = require('@actions/core');
const github = require('@actions/github');

async function getSuccessLabelStatus() {
  let successStatus = core.getInput('success-status')
  let successLabelStatus = core.getInput('success-label-status')
  if (successLabelStatus) {
    successStatus = successLabelStatus
  }
  if (!successStatus) {
    alert("Empty success label. Do nothing...")
  }
  return successStatus
}

async function getFailureLabelStatus() {
  let failureStatus = core.getInput('failure-status')
  let failureLabelStatus = core.getInput('failure-label-status')
  if (failureLabelStatus) {
    failureStatus = failureLabelStatus
  }
  if (!failureStatus) {
    alert("Empty failure label. Do nothing...")
  }
  return failureStatus
}

async function getSuccessContextStringStatus() {
  let successStatus = core.getInput('success-status')
  let successContextStringStatus = core.getInput('success-context-string-status')
  if (successContextStringStatus) {
    successStatus = successContextStringStatus
  }
  if (!successStatus) {
    alert("Empty success context string. Do nothing...")
  }
  return successStatus
}

async function getFailureContextStringStatus() {
  let failureStatus = core.getInput('failure-status')
  let failureContextStringStatus = core.getInput('failure-context-string-status')
  if (failureContextStringStatus) {
    failureStatus = failureContextStringStatus
  }
  if (!failureStatus) {
    alert("Empty failure context string. Do nothing...")
  }
  return failureStatus
}

async function setLabelStatus(status) {
  console.log("Apply label status: %s", status);
}

async function removeLabelStatus(status) {
  console.log("Remove label status: %s", status);
}

async function setContextStringStatus(status) {
  console.log("Apply context string status: %s", status);
}

async function evaluateTasksStatus() {
    const body = github.context.payload.pull_request?.body
    const regexTaskComplete = /^- \[x\].*/g;
    const regexTaskIncomplete = /^- \[x\].*/g;

    var lines = body.split("\r\n");
    var foundIncomplete = false
    var foundComplete = false

    for (var i = 0; i < arr.length; i++)
    {
      foundIncomplete = lines[i].match(regexTaskIncomplete);
      console.debug("Evaluating line: %s", lines[i])
      if (foundIncomplete) {
        console.debug("  - Incomplete task")
        break;
      } else {
        console.debug("  - complete task")
        foundComplete = lines[i].match(regexTaskComplete);
      }
    }

    if (!foundIncomplete && !foundComplete) {
      console.debug("No task found");
    }

    if (!foundIncomplete) {
      tasksCompleted = true
    }

    return taskCompleted
}

async function run() 
{
  try {
    // inputs
    const statusTypes = core.getInput('status-types')

    const tasksCompleted = evaluateTasksStatus()


    console.log(body);

    // update the status
    switch (statusTypes) {
      case "label":
        if (tasksCompleted) {
          setLabelStatus(getSuccessLabelStatus())
          removeLabelStatus(getFailureLabelStatus())
        } else {
          setLabelStatus(getFailureLabelStatus())
          removeLabelStatus(getSuccessLabelStatus())
        }
        break;
      case "context-string":
        if (tasksCompleted) {
          setContextStringStatus(getSuccessContextStringStatus())
        } else {
          setContextStringStatus(getFailureContextStringStatus())
        }
        break;
      case "label/context-string":
        if (tasksCompleted) {
          // label specific
          setLabelStatus(getSuccessLabelStatus())
          removeLabelStatus(getFailureLabelStatus())
          // context string specific
          setContextStringStatus(getSuccessContextStringStatus())
        } else {
          // label specific
          setLabelStatus(getFailureLabelStatus())
          removeLabelStatus(getSuccessLabelStatus())
          // context string specific
          setContextStringStatus(getFailureContextStringStatus())
        }
        break;
      default:
        alert("Unsupported type: %s. Do nothing...", statusTypes)
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()