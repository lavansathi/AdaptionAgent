import { EmotionalState } from "./EmotionalState";
import { UIElement } from "./UIElement";
import { configObject } from "./config";

export class Agent {
  private emotionalState:EmotionalState = new EmotionalState();
  private UIElements:UIElement[] = [];
  private gamma:number;
  private alpha:number;
  private epsilon:number;
  private q_values:any[] = [];
  private rewards:any[] = [];
  private actions:string[] = []
  private rewardSum:number = 0;
  private lastAction:(number|null) = null;

  constructor(uielements:UIElement[]){
    this.alpha = configObject.alpha;
    this.gamma = configObject.gamma;
    this.epsilon = configObject.epsilon;
    this.UIElements = uielements;

    this.setupAgent()
  }
    
  getUIElement = (element:number) => {
    return this.UIElements[element];
  }
  getUIElements = ():UIElement[] => {
    return this.UIElements;
  }
  getEmotionalState = ():EmotionalState => {
    return this.emotionalState;
  }
  setRewardsTable = (rewardsArr:any[]) => {
    this.rewards = rewardsArr;
  }
  getRewardsTable = ():any[] => {
    return this.rewards;
  }
  setQ_Values = (qtable:any[]) => {
    this.q_values = qtable;
  }
  getQ_values = ():any[] => {
    return this.q_values;
  }
  setActions = (actions:string[]) => {
    this.actions = actions;
  }
  setRewardSum = (reward:number) => {
    this.rewardSum += reward;
  }
  getRewardSum = ():number => {
    return this.rewardSum;
  }
  getStateSpace = ():number[] => {
    let stateSpaceArr = []

    for (let i = 0; i < this.getUIElements().length; i++) {
      stateSpaceArr.push(this.getUIElements()[i].getState());
    }
    stateSpaceArr.push(this.getEmotionalState().getCurrentEmotion())
    return stateSpaceArr;
  }

  delay = (ms:number) => new Promise(res => setTimeout(res, ms));

  is_terminal_state = () => {
    if(this.getRewardSum() == 1000){
      return true
    } else {
      return false
    }
  }

  get_starting_state = () => {
    let emotion = this.getEmotionalState();
    const setElementStates = () => {
      for (let i = 0; i < this.UIElements.length; i++) {
        this.UIElements[i].setState(Math.floor(Math.random() * this.UIElements[i].getState_Count()));
      }
    }

    // choose a random non-terminal state for the elements
    setElementStates();
    emotion.setCurrentEmotionalState(Math.floor(Math.random() * emotion.getAvailableState_Count()))

    // if terminal find new state
    while(this.is_terminal_state()) {
      setElementStates();
      emotion.setCurrentEmotionalState(Math.floor(Math.random() * emotion.getAvailableState_Count()))
    }
  }

  update_user_emotion = async () => {
    let uiElements = [...this.getStateSpace()]
    uiElements.pop()
    let count:any = {};

    for (const element of uiElements) {
      if (count[element]) {
        count[element] += 1;
      } else {
        count[element] = 1;
      }
    }
    
    if(count[0]=== 3){
      this.getEmotionalState().setCurrentEmotionalState(0)
    }else {
      this.getEmotionalState().setCurrentEmotionalState(6)
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

      //Getting action array for specific state, choosing the index of action with highest value
      let a = this.q_values[e1][e2][e3][e4][e5][emotion]
      let index_of_best_action = a.reduce((iMax:any, x:any, i:any, arr:any) => x > arr[iMax] ? i : iMax, 0);
      
      return index_of_best_action

    } else {
      //console.log("This was a random action!")
      return Math.floor(Math.random() * this.actions.length)
    }
  }

