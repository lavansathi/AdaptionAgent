import { EmotionalState } from "./EmotionalState";
import { UIElement } from "./UIElement";
//this would be the tree
interface Node {
    emotionalState:EmotionalState;
    UIElement:UIElement[];
    child: Node
    N: number; // amount of simulations
    Q: number; //amount of wins has out of the amount of simulations
    }

    //This is the selection function using upper confidence tree
    function ucb(node: Node, c:number): number {
        const exploit = node.Q / node.N
        const explore = c * Math.sqrt(Math.log(node.N) / node.child.N)
        return exploit + explore;
    }

    //This could be the simulation and results there of
    function simulation(emotionalState:EmotionalState, uiElement: UIElement): number{
        return 1;
    }
