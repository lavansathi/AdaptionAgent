import { Agent } from "./classes/Agent";
import { UIElement } from "./classes/UIElement";
import util from 'util';
import fs from "fs"

const test = (state:number[]) => {
  console.log(state)
  console.log()
}

const uiElementArr = [
  new UIElement(3,0,'FontSize'),
  new UIElement(2,0,'ColorTheme'),
  new UIElement(2,0,'Destination'),
  new UIElement(6,0,'FontType'),
  new UIElement(2,0,'123'),
  new UIElement(4,0,'Bob'),
  new UIElement(2,0,'Hjørnet'),
  new UIElement(5,0,'HanneFraKommunen'),
  new UIElement(3,0,'1237'),
  new UIElement(2,0,'555'),
  new UIElement(4,0,'666'),
  new UIElement(3,0,'999f')
];

const agent = new Agent(uiElementArr)

//console.log(util.inspect(agent.getQ_values(),false,null,true))

//agent.run(uiElementArr, test)


// fs.appendFile('testFile',Uint8Array.from(agent.getQ_values()),(err) => {
//   console.log(err)
// })


// fs.writeFile('testFile2',agent.getQ_values());


console.log(Uint8Array.from(agent.getQ_values()))

const file = fs.createWriteStream('qtable.txt');

file.on('error', (err) => {
  console.log(err)
})


file.write(agent.getQ_values().toString());

file.end();