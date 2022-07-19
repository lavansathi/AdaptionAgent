import { EmotionalState } from "./EmotionalState";
import { UIElement } from "./UIElement";
import { io } from "socket.io-client"

export class Agent {
  private emotionalState:EmotionalState = new EmotionalState();
  private UIElements:UIElement[] = [];
  private gamma;
  private alpha;
  private epsilon;
  private q_values:any[] = [];
  private rewards:any[] = [];
  private actions:string[] = []
  private rewardSum:number = 0;
  private socket = io("ws://localhost:3000");

  constructor(alpha:number,gamma:number,epsilon:number){  
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;

    this.UIElements.push(new UIElement(2,0,'element1'))
    this.UIElements.push(new UIElement(2,0,'element2'))
    this.UIElements.push(new UIElement(2,0,'element3'))
    this.UIElements.push(new UIElement(2,0,'element4'))
    this.UIElements.push(new UIElement(2,0,'element5'))

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
  setRewardsTable = (rewardsArr:any[]) => {
    this.rewards = rewardsArr;
  }
  getRewardsTable = () => {
    return this.rewards;
  }
  setQ_Values = (qtable:any[]) => {
    this.q_values = qtable;
  }
  getQ_Values = () => {
    return this.q_values;
  }
  setActions = (actions:string[]) => {
    this.actions = actions;
  }
  getActions = () => {
    return this.actions;
  }
  setRewardSum = (reward:number) => {
    this.rewardSum += reward;
  }
  getRewardSum = () => {
    return this.rewardSum;
  }
  getStateSpace = () => {
    return [
      this.getUIElement(0).getState(),
      this.getUIElement(1).getState(),
      this.getUIElement(2).getState(),
      this.getUIElement(3).getState(),
      this.getUIElement(4).getState(),
      this.getEmotionalState().getCurrentEmotion()]
  }

  is_terminal_state = () => {
    let e1 = this.getUIElement(0).getState();
    let e2 = this.getUIElement(1).getState();
    let e3 = this.getUIElement(2).getState();
    let e4 = this.getUIElement(3).getState();
    let e5 = this.getUIElement(4).getState();
    let emotional_state = this.getEmotionalState().getCurrentEmotion();

    if(this.getRewardSum() == 1000){
    //if (this.getRewardsTable()[e1][e2][e3][e4][e5][emotional_state] === 1){
    // if (this.getEmotionalState().getCurrentEmotion() === 0 || this.getEmotionalState().getCurrentEmotion() === 2){
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
    let e5 = this.getUIElement(4);
    let emotion = this.getEmotionalState();

    // choose a random non-terminal state for the elements
    e1.setState(Math.floor(Math.random() * e1.getState_Count()));
    e2.setState(Math.floor(Math.random() * e2.getState_Count()));
    e3.setState(Math.floor(Math.random() * e3.getState_Count()));
    e4.setState(Math.floor(Math.random() * e4.getState_Count()));
    e5.setState(Math.floor(Math.random() * e5.getState_Count()));
    emotion.setCurrentEmotionalState(Math.floor(Math.random() * emotion.getAvailableState_Count()))

    // if terminal find new state
    while(this.is_terminal_state()){
      e1.setState(Math.floor(Math.random() * e1.getState_Count()));
      e2.setState(Math.floor(Math.random() * e2.getState_Count()));
      e3.setState(Math.floor(Math.random() * e3.getState_Count()));
      e4.setState(Math.floor(Math.random() * e4.getState_Count()));
      e5.setState(Math.floor(Math.random() * e5.getState_Count()));
      emotion.setCurrentEmotionalState(Math.floor(Math.random() * emotion.getAvailableState_Count()))
    }
  }

  update_user_emotion = () => {
    let e1 = this.getUIElement(0).getState();
    let e2 = this.getUIElement(1).getState();
    let e3 = this.getUIElement(2).getState();
    let e4 = this.getUIElement(3).getState();
    let e5 = this.getUIElement(4).getState();


    let checkArr = [e1,e2,e3,e4,e5];
    let count:any = {};

    for (const element of checkArr) {
      if (count[element]) {
        count[element] += 1;
      } else {
        count[element] = 1;
      }
    }
    
    // all state 0, emotional state 5 or 6
    if (count[0] == 5){
      // Disgust or contempt
      this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * (6 - 5 + 1)) + 5)
      return
    } else if (count[2] == 5){
      // Disgust or contempt
      this.getEmotionalState().setCurrentEmotionalState(Math.floor(Math.random() * (6 - 5 + 1)) + 5)
      return
    } else if ( count[0] >= 3 || count[2] >= 3){
      // Anger
      this.getEmotionalState().setCurrentEmotionalState(4)
      return
    } else if(count[1] == 4){
      // surprised
      this.getEmotionalState().setCurrentEmotionalState(2)
      return
    } else if(count[1] == 5){
      // happines
      this.getEmotionalState().setCurrentEmotionalState(0)
      return
    } else {
      // If non of the above conditions are met then choose a random neutral state
      if(Math.random() <= 0.5){
        // Sadness (neutral)
        this.getEmotionalState().setCurrentEmotionalState(1)
      } else {
        // Fear (neutral)
        this.getEmotionalState().setCurrentEmotionalState(3)
      }
    }
  }

