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
  private emotionalState:EmotionalState = new EmotionalState();
  private UIElements:UIElement[] = [];
  private gamma;
  private alpha;
  private epsilon;
  private q_values:any[] = [];
  private rewards:any[] = [];
  private actions:string[] = []

  constructor(alpha:number,gamma:number,epsilon:number){  
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
  }
    
  addUIElement = (uiElement:UIElement) => {
    this.UIElements.push(uiElement)
  }
  getUIElement = (element:number) => {
    return this.UIElements[element];
  }
  getUIElements = () => {
    return this.UIElements;
  }
  getEmotionalState = () => {
    return this.emotionalState;
  }
  setGamma = (discounting_factor:number) => {
    this.gamma = discounting_factor;
  }
  getGamma = () => {
    return this.gamma;
  }
  setAlpha = (learning_rate:number) => {
    this.alpha = learning_rate;
  }
  getAplha = () => {
    return this.alpha;
  }
  getRewards = () => {
    // returning content of rewards without "outermost" array
    return this.rewards[0];
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
    
    if (this.getRewards()[e1][e2][e3][e4][emotional_state] == 1){
      return true
    } else {
      return false
    }
  }

  get_starting_state = () => {
    // choose a random non-terminal state for the elements, depending on number of states
    this.getUIElement(0).setProperty(Math.floor(Math.random() * this.getUIElement(0).getPropertyCount()));
    this.getUIElement(1).setProperty(Math.floor(Math.random() * this.getUIElement(1).getPropertyCount()));
    this.getUIElement(2).setProperty(Math.floor(Math.random() * this.getUIElement(2).getPropertyCount()));
    this.getUIElement(3).setProperty(Math.floor(Math.random() * this.getUIElement(3).getPropertyCount()));
    this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * this.getEmotionalState().getAvailableStateCount()))
    
    while(this.is_terminal_state()){
      this.getUIElement(0).setProperty(Math.floor(Math.random() * this.getUIElement(0).getPropertyCount()));
      this.getUIElement(1).setProperty(Math.floor(Math.random() * this.getUIElement(1).getPropertyCount()));
      this.getUIElement(2).setProperty(Math.floor(Math.random() * this.getUIElement(2).getPropertyCount()));
      this.getUIElement(3).setProperty(Math.floor(Math.random() * this.getUIElement(3).getPropertyCount()));
      this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * this.getEmotionalState().getAvailableStateCount()))
    }
    //return this.getUIElement(0),this.getUIElement(1),this.getUIElement(2),this.getEmotionalState()
  }

    update_user_emotion = () => {
      // This function will get the current emotional state of the user
      // using openFace API in the real implementation
      // currently just returning some emotionalState based on UIElements
      let maxSum = this.getUIElements().length*2;

      let e1 = this.getUIElement(0).getProperty();
      let e2 = this.getUIElement(1).getProperty();
      let e3 = this.getUIElement(2).getProperty();
      let e4 = this.getUIElement(3).getProperty();

      let currentSum = (e1+e2+e3+e4);

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
            let a = this.q_values[0][this.getUIElement(0).getProperty()][this.getUIElement(1).getProperty()][this.getUIElement(2).getProperty()][this.getUIElement(3).getProperty()][this.getEmotionalState().getCurrentEmotion()]
            let index_of_best_action = a.reduce((iMax:any, x:any, i:any, arr:any) => x > arr[iMax] ? i : iMax, 0);
            return index_of_best_action
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

    setupActions = () => {
      // Generate Actions based on elements and property count
      let actionsArr = []
      for (let i = 0; i < this.getUIElements().length; i++) {
          for (let j = 0; j < this.getUIElement(i).getPropertyCount(); j++) {
              actionsArr.push('element'+(i+1)+'_action'+(j))
          }
      }
      this.actions = actionsArr;
    }

    setupQtable = () => {
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
    }

    setupRewards = () => {
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
    }

    setupAgent = () => {

      this.setupActions();
      this.setupQtable();
      this.setupRewards();

    }

    get_best_adaption = (e1_start:number, e2_start:number, e3_start:number, e4_start:number,emotion_start:number):number[] => {
      this.getUIElement(0).setProperty(e1_start);
      this.getUIElement(1).setProperty(e2_start);
      this.getUIElement(2).setProperty(e3_start);
      this.getUIElement(3).setProperty(e4_start);
      this.getEmotionalState().setCurrentEmotionalState(emotion_start);
      let best_adaption:any[] = [];
      if(this.is_terminal_state()){
        return best_adaption
      } else { // If legal starting state
        let e1 = this.getUIElement(0).getProperty();
        let e2 = this.getUIElement(1).getProperty();
        let e3 = this.getUIElement(2).getProperty();
        let e4 = this.getUIElement(3).getProperty();
        let emotion = this.getEmotionalState().getCurrentEmotion();

        
        best_adaption.push([e1,e2,e3,e4,emotion])
        // Continue until goal
        let action_index;
        while(!this.is_terminal_state()){
          // get the next action to take (epsilon used in method)
          action_index = this.get_next_action()
          // use action to get next state
          this.get_next_state(action_index)
          best_adaption.push([
            this.getUIElement(0).getProperty(),
            this.getUIElement(1).getProperty(),
            this.getUIElement(2).getProperty(),
            this.getUIElement(3).getProperty(),
            this.getEmotionalState().getCurrentEmotion()
          ])
        }
      }
      return best_adaption
    }

    train = (training_range:number) => {
      let action_index;
      for (let i = 0; i < training_range; i++) {
        this.get_starting_state();
        while(!this.is_terminal_state()){
          // chose new action
          action_index = this.get_next_action()
          // Store old state
          let old_e1 = this.getUIElement(0).getProperty()
          let old_e2 = this.getUIElement(1).getProperty()
          let old_e3 = this.getUIElement(2).getProperty()
          let old_e4 = this.getUIElement(3).getProperty()
          let old_emotion = this.getEmotionalState().getCurrentEmotion()
          // Move to next state
          this.get_next_state(action_index)
          // State now updated

          // Receive reward for moving to new state
          // Calculate temporal_difference
          let reward = this.rewards[0][this.getUIElement(0).getProperty()][this.getUIElement(1).getProperty()][this.getUIElement(2).getProperty()][this.getUIElement(3).getProperty()][this.getEmotionalState().getCurrentEmotion()]
          let old_q_value = this.q_values[0][old_e1][old_e2][old_e3][old_e4][old_emotion][action_index]
          let temporal_difference = reward + (this.gamma * Math.max(...this.q_values[0][this.getUIElement(0).getProperty()][this.getUIElement(1).getProperty()][this.getUIElement(2).getProperty()][this.getUIElement(3).getProperty()][this.getEmotionalState().getCurrentEmotion()])) - old_q_value
          //console.log('from: '+old_e1,old_e2,old_e3,old_e4,old_emotion)
          //console.log('to: '+this.getUIElement(0).getProperty(),this.getUIElement(1).getProperty(),this.getUIElement(2).getProperty(),this.getUIElement(3).getProperty(),this.getEmotionalState().getCurrentEmotion())
          //console.log('reward: '+reward)
          //console.log('old_q_value: '+old_q_value)
          //console.log('temporal_difference: '+temporal_difference)
          // Update Q-value for the previous state and action pair
          let new_q_value = old_q_value + (this.alpha * temporal_difference)
          this.q_values[0][old_e1][old_e2][old_e3][old_e4][old_emotion][action_index] = new_q_value
          //console.log('new_q_value: '+new_q_value)
        }
      }
      console.log('Training Complete!')
      console.log(training_range+' rounds')
    }

    init = () => {
       
    }
}

const agent = new Agent(0.9,0.9,0.9)

agent.addUIElement(new UIElement(3,2,'element1'))
agent.addUIElement(new UIElement(3,2,'element2'))
agent.addUIElement(new UIElement(3,2,'element3'))
agent.addUIElement(new UIElement(3,2,'element4'))


agent.setupAgent()
agent.train(10000)
let adaptionResult = agent.get_best_adaption(0,0,0,1,4)
console.log(adaptionResult)
console.log('Number of adaptions to goal '+adaptionResult.length)
//console.log(agent.get_best_adaption(1,1,1,1,4))
//console.log(agent.get_best_adaption(2,2,2,2,6))



//agent.init()
