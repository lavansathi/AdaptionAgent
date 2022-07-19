import { Agent } from "./classes/Agent";

const agent = new Agent(0.9,0.9,0.9)

agent.setupAgent()
//agent.run(0,0,0,0,0,4)
//agent.train(1000)
agent.run(1,1,1,0,0)

/*
let adaptionResult = agent.get_best_adaption(0,0,0,0,0,4)
console.log(adaptionResult)
console.log('Number of adaptions to goal '+adaptionResult.length)
console.log("Goal "+adaptionResult[adaptionResult.length-1])
*/