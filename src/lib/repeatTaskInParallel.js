// Runs concurrent tasks while staying under a specified concurrent limit.
// e.g. repeatTaskInParallel(2, [{one: 2, two: 3},
// {one: 4, two: 5}], ({one, two}) => one + two) -> Promise with array [5,9]

const repeatTaskInParallel = async ({ concurrentLimit, taskArgs, processorFn }) => {
  const processedTasks = []
  const executingTasks = []

  for (const taskArg of taskArgs) {
    // while processing pool isn't maxed out, keep processing additional tasks
    const processedTask = Promise.resolve().then(() => processorFn(taskArg))
    const executedTask = processedTask.then(() =>
      executingTasks.splice(executingTasks.indexOf(executedTask), 1)
    )

    processedTasks.push(processedTask)
    executingTasks.push(executedTask)

    // when processing pool maxed, wait for one of the executing tasks to complete
    if (executingTasks.length >= concurrentLimit) {
      await Promise.race(executingTasks)
    }
  }
  return Promise.all(processedTasks)
}

module.exports = repeatTaskInParallel
