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
  new UIElement(4,0,'FontType'),
  new UIElement(2,0,'123'),
  new UIElement(4,0,'Bob'),
  new UIElement(2,0,'Hjørnet'),
  new UIElement(4,0,'HanneFraKommunen'),
];

const agent = new Agent(uiElementArr)

//console.log(util.inspect(agent.getQ_values(),false,null,true))

//agent.run(uiElementArr, test)

const file = fs.createWriteStream('qtable.txt');

file.on('error', (err) => {
  console.log(err)
})


file.write(agent.getQ_values().toString());

file.end();