  get_next_action = (epsilon:number):number => {
    //Exploration vs explotation, the rate of exploration is decided by epsilon (0.9 epsilon = 10% exploration)
    let random = Math.random()
    if(random < epsilon){
      let e1 = this.getUIElement(0).getState();
      let e2 = this.getUIElement(1).getState();
      let e3 = this.getUIElement(2).getState();
      let e4 = this.getUIElement(3).getState();
      let e5 = this.getUIElement(4).getState();
      let emotion = this.getEmotionalState().getCurrentEmotion();

      //Getting action array for specific state, choosing the actions index of action with highest value
      let a = this.getQ_Values()[e1][e2][e3][e4][e5][emotion]
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
    let e5 = this.getUIElement(4);
    

    if(this.actions[action_index] == 'element1_action0' && e1.getState() != 0){
      e1.setState(0)
    } else if(this.actions[action_index] == 'element1_action1' && e1.getState() != 1){
      e1.setState(1)
    } else if(this.actions[action_index] == 'element2_action0' && e2.getState() != 0){
      e2.setState(0)
    } else if(this.actions[action_index] == 'element2_action1' && e2.getState() != 1){
      e2.setState(1)
    } else if(this.actions[action_index] == 'element3_action0' && e3.getState() != 0){
      e3.setState(0)
    } else if(this.actions[action_index] == 'element3_action1' && e3.getState() != 1){
      e3.setState(1)
    } else if(this.actions[action_index] == 'element4_action0' && e4.getState() != 0){
      e4.setState(0)
    } else if(this.actions[action_index] == 'element4_action1' && e4.getState() != 1){
      e4.setState(1)
    } else if(this.actions[action_index] == 'element5_action0' && e5.getState() != 0){
      e5.setState(0)
    } else if(this.actions[action_index] == 'element5_action1' && e5.getState() != 1){
      e5.setState(1)
    } else if(this.actions[action_index] == 'do_Nothing'){
      return
    } else {
      // not 100% sure if this is needed but uncase agent want to take action resulting in its current state
      this.get_next_state(this.get_next_action(this.getEpsilon()))
    }

    // Update emotional state used as feedback to the action
    this.update_user_emotion();
  }

  // Helper funciton to create ndimensional arrays in JS, no native method exists
  createNDimArray(dimensions:any) {
    if (dimensions.length > 0) {
      var dim = dimensions[0];
      var rest = dimensions.slice(1);
      var newArray = new Array();
      for (var i = 0; i < dim; i++) {
        newArray[i] = this.createNDimArray(rest);
      }
      return newArray;
    } else {
      return 0;
    }
   }

  setupActions = () => {
    // Generate Actions based on elements and property count
    let actionsArr:string[] = []
    for (let i = 0; i < this.getUIElements().length; i++) {
        for (let j = 0; j < this.getUIElement(i).getState_Count(); j++) {
            actionsArr.push('element'+(i+1)+'_action'+(j))
        }
    }
    actionsArr.push('do_Nothing');
    this.setActions(actionsArr);
  }

  setupQtable = () => {
    // Initialize Q-table with 0 values for all pairs
    let QtableArr = this.createNDimArray([
      this.getUIElement(0).getState_Count(),
      this.getUIElement(1).getState_Count(),
      this.getUIElement(2).getState_Count(),
      this.getUIElement(3).getState_Count(),
      this.getUIElement(4).getState_Count(),
      this.getEmotionalState().getAvailableState_Count(),
      this.getActions().length
    ])

    //@ts-ignore
    this.setQ_Values(QtableArr)
  }

  setupRewards = () => {
    //Initialize rewards table
    let rewardArr = this.createNDimArray([
      this.getUIElement(0).getState_Count(),
      this.getUIElement(1).getState_Count(),
      this.getUIElement(2).getState_Count(),
      this.getUIElement(3).getState_Count(),
      this.getUIElement(4).getState_Count(),
      this.getEmotionalState().getAvailableState_Count(),
  ])
  //@ts-ignore
  this.setRewardsTable(rewardArr)

    let rewardArray = this.getRewardsTable()
    // [Element1][Element2][Element3][Element4][Element5][Emotional_State]
    for (let m = 0; m < this.getUIElement(0).getState_Count(); m++) {
      for (let n = 0; n < this.getUIElement(1).getState_Count(); n++) {
        for (let o = 0; o < this.getUIElement(2).getState_Count(); o++) {
          for (let p = 0; p < this.getUIElement(3).getState_Count(); p++) {
            for (let q = 0; q < this.getUIElement(3).getState_Count(); q++) {
              
              // Happy
              rewardArray[m][n][o][p][q][0] = 5;
              // Surprised
              rewardArray[m][n][o][p][q][2] = 2;
              // Negative rewards
              rewardArray[m][n][o][p][q][4] = -1;
              rewardArray[m][n][o][p][q][5] = -3;
              rewardArray[m][n][o][p][q][6] = -6;

              /*  Emotional States
                0 - Happiness (+5)
                1 - Sadness (0)
                2 - Surprise (+2)
                3 - Fear (0)
                4 - Anger (-1)
                5 - Disgust (-3)
                6 - Contempt (-6)
            */

            }
          }
        }
      }
    }
  }

  populateQtable = () => {
    //[FontSize][ColorTheme][Destination][FontType][DialogVisibility][Emotion][Action]
    // Setting initial values for the Q-table
    this.getQ_Values()[0][0][0][0][0][4][1] = 1
    this.getQ_Values()[1][0][0][0][0][4][3] = 1
    this.getQ_Values()[1][1][0][0][0][4][6] = 1
  }

  setupAgent = () => {
    this.setupActions();
    this.setupQtable();
   // this.populateQtable();
    this.setupRewards();
  }

  get_best_adaption = (e1_start:number, e2_start:number, e3_start:number, e4_start:number, e5_start:number,emotion_start:number):number[] => {
    this.getUIElement(0).setState(e1_start);
    this.getUIElement(1).setState(e2_start);
    this.getUIElement(2).setState(e3_start);
    this.getUIElement(3).setState(e4_start);
    this.getUIElement(4).setState(e5_start);

    this.getEmotionalState().setCurrentEmotionalState(emotion_start);
    let best_adaption:any[] = [];
    if(this.is_terminal_state()){
      return best_adaption
    } else { // If legal starting state
      let e1 = this.getUIElement(0).getState();
      let e2 = this.getUIElement(1).getState();
      let e3 = this.getUIElement(2).getState();
      let e4 = this.getUIElement(3).getState();
      let e5 = this.getUIElement(4).getState();

      let emotion = this.getEmotionalState().getCurrentEmotion();
      //console.log(e1,e2,e3,e4,emotion)
      best_adaption.push([e1,e2,e3,e4,e5,emotion])
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
          this.getUIElement(4).getState(),
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
        let old_e5 = this.getUIElement(4).getState()
        let old_emotion = this.getEmotionalState().getCurrentEmotion()
        // Move to next state
        this.get_next_state(action_index)
        // State now updated

        // Receive reward for moving to new state
        // Calculate temporal_difference
        let reward = this.getRewardsTable()[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()]
        this.setRewardSum(reward)
        let old_q_value = this.getQ_Values()[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index]
        let temporal_difference = reward + (this.getGamma() * Math.max(...this.getQ_Values()[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()])) - old_q_value
        
        // Update Q-value for the previous state and action pair
        let new_q_value = old_q_value + (this.getAplha() * temporal_difference)
        this.getQ_Values()[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index] = new_q_value
        console.log(this.getRewardSum())
        console.log(this.getUIElement(0).getState(),
                      this.getUIElement(1).getState(),
                      this.getUIElement(2).getState(),
                      this.getUIElement(3).getState(),
                      this.getUIElement(4).getState(),
                      this.getEmotionalState().getCurrentEmotion())
      }
    }
    console.log('Training Complete!')
  }

