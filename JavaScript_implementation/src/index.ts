import internal from "stream";
import { EmotionalState } from "./classes/EmotionalState";
import { UIElement } from "./classes/UIElement";

class Agent {
    private emotionalState:EmotionalState = new EmotionalState(0);
    private UIElements:UIElement[] = [];
    private gamma = 0.9;
    private alpha = 0.9;
    private epsilon = 0.01;
    private q_values = {};
    private rewards = {}
    private actions:string[] = []

    constructor(){
    }

    addUIElement = (uiElement:UIElement) => {
        this.UIElements.push(uiElement)
    }
    getUIElements = () => {
        return this.UIElements;
    }
    getUIElement = (element:number) => {
        return this.UIElements[element];
    }
    setEmotionalState = (emotionalState:EmotionalState) => {
        this.emotionalState = emotionalState; 
    }
    getEmotionalState = () => {
        return this.emotionalState;
    }
    setGamma = (discounting_factor:number) => {
        this.gamma = discounting_factor;
    }
    setAlpha = (learning_rate:number) => {
        this.alpha = learning_rate;
    }
    getRewards = () => {
        return this.rewards;
    }
    getQ_Values = () => {
        return this.q_values;
    }
    getActions = () => {
        return this.actions;
    }
    is_terminal_state = (UIElements:UIElement[],EmotionalState:EmotionalState) => {
        // if rewards == 1 for state 
        //  return True
    //      else
        //  return False
    }
    get_starting_location = () => {
        // choose a random non-terminal state for the elements
        this.getUIElement(0).setProperty(Math.floor(Math.random() * this.getUIElement(0).getPropertyCount()));
        this.getUIElement(1).setProperty(Math.floor(Math.random() * this.getUIElement(1).getPropertyCount()));
        this.getUIElement(2).setProperty(Math.floor(Math.random() * this.getUIElement(2).getPropertyCount()));
        this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * this.getEmotionalState().getAvailableStateCount()))

        //while(this.is_terminal_state()){
        /*
        this.getUIElement(0).setProperty(Math.floor(Math.random() * this.getUIElement(0).getPropertyCount()));
        this.getUIElement(1).setProperty(Math.floor(Math.random() * this.getUIElement(1).getPropertyCount()));
        this.getUIElement(2).setProperty(Math.floor(Math.random() * this.getUIElement(2).getPropertyCount()));
        this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * this.getEmotionalState().getAvailableStateCount()))
        //}
        */
        //return this.getUIElement(0),this.getUIElement(1),this.getUIElement(2),this.getEmotionalState()
    }

    argMax(array:any) {
        return array.map((x:any, i:any) => [x, i]).reduce((r:any, a:any) => (a[0] > r[0] ? a : r))[1];
      }

    update_user_emotion = () => {
        // This function will get the current emotional state of the user
        // using openFace API in the real implementation
        // currently just returning some emotionalState based on UIElements
        let minSum = 0;
        let maxSum = this.getUIElements().length*2;

        console.log(maxSum)

        let e1 = this.getUIElement(0).getProperty();
        let e2 = this.getUIElement(1).getProperty();
        let e3 = this.getUIElement(2).getProperty();
        let e4 = this.getUIElement(3).getProperty();

        let currentSum = (e1+e2+e3+e4);
        console.log(currentSum)

        // lower 25%
        if (currentSum < Math.floor(0.25*maxSum)){
            this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * (6 - 3 + 1)) + 3)
        }
        // Middle 50%
        if (currentSum > Math.floor(0.25*maxSum) && currentSum < Math.floor(0.75*maxSum) ){
            this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * (2 - 0 + 1)) + 0)
        }
        // Upper 25%
        if (currentSum > Math.floor(0.75*maxSum)){
            this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * (6 - 3 + 1)) + 3)
        }

    }

    get_next_action = () => {

        if(Math.random() < this.epsilon){
            // return np.argmax(q_values[current_element1_property, current_element2_property, current_element3_property, current_emontionalState])
            return this.argMax(this.q_values)
        } else {
            return Math.floor(Math.random() * this.getActions().length)
        }
    }

    get_next_state = () => {
        
    }


    setupAgent = () => {

        // Generate Actions based on properties on elements
        console.log(this.getUIElements())

        let actionsArr = []
        for (let i = 0; i < this.getUIElements().length; i++) {
            for (let j = 0; j < this.getUIElement(i).getPropertyCount(); j++) {
                actionsArr.push('element'+(i+1)+'_action'+(j+1))
            }
        }
        this.actions = actionsArr;

        console.log(this.actions[this.get_next_action()])
        console.log(
            this.getUIElement(0).getProperty(),
            this.getUIElement(1).getProperty(),
            this.getUIElement(2).getProperty(),
            this.getUIElement(3).getProperty(),
            this.getEmotionalState().getCurrentEmotion()
        )

        this.get_starting_location()

        console.log(
            this.getUIElement(0).getProperty(),
            this.getUIElement(1).getProperty(),
            this.getUIElement(2).getProperty(),
            this.getUIElement(3).getProperty(),
            this.getEmotionalState().getCurrentEmotion()
        )

        this.update_user_emotion()

        console.log(
            this.getUIElement(0).getProperty(),
            this.getUIElement(1).getProperty(),
            this.getUIElement(2).getProperty(),
            this.getUIElement(3).getProperty(),
            this.getEmotionalState().getCurrentEmotion()
        )

    }

    init = () => {
       

    }
}

const agent = new Agent()

agent.addUIElement(new UIElement(3,2,'element1'))
agent.addUIElement(new UIElement(3,2,'element2'))
agent.addUIElement(new UIElement(3,2,'element3'))
agent.addUIElement(new UIElement(3,2,'element4'))


agent.setupAgent()