  get_next_state = (action_index:number) => {
    
    /*
    let e1 = this.getUIElement(0);
    let e2 = this.getUIElement(1);
    let e3 = this.getUIElement(2);
    let e4 = this.getUIElement(3);
    let e5 = this.getUIElement(4);
    */
    for (let i = 0; i < this.getUIElements().length; i++) {
      let element = this.getUIElement(i);

      for (let j = 0; j < element.getState_Count(); j++) {
        if(this.actions[action_index] === `${element.getName()}_action${j}`){
          if(element.getState() !== j){
            console.log(`setting state of element ${element.getName()} to be ${j}`)
            element.setState(j)
          } else {
            // cant do alrady there
            this.get_next_state(this.get_next_action(this.epsilon))
          }
        }
      }
    }

    if(this.actions[action_index] == 'do_Nothing'){
      this.update_user_emotion();
      return
    }
    /*
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
      this.update_user_emotion();
      return
    } else {
      // not 100% sure if this is needed but uncase agent want to take action resulting in its current state
      this.get_next_state(this.get_next_action(this.epsilon))
      return
    }
    */
    // Update emotional state used as feedback to the action
    this.update_user_emotion();
    this.lastAction = action_index;
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
      let element = this.getUIElement(i);
      for (let j = 0; j < element.getState_Count(); j++) {
        actionsArr.push(`${element.getName()}_action${j}`)
      }
    }
    actionsArr.push('do_Nothing');
    this.setActions(actionsArr);
  }

  setupQtable = () => {
    // Initialize Q-table with 0 values for all pairs
    const arr: number[] = []

    for (let i = 0; i < this.UIElements.length; i++) {
      arr.push(this.UIElements[i].getState_Count());
    }

    arr.push(this.getEmotionalState().getAvailableState_Count());
    arr.push(this.actions.length)
      
    let QtableArr = this.createNDimArray(arr);

    //@ts-ignore
    this.setQ_Values(QtableArr)
  }

  setupRewards = () => {
    //Initialize rewards table

    const arr: number[] = []

    for (let i = 0; i < this.UIElements.length; i++) {
      arr.push(this.UIElements[i].getState_Count());
    }

    arr.push(this.getEmotionalState().getAvailableState_Count());

    let arrRewards = this.createNDimArray(arr);

    //@ts-ignore
    this.setRewardsTable(arrRewards)

    let rewardArray = this.getRewardsTable()
    // [Element1][Element2][Element3][Element4][Element5][Emotional_State]
    for (let m = 0; m < this.getUIElement(0).getState_Count(); m++) {
      for (let n = 0; n < this.getUIElement(1).getState_Count(); n++) {
        for (let o = 0; o < this.getUIElement(2).getState_Count(); o++) {
          for (let p = 0; p < this.getUIElement(3).getState_Count(); p++) {
            for (let q = 0; q < this.getUIElement(4).getState_Count(); q++) {
              
              // Happy
              rewardArray[m][n][o][p][q][0] = 5;
              // Surprised
              rewardArray[m][n][o][p][q][2] = 2;
              // Negative rewards
              rewardArray[m][n][o][p][q][4] = -1;
              rewardArray[m][n][o][p][q][5] = -3;
              rewardArray[m][n][o][p][q][6] = -6;
            }
          }
        }
      }
    }
  }

  populateQtable = () => {
    //[FontSize][ColorTheme][Destination][FontType][DialogVisibility][Emotion][Action]
    // Setting initial values for the Q-table
    this.q_values[0][0][0][0][0][4][1] = 99
    
  }

  setupAgent = () => {
    this.setupActions();
    this.setupQtable();
    //this.populateQtable();
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
        action_index = this.get_next_action(this.epsilon)
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
        let old_q_value = this.q_values[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index]
        let temporal_difference = reward + (this.gamma * Math.max(...this.q_values[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()])) - old_q_value
        
        // Update Q-value for the previous state and action pair
        let new_q_value = old_q_value + (this.alpha * temporal_difference)
        this.q_values[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index] = new_q_value
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

  run = async (e1_start:number, e2_start:number, e3_start:number, e4_start:number,e5_start:number, test:(state:number[]) => void):Promise<void> => {

    /*
    while(!this.socket.connected){
      console.log("Waiting for socket connection")
      await this.delay(3000)
    }
    
    console.log(`connected to socket with id: ${this.socket.id}`)
    
    */

    let adaptionCounter = 0;
    let action_index;
    this.getUIElement(0).setState(e1_start);
    this.getUIElement(1).setState(e2_start);
    this.getUIElement(2).setState(e3_start);
    this.getUIElement(3).setState(e4_start);
    this.getUIElement(4).setState(e5_start);
    await this.update_user_emotion();

    console.log('Initial State:')
    console.log(this.getStateSpace())
    console.log()

    let intervalID = setInterval(() => {
        
        action_index = this.get_next_action(this.epsilon)
        //console.log('Agent Taking action: '+this.actions[action_index])

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
        let old_q_value = this.q_values[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index]
        let temporal_difference = reward + (this.gamma * Math.max(...this.q_values[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()])) - old_q_value
        
        // Update Q-value for the previous state and action pair
        let new_q_value = old_q_value + (this.alpha * temporal_difference)
        this.q_values[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index] = new_q_value
        /*
        console.log("Adaption Count: "+adaptionCounter)
        console.log("New State:")
        console.log(this.getStateSpace())
        console.log("Total Reward: "+this.getRewardSum())
        console.log()

        */
        console.log("Adaption Count: "+adaptionCounter)
        console.log(this.getRewardSum())

        adaptionCounter++;

        if(adaptionCounter === 1000){
          clearInterval(intervalID)
          console.log("End")
        }
        test(this.getStateSpace())
    },1000*0.01)

  }
}