  run = (e1_start:number, e2_start:number, e3_start:number, e4_start:number,e5_start:number) => {
    let adaptionCounter = 0;
    let action_index;
    this.getUIElement(0).setState(e1_start);
    this.getUIElement(1).setState(e2_start);
    this.getUIElement(2).setState(e3_start);
    this.getUIElement(3).setState(e4_start);
    this.getUIElement(4).setState(e5_start);
    this.update_user_emotion();

    console.log('Initial State:')
    console.log(this.getStateSpace())
    console.log()

    let intervalID = setInterval(() => {
        
        action_index = this.get_next_action(this.getEpsilon())
        console.log('Agent Taking action: '+this.actions[action_index])

        let old_e1 = this.getUIElement(0).getState()
        let old_e2 = this.getUIElement(1).getState()
        let old_e3 = this.getUIElement(2).getState()
        let old_e4 = this.getUIElement(3).getState()
        let old_e5 = this.getUIElement(4).getState()
        let old_emotion = this.getEmotionalState().getCurrentEmotion()

        // Move to next state
        this.get_next_state(action_index)

        // Calculate temporal_difference
        let reward = this.getRewardsTable()[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()]
        this.setRewardSum(reward)
        let old_q_value = this.getQ_Values()[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index]
        let temporal_difference = reward + (this.getGamma() * Math.max(...this.getQ_Values()[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()])) - old_q_value
        
        // Update Q-value for the previous state and action pair
        let new_q_value = old_q_value + (this.getAplha() * temporal_difference)
        this.getQ_Values()[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index] = new_q_value
        
        console.log("Adaption Count: "+adaptionCounter)
        console.log("New State:")
        console.log(this.getStateSpace())
        console.log("Total Reward: "+this.getRewardSum())
        console.log()

        // Stop Condition
        adaptionCounter++;

        if(adaptionCounter === 1000) clearInterval(intervalID)

    },1000*0.05)
    console.log("End")
  }
}
