import { Agent } from "./classes/Agent";

const agent = new Agent(0.9,0.9,0.9)

agent.setupAgent()
//agent.run(0,0,0,0,0,4)
agent.train(100000)
agent.run(0,0,0,0,0,4)

//let adaptionResult = agent.get_best_adaption(0,0,0,0,0,4)
//console.log(adaptionResult)
//console.log('Number of adaptions to goal '+adaptionResult.length)
