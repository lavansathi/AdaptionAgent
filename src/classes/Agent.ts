import { EmotionalState } from "./EmotionalState";
import { UIElement } from "./UIElement";
import { configObject } from "./config";

export class Agent {
  private emotionalState:EmotionalState = new EmotionalState();
  private UIElements:UIElement[] = [];
  private gamma:number;
  private alpha:number;
  private epsilon:number;
  private qTable:any[] = [];
  private rewardTable:any[] = [];
  private actions:string[] = []
  private rewardSum:number = 0;

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
    this.rewardTable = rewardsArr;
  }
  setQ_Values = (qtable:any[]) => {
    this.qTable = qtable;
  }
  getQ_values = ():any[] => {
    return this.qTable;
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

  private delay = (ms:number) => new Promise(res => setTimeout(res, ms));

  private FindValueOfCurrentState = (currentLayer: any[], depth: number):[] => {
    if (depth <= this.UIElements.length - 1) {
      return this.FindValueOfCurrentState(currentLayer[this.getUIElement(depth).getState()], depth + 1);       
    } else {
      const value = currentLayer[this.getEmotionalState().getCurrentEmotion()];
      return value;   
    }
  }

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
    
    if(this.getUIElement(0).getState() === 1 && this.getUIElement(1).getState() === 1 && this.getUIElement(2).getState() === 1){
      this.getEmotionalState().setCurrentEmotionalState(0)
    }else {
      this.getEmotionalState().setCurrentEmotionalState(6)
    }
  }

  get_next_action = (epsilon:number):number => {
    //Exploration vs explotation, the rate of exploration is decided by epsilon (0.9 epsilon = 10% exploration)
    let random = Math.random()
    if(random < epsilon){
      
      //Getting action array for specific state, choosing the index of action with highest value
      let index_of_best_action = this.FindValueOfCurrentState(this.qTable, 0).reduce((iMax:any, x:any, i:any, arr:any) => x > arr[iMax] ? i : iMax, 0);
      
      return index_of_best_action

    } else {
      //console.log("This was a random action!")
      return Math.floor(Math.random() * this.actions.length)
    }
  }

  get_next_state = (action_index:number) => {
    
    for (let i = 0; i < this.getUIElements().length; i++) {
      let element = this.getUIElement(i);

      for (let j = 0; j < element.getState_Count(); j++) {

        if(this.actions[action_index] === `${element.getName()}_action${j}`){

          if(element.getState() !== j){
            console.log(`Action: ${element.getName()} to ${j}`)
            element.setState(j)
          } else {
            // cant do alrady there
            this.get_next_state(this.get_next_action(this.epsilon))
          }
        }
      }
    }

    if(this.actions[action_index] === 'do_Nothing'){
      console.log("Action: Doing nothing")
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
     
    //@ts-ignore
    this.setQ_Values(this.createNDimArray(arr))
  }

  setupRewards = () => {
    //Initialize rewards table

    const arr: number[] = []

    for (let i = 0; i < this.UIElements.length; i++) {
      arr.push(this.UIElements[i].getState_Count());
    }

    arr.push(this.getEmotionalState().getAvailableState_Count());

    //@ts-ignore
    this.setRewardsTable(this.createNDimArray(arr))

    // [Element1][Element2][Element3][Element4][Element5][Emotional_State]
    const emotionValues: Record<number, number> = {
      0: 5,  // Happiness
      1: 0,  // Sadness
      2: 2,  // Surprise
      3: 0,  // Fear
      4: -1, // Anger
      5: -3, // Disgust
      6: -6  // Contempt
    }
    
    const FillRewards = (currentLayer: any[]) => {
      if (!Array.isArray(currentLayer[0])) {
        const keys = Object.keys(emotionValues);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = emotionValues[+key];

          currentLayer[i] = value;
        }
      } else {
        for (let i = 0; i < currentLayer.length; i++) {
          FillRewards(currentLayer[i]);
        }
      }
    }
    FillRewards(this.rewardTable);
  }

  populateQtable = () => {
    //[FontSize][ColorTheme][Destination][FontType][DialogVisibility][Emotion][Action]
    // Setting initial values for the Q-table
    //this.q_values[0][0][0][0][0][4][1] = 99
  }

  setupAgent = () => {
    this.setupActions();
    this.setupQtable();
    //this.populateQtable();
    this.setupRewards();
  }

  private get_best_adaption = (e1_start:number, e2_start:number, e3_start:number, e4_start:number, e5_start:number,emotion_start:number):number[] => {
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
        best_adaption.push(this.getStateSpace())
      }
    }
    return best_adaption
  }

  private train = (training_range:number) => {
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
        let reward = this.rewardTable[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()]
        this.setRewardSum(reward)
        let old_q_value = this.qTable[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index]
        let temporal_difference = reward + (this.gamma * Math.max(...this.qTable[this.getUIElement(0).getState()][this.getUIElement(1).getState()][this.getUIElement(2).getState()][this.getUIElement(3).getState()][this.getUIElement(4).getState()][this.getEmotionalState().getCurrentEmotion()])) - old_q_value
        
        // Update Q-value for the previous state and action pair
        let new_q_value = old_q_value + (this.alpha * temporal_difference)
        this.qTable[old_e1][old_e2][old_e3][old_e4][old_e5][old_emotion][action_index] = new_q_value
        console.log(this.getRewardSum())
        console.log(this.getStateSpace())
      }
    }
    console.log('Training Complete!')
  }

  run = async (uiElements:UIElement[], callback: (state:number[]) => void): Promise<void> => {

    /*
    while(!this.socket.connected){
      console.log("Waiting for socket connection")
      await this.delay(3000)
    }
    
    console.log(`connected to socket with id: ${this.socket.id}`)
    
    */
   
   
   let adaptionCounter = 0;
   let action_index;

   for (let i = 0; i < uiElements.length; i++) {
     this.getUIElement(i).setState(uiElements[i].getState());
   }

   await this.update_user_emotion();

    console.log('Initial State:')
    console.log(this.getStateSpace())
    console.log()

    let intervalID = setInterval(() => {
        
        action_index = this.get_next_action(this.epsilon)
        //console.log('Agent Taking action: '+this.actions[action_index])
        const oldStates: number[] = [];

        for (let i = 0; i < this.UIElements.length; i++) {
          oldStates.push(this.getUIElement(i).getState());
        }
        oldStates.push(this.getEmotionalState().getCurrentEmotion());
        oldStates.push(action_index)

        const getQTableValue = (currentLayer: any[], depth: number): number => {
          if (depth < oldStates.length - 1) {
            return getQTableValue(currentLayer[oldStates[depth]], depth + 1);
          } 
          return currentLayer[oldStates[depth]];
        }

        const setQTableValue = (currentLayer: any[], depth: number, value: number): void => {
          if (depth < oldStates.length - 1) {
            return setQTableValue(currentLayer[oldStates[depth]], depth + 1, value);
          }
          // @ts-ignore 
          currentLayer[oldStates[depth]] = value;
        }

        // Move to next state
        this.get_next_state(action_index)

        // Calculate temporal_difference
        let reward = this.FindValueOfCurrentState(this.rewardTable, 0);
        // @ts-ignore
        this.setRewardSum(reward)
        
        let old_q_value = getQTableValue(this.qTable, 0);
        // @ts-ignore
        let temporal_difference = reward + (this.gamma * Math.max(...this.FindValueOfCurrentState(this.qTable, 0))) - old_q_value
        
        // Update Q-value for the previous state and action pair
        let new_q_value = old_q_value + (this.alpha * temporal_difference)
        setQTableValue(this.qTable, 0, new_q_value)
        
        console.log("Counter: "+adaptionCounter)
        console.log(this.getRewardSum())

        adaptionCounter++;

        if (adaptionCounter === 100000) {
          clearInterval(intervalID)
        }
        
        callback(this.getStateSpace());
    }, 1000 * 0.02)
  }
}
