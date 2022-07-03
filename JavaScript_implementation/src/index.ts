import internal from "stream";
import { EmotionalState } from "./classes/EmotionalState";
import { UIElement } from "./classes/UIElement";

function createNDimArray(dimensions:any) {
    if (dimensions.length > 0) {
        var dim = dimensions[0];
        var rest = dimensions.slice(1);
        var newArray = new Array();
        for (var i = 0; i < dim; i++) {
            newArray[i] = createNDimArray(rest);
        }
        return newArray;
     } else {
        return 0;
     }
 }


class Agent {
    private emotionalState:EmotionalState = new EmotionalState(0);
    private UIElements:UIElement[] = [];
    private gamma = 0.9;
    private alpha = 0.9;
    private epsilon = 0.01;
    private q_values:any[] = [];
    private rewards:any[] = [];
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
    
    is_terminal_state = () => {
        let e1 = this.getUIElement(0).getProperty();
        let e2 = this.getUIElement(1).getProperty();
        let e3 = this.getUIElement(2).getProperty();
        let e4 = this.getUIElement(3).getProperty();
        let emotional_state = this.getEmotionalState().getCurrentEmotion();
        if (this.rewards[0][e1][e2][e3][e4][emotional_state] == 1){
            return true
        } else {
            return false
        }
    
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

        //console.log(maxSum)

        let e1 = this.getUIElement(0).getProperty();
        let e2 = this.getUIElement(1).getProperty();
        let e3 = this.getUIElement(2).getProperty();
        let e4 = this.getUIElement(3).getProperty();

        let currentSum = (e1+e2+e3+e4);
        //console.log(currentSum)

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

    get_next_action = ():number => {

        if(Math.random() < this.epsilon){
            // return np.argmax(q_values[current_element1_property, current_element2_property, current_element3_property, current_emontionalState])
            return this.argMax(this.q_values)
        } else {
            return Math.floor(Math.random() * this.getActions().length)
        }
    }

    get_next_state = (action_index:number) => {
        let e1 = this.getUIElement(0);
        let e2 = this.getUIElement(1);
        let e3 = this.getUIElement(2);
        let e4 = this.getUIElement(3);
        
        // Element 1 actions
        if(this.actions[action_index] == 'element1_action0' && e1.getProperty() != 0){
            e1.setProperty(0)
        } else if(this.actions[action_index] == 'element1_action1' && e1.getProperty() != 1){
            e1.setProperty(1)
        } else if(this.actions[action_index] == 'element1_action2' && e1.getProperty() != 2){
            e1.setProperty(2)
        } else if(this.actions[action_index] == 'element2_action0' && e2.getProperty() != 0){
            e2.setProperty(0)
        } else if(this.actions[action_index] == 'element2_action1' && e2.getProperty() != 1){
            e2.setProperty(1)
        } else if(this.actions[action_index] == 'element2_action2' && e2.getProperty() != 2){
            e2.setProperty(2)
        } else if(this.actions[action_index] == 'element3_action0' && e3.getProperty() != 0){
            e3.setProperty(0)
        } else if(this.actions[action_index] == 'element3_action1' && e3.getProperty() != 1){
            e3.setProperty(1)
        } else if(this.actions[action_index] == 'element3_action2' && e3.getProperty() != 2){
            e3.setProperty(2)
        } else if(this.actions[action_index] == 'element4_action0' && e4.getProperty() != 0){
            e4.setProperty(0)
        } else if(this.actions[action_index] == 'element4_action1' && e4.getProperty() != 1){
            e4.setProperty(1)
        } else if(this.actions[action_index] == 'element4_action2' && e4.getProperty() != 2){
            e4.setProperty(2)
        } else {
            this.get_next_state(this.get_next_action())
        }

        // Update emotional state
        this.update_user_emotion();

    }


    setupAgent = () => {

        // Generate Actions based on elements and property count
        let actionsArr = []
        for (let i = 0; i < this.getUIElements().length; i++) {
            for (let j = 0; j < this.getUIElement(i).getPropertyCount(); j++) {
                actionsArr.push('element'+(i+1)+'_action'+(j))
            }
        }
        this.actions = actionsArr;
        // Initialize Q-table with 0 values for all pairs
        let QtableArr = createNDimArray([
            this.getUIElement(0).getPropertyCount(),
            this.getUIElement(1).getPropertyCount(),
            this.getUIElement(2).getPropertyCount(),
            this.getUIElement(3).getPropertyCount(),
            this.getEmotionalState().getAvailableStateCount(),
            this.getActions().length
        ])

        this.q_values.push(QtableArr)

        //Initialize rewards table
        let rewardArr = createNDimArray([
            this.getUIElement(0).getPropertyCount(),
            this.getUIElement(1).getPropertyCount(),
            this.getUIElement(2).getPropertyCount(),
            this.getUIElement(3).getPropertyCount(),
            this.getEmotionalState().getAvailableStateCount(),
        ])
        this.rewards.push(rewardArr)

        let rewardArray = this.rewards[0]
        // [Element1][Element2][Element3][Element4][Emotional_State]
        console.log(this.getUIElement(0).getPropertyCount())
        console.log(this.getUIElement(1).getPropertyCount())
        console.log(this.getUIElement(2).getPropertyCount())
        console.log(this.getUIElement(3).getPropertyCount())

        for (let m = 0; m < this.getUIElement(0).getPropertyCount(); m++) {
            for (let n = 0; n < this.getUIElement(1).getPropertyCount(); n++) {
                for (let o = 0; o < this.getUIElement(2).getPropertyCount(); o++) {
                    for (let p = 0; p < this.getUIElement(3).getPropertyCount(); p++) {
                        // Negative rewards
                        rewardArray[m][n][o][p][4] = -1;
                        rewardArray[m][n][o][p][5] = -2;
                        rewardArray[m][n][o][p][6] = -3;
                    }
                }
            }
        }

        // Positive rewards
        rewardArray[1][1][1][1][0] = 1;
        rewardArray[1][1][1][1][1] = 1;
        rewardArray[1][1][1][1][2] = 1;

        console.log(rewardArray[1][1][1][1][5])




        let nextAction = this.get_next_action();

        console.log(this.actions[nextAction])

        this.get_starting_location()

        console.log(
            this.getUIElement(0).getProperty(),
            this.getUIElement(1).getProperty(),
            this.getUIElement(2).getProperty(),
            this.getUIElement(3).getProperty(),
            this.getEmotionalState().getCurrentEmotion()
        )
        
        this.get_next_state(nextAction);

        console.log(
            this.getUIElement(0).getProperty(),
            this.getUIElement(1).getProperty(),
            this.getUIElement(2).getProperty(),
            this.getUIElement(3).getProperty(),
            this.getEmotionalState().getCurrentEmotion()
        )

    }

    init = () => {
        
        /*
        for (let i = 0; i < this.q_values[0].length; i++) {
            for (let j = 0; j < this.q_values[0][0].length; j++) {
                for (let k = 0; k < this.q_values[0][0][0].length; k++) {
                    for (let l = 0; l < this.q_values[0][0][0][0].length; l++) {
                        for (let h = 0; h < this.q_values[0][0][0][0][0].length; h++) {
                        //console.log(i,j,k,l,h)
                            //this.q_values[0][0][0][0][0] = 0;
                        }
                    }
                }
            }
        }

        console.log(this.q_values[0][0][0])
        console.log(this.q_values[0][0][0][0][0])
        */
    }
}

const agent = new Agent()

agent.addUIElement(new UIElement(3,2,'element1'))
agent.addUIElement(new UIElement(3,2,'element2'))
agent.addUIElement(new UIElement(3,2,'element3'))
agent.addUIElement(new UIElement(3,2,'element4'))


agent.setupAgent()
agent.init()
