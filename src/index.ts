import internal from "stream";
import { Agent } from "./classes/Agent";


const agent = new Agent(0.9,0.9,0.9)

agent.setupAgent()
agent.train(10000)

let adaptionResult = agent.get_best_adaption(0,0,0,0,4)
console.log(adaptionResult)
console.log('Number of adaptions to goal '+adaptionResult.length)

let adaptionResult3 = agent.get_best_adaption(2,2,2,2,5)
console.log(adaptionResult3)
console.log('Number of adaptions to goal '+adaptionResult3.length)

let adaptionResult4 = agent.get_best_adaption(2,0,2,0,6)
console.log(adaptionResult4)
console.log('Number of adaptions to goal '+adaptionResult4.length)
