# Task Verification
The action/task-verification is an action to verify the tasks if it is completed or not to provide status to context string or/and label.

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

## 

```yaml

```
      