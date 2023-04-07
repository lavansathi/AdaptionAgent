import { EmotionalState } from "./EmotionalState";
import { UIElement } from "./UIElement";

export class Node {
    emotionalState: EmotionalState
    uielement: UIElement[]
    rj: number //is the total reward for child state
    nj: number //is the number of times the child state has been visited
    ni: number //is the number of times parent state has been visited
    child: Node[]
    parent: Node | null

    constructor(emotionalState: EmotionalState, uielement: UIElement[], rj: number, nj: number, ni: number, child: [], parent: Node | null){
        this.emotionalState = new EmotionalState()
        this.uielement = []
        this.rj = rj
        this.nj = nj
        this.ni = ni
        this.child = child
        this.parent = parent

        this.uielement.push(new UIElement(3,2,'element1'))
        this.uielement.push(new UIElement(3,2,'element2'))
        this.uielement.push(new UIElement(3,2,'element3'))
        this.uielement.push(new UIElement(3,2,'element4'))
    }

}

export class MCTS {
    root: Node

    constructor(root:Node){
        this.root = {
            emotionalState: root.emotionalState,
            uielement: root.uielement,
            rj: root.rj,
            nj: root.nj,
            ni: root.ni,
            child: root.child,
            parent: root.parent,
            
        }
        //this.root.uielement.push(new UIElement(3,2,'element1'))
        //this.root.uielement.push(new UIElement(3,2,'element2'))
        //this.root.uielement.push(new UIElement(3,2,'element3'))
        //this.root.uielement.push(new UIElement(3,2,'element4'))
    }
      

    //selection phase
    selection(node: Node): Node{
        let selectedNode = node
        while(selectedNode.child.length) {
            selectedNode = this.uct(selectedNode)    
        }
        return selectedNode
    }
    //uct algorithm
    uct(node: Node): Node{
        const c = 1 / Math.sqrt(2)
        let selectedNode = node
        let bestValue = -Infinity

        for(const childNode of node.child){
            const explotation = childNode.rj / childNode.nj
            const exploration = c * Math.sqrt((Math.log(node.ni))/childNode.nj)
            const uctValue = explotation + exploration

            if(uctValue > bestValue){
                selectedNode = childNode
                bestValue = uctValue 
            }
        }
        return selectedNode;
    }

    expansion(){

    }

    simulation(){

    }

    backpropagation(){

    }

}