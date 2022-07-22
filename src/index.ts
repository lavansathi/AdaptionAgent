import { Agent } from "./classes/Agent";
import { UIElement } from "./classes/UIElement";
import util from 'util';

const test = (state:number[]) => {
  console.log(state)
  console.log()
}

const uiElementArr = [
  new UIElement(2,0,'FontSize'),
  new UIElement(2,0,'ColorTheme'),
  new UIElement(2,0,'Destination'),
  new UIElement(2,0,'FontType'),
  new UIElement(2,0,'DialogVisibility')
];

const agent = new Agent(uiElementArr)

//console.log(util.inspect(agent.getQ_values(),false,null,true))

agent.run(1,0,1,0,1,test)
