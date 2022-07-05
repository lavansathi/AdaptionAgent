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

    this.UIElements.push(new UIElement(3,2,'element1'))
    this.UIElements.push(new UIElement(3,2,'element2'))
    this.UIElements.push(new UIElement(3,2,'element3'))
    this.UIElements.push(new UIElement(3,2,'element4'))
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
  setEpsilon = (epsilon:number) => {
    this.epsilon = epsilon;
  }
  getEpsilon = () => {
    return this.epsilon;
  }
  setRewards = (rewardsArr:any[]) => {
    this.rewards = rewardsArr;
  }
  getRewards = () => {
    // returning content of rewards without "outermost" array
    return this.rewards;
  }
  setQ_Values = (qtable:any[]) => {
    this.q_values = qtable;
  }
  getQ_Values = () => {
    // returning content of q-table without "outermost" array
    return this.q_values;
  }
  setActions = (actions:string[]) => {
    this.actions = actions;
  }
  getActions = () => {
    return this.actions;
  }

  is_terminal_state = () => {
    let e1 = this.getUIElement(0).getState();
    let e2 = this.getUIElement(1).getState();
    let e3 = this.getUIElement(2).getState();
    let e4 = this.getUIElement(3).getState();
    let emotional_state = this.getEmotionalState().getCurrentEmotion();
    
    if (this.getRewards()[e1][e2][e3][e4][emotional_state] == 1){
      return true
    } else {
      return false
    }
  }

  get_starting_state = () => {
    let e1 = this.getUIElement(0);
    let e2 = this.getUIElement(1);
    let e3 = this.getUIElement(2);
    let e4 = this.getUIElement(3);
    let emotion = this.getEmotionalState();

    // choose a random non-terminal state for the elements
    e1.setState(Math.floor(Math.random() * e1.getState_Count()));
    e2.setState(Math.floor(Math.random() * e2.getState_Count()));
    e3.setState(Math.floor(Math.random() * e3.getState_Count()));
    e4.setState(Math.floor(Math.random() * e4.getState_Count()));
    emotion.setCurrentEmotionalState(Math.floor(Math.random() * emotion.getAvailableState_Count()))

    // if terminal find new state
    while(this.is_terminal_state()){
      e1.setState(Math.floor(Math.random() * e1.getState_Count()));
      e2.setState(Math.floor(Math.random() * e2.getState_Count()));
      e3.setState(Math.floor(Math.random() * e3.getState_Count()));
      e4.setState(Math.floor(Math.random() * e4.getState_Count()));
      emotion.setCurrentEmotionalState(Math.floor(Math.random() * emotion.getAvailableState_Count()))
    }
  }

  update_user_emotion = () => {
    // This function will get the current emotional state of the user
    // using openFace API in the real implementation
    // currently just returning some emotionalState based on UIElements
    let e1 = this.getUIElement(0).getState();
    let e2 = this.getUIElement(1).getState();
    let e3 = this.getUIElement(2).getState();
    let e4 = this.getUIElement(3).getState();

    let checkArr = [e1,e2,e3,e4];
    let count:any = {};

    for (const element of checkArr) {
      if (count[element]) {
        count[element] += 1;
      } else {
        count[element] = 1;
      }
    }

    // all state 0, emotional state 5 or 6
    if (count[0] == 4){
      // Disgust or contempt
      this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * (6 - 5 + 1)) + 5)
      return
    }

    // all state 2, emotional state 5 or 6
    if (count[2] == 4){
      // Disgust or contempt
      this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * (6 - 5 + 1)) + 5)
      return
    }

    // most states are 0, emotional state 4
    if ( count[0] == 3){
      // Anger
      this.getEmotionalState().setCurrentEmotionalState(4)
      return
    }

    // most states are 2, emotional state 4
    if ( count[2] == 3){
      //Anger
      this.getEmotionalState().setCurrentEmotionalState(4)
      return
    }

    // "optimal" state reached meaning all elements are in state 1
    if(count[1] >= 3){
      if(Math.random() > 0.4){
        // happines
        this.getEmotionalState().setCurrentEmotionalState(0)
      } else {
        // surprised
        this.getEmotionalState().setCurrentEmotionalState(2)
      }
      return
    }

    // If non of the above conditions are met then choose a random neutral state
    if(Math.random() <= 0.5){
      // Sadness (neutrak)
      this.getEmotionalState().setCurrentEmotionalState(1)
    } else {
      // Sadness (neutrak)
      this.getEmotionalState().setCurrentEmotionalState(3)
    }

  }

  get_next_action = (epsilon:number):number => {
    //Exploration vs explotation, the rate of exploration is decided by epsilon (0.9 epsilon = 10% exploration)
    if(Math.random() < epsilon){
      let e1 = this.getUIElement(0).getState();
      let e2 = this.getUIElement(1).getState();
      let e3 = this.getUIElement(2).getState();
      let e4 = this.getUIElement(3).getState();
      let emotion = this.getEmotionalState().getCurrentEmotion();

      //Getting action array for specific state, choosing the actions index of action with highest value
      let a = this.getQ_Values()[e1][e2][e3][e4][emotion]
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
    
    if(this.actions[action_index] == 'element1_action0' && e1.getState() != 0){
      e1.setState(0)
    } else if(this.actions[action_index] == 'element1_action1' && e1.getState() != 1){
      e1.setState(1)
    } else if(this.actions[action_index] == 'element1_action2' && e1.getState() != 2){
      e1.setState(2)
    } else if(this.actions[action_index] == 'element2_action0' && e2.getState() != 0){
      e2.setState(0)
    } else if(this.actions[action_index] == 'element2_action1' && e2.getState() != 1){
      e2.setState(1)
    } else if(this.actions[action_index] == 'element2_action2' && e2.getState() != 2){
      e2.setState(2)
    } else if(this.actions[action_index] == 'element3_action0' && e3.getState() != 0){
      e3.setState(0)
    } else if(this.actions[action_index] == 'element3_action1' && e3.getState() != 1){
      e3.setState(1)
    } else if(this.actions[action_index] == 'element3_action2' && e3.getState() != 2){
      e3.setState(2)
    } else if(this.actions[action_index] == 'element4_action0' && e4.getState() != 0){
      e4.setState(0)
    } else if(this.actions[action_index] == 'element4_action1' && e4.getState() != 1){
      e4.setState(1)
    } else if(this.actions[action_index] == 'element4_action2' && e4.getState() != 2){
      e4.setState(2)
    } else {
      // not 100% sure if this is needed but uncase agent want to take action resulting in its current state
      this.get_next_state(this.get_next_action(this.getEpsilon()))
    }

    // Update emotional state used as feedback to the action
    this.update_user_emotion();
  }

  setupActions = () => {
    // Generate Actions based on elements and property count
    let actionsArr = []
    for (let i = 0; i < this.getUIElements().length; i++) {
        for (let j = 0; j < this.getUIElement(i).getState_Count(); j++) {
            actionsArr.push('element'+(i+1)+'_action'+(j))
        }
    }
    this.setActions(actionsArr);
  }

  setupQtable = () => {
    // Initialize Q-table with 0 values for all pairs
    let QtableArr = createNDimArray([
      this.getUIElement(0).getState_Count(),
      this.getUIElement(1).getState_Count(),
      this.getUIElement(2).getState_Count(),
      this.getUIElement(3).getState_Count(),
      this.getEmotionalState().getAvailableState_Count(),
      this.getActions().length
    ])

    //@ts-ignore
    this.setQ_Values(QtableArr)
  }

  setupRewards = () => {
    //Initialize rewards table
    let rewardArr = createNDimArray([
      this.getUIElement(0).getState_Count(),
      this.getUIElement(1).getState_Count(),
      this.getUIElement(2).getState_Count(),
      this.getUIElement(3).getState_Count(),
      this.getEmotionalState().getAvailableState_Count(),
  ])
  //@ts-ignore
  this.setRewards(rewardArr)

    let rewardArray = this.getRewards()
    // [Element1][Element2][Element3][Element4][Emotional_State]
    for (let m = 0; m < this.getUIElement(0).getState_Count(); m++) {
      for (let n = 0; n < this.getUIElement(1).getState_Count(); n++) {
        for (let o = 0; o < this.getUIElement(2).getState_Count(); o++) {
          for (let p = 0; p < this.getUIElement(3).getState_Count(); p++) {
            // Negative rewards
            rewardArray[m][n][o][p][4] = -1;
            rewardArray[m][n][o][p][5] = -3;
            rewardArray[m][n][o][p][6] = -6;

            // TESTING THIS
            // Positive rewards
            rewardArray[m][n][o][p][0] = 1;
            rewardArray[m][n][o][p][2] = 1;
          }
        }
      }
    }

    
    // Positive rewards
    //rewardArray[1][1][1][1][0] = 1;
    //rewardArray[1][1][1][1][1] = 1;
    //rewardArray[1][1][1][1][2] = 1;
    
  }

  setupAgent = () => {
    this.setupActions();
    this.setupQtable();
    this.setupRewards();
  }

  get_best_adaption = (e1_start:number, e2_start:number, e3_start:number, e4_start:number,emotion_start:number):number[] => {
    this.getUIElement(0).setState(e1_start);
    this.getUIElement(1).setState(e2_start);
    this.getUIElement(2).setState(e3_start);
    this.getUIElement(3).setState(e4_start);
    this.getEmotionalState().setCurrentEmotionalState(emotion_start);
    let best_adaption:any[] = [];
    if(this.is_terminal_state()){
      return best_adaption
    } else { // If legal starting state
      let e1 = this.getUIElement(0).getState();
      let e2 = this.getUIElement(1).getState();
      let e3 = this.getUIElement(2).getState();
      let e4 = this.getUIElement(3).getState();
      let emotion = this.getEmotionalState().getCurrentEmotion();
      
      best_adaption.push([e1,e2,e3,e4,emotion])
      // Continue until goal
      let action_index;
      while(!this.is_terminal_state()){
        // get the next action to take (epsilon 1 used because we are done training)
        action_index = this.get_next_action(1)
        // use action to get next state
        this.get_next_state(action_index)
        best_adaption.push([
          this.getUIElement(0).getState(),
          this.getUIElement(1).getState(),
          this.getUIElement(2).getState(),
          this.getUIElement(3).getState(),
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
        action_index = this.get_next_action(this.getEpsilon())
        // Store old state
        let old_e1 = this.getUIElement(0).getState()
        let old_e2 = this.getUIElement(1).getState()
        let old_e3 = this.getUIElement(2).getState()
        let old_e4 = this.getUIElement(3).getState()
        let old_emotion = this.getEmotionalState().getCurrentEmotion()
        // Move to next state
        this.get_next_state(action_index)
        // State now updated

        // Receive reward for moving to new state
        // Calculate temporal_difference
        let reward = this.getRewards()[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getEmotionalState().getCurrentEmotion()]
        let old_q_value = this.getQ_Values()[old_e1][old_e2][old_e3][old_e4][old_emotion][action_index]
        let temporal_difference = reward + (this.getGamma() * Math.max(...this.getQ_Values()[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getEmotionalState().getCurrentEmotion()])) - old_q_value
        
        // Update Q-value for the previous state and action pair
        let new_q_value = old_q_value + (this.getAplha() * temporal_difference)
        this.getQ_Values()[old_e1][old_e2][old_e3][old_e4][old_emotion][action_index] = new_q_value
      }
    }
    console.log('Training Complete!')
  }

}

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
