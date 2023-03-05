# Task Verification
The action/task-verification is an action to verify the tasks if it is completed or not to provide status to context string or/and label.

# Prerequisites
Before using this workflow, ensure that the following requirements are met:

The repository has a .github/workflows directory.
The repository contains a JavaScript action that validates checkbox tasks.
The pull requests contain checkbox tasks in their description.

# Usage

## Inputs
Automatically detect the PR description with list of tasks required to be completed. 
Optionally pass in the specified markdown format to capture specific list of tasks to verify.

- status-types: label/context-string/label-and-context-string
- success-status: default "Task complete"
- failure-status: default "Task incomplete"

## Output
Create a PR context string, "Task incomplete" or "Task completed" with option to specify custom context string.
Create a label, "Task incomplete" or "Task completed" with option to specify custom label.
 

# Examples
Create a new YAML file in the .github/workflows directory of your repository, such as checkbox-task-validator.yml.
Copy the following YAML code into the file:

```YAML
name: Verify action

on:
  pull_request_target:
    types: [description]
  pull_request:
    types: [edited]

jobs:
  tasks-verification-job:
      - name: tasks verification action step
        id: tasks-verified
        uses: ./ 
        with: 
          status-types: 'label/context-string'

```