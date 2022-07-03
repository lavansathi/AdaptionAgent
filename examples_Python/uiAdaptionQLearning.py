#import libraries
import numpy as np

#define the shape of the environment (i.e., its states)
element_1 = 3
element_2 = 3
element_3 = 3
emotional_states = 7
action_count = 9



#Create a 3D numpy array to hold the current Q-values for each state and action pair: Q(s, a) 
#The array contains 11 rows and 11 columns (to match the shape of the environment), as well as a third "action" dimension.
#The "action" dimension consists of 4 layers that will allow us to keep track of the Q-values for each possible action in
#each state (see next cell for a description of possible actions). 
#The value of each (state, action) pair is initialized to 0.
q_values = np.zeros((element_1, element_2, element_3, emotional_states, action_count))

#print(q_values)

#numeric action codes:
actions = [
  'header_1', 'header_2', 'header_3',
  'background_1', 'background_2', 'background_3',
  'fontsize_1', 'fontsize_2', 'fontsize_3'
]

#Create a 2D numpy array to hold the rewards for each state. 
#The array contains 11 rows and 11 columns (to match the shape of the environment), and each value is initialized to -100.
rewards = np.full((element_1, element_2, element_3, emotional_states), 0.)

#[Element1, Element2, Element3, Emotional State]

for i in range(3):
  for j in range(3):
    for k in range(3):
      rewards[i,j,k,4] = -1.
      rewards[i,j,k,5] = -2.
      rewards[i,j,k,6] = -3.
      #print(i,j,k)




#rewards[0, 0, 0, 6] = -3. #set the reward for the state combination and emotional state
#rewards[0, 0, 0, 5] = -2. #set the reward for the state combination and emotional state
#rewards[0, 0, 0, 4] = -1. #set the reward for the state combination and emotional state
#rewards[0, 0, 0, 3] = -1. #set the reward for the state combination and emotional state
#rewards[1, 1, 1, 6] = -3. #set the reward for the state combination and emotional state
#rewards[2, 2, 2, 6] = -3. #set the reward for the state combination and emotional state
#rewards[1, 1, 1, 5] = -2. #set the reward for the state combination and emotional state
#rewards[2, 2, 2, 5] = -2. #set the reward for the state combination and emotional state
#rewards[1, 1, 1, 4] = -1. #set the reward for the state combination and emotional state
#rewards[2, 2, 2, 4] = -1. #set the reward for the state combination and emotional state


rewards[1, 1, 1, 0] = 1. #set the reward for the state combination and emotional state
rewards[1, 1, 1, 1] = 1. #set the reward for the state combination and emotional state
rewards[1, 1, 1, 2] = 1. #set the reward for the state combination and emotional state




#for row in rewards:
#  print(row)

 #define a function that determines if the specified location is a terminal state
def is_terminal_state(elemet1_property, element2_property, element3_property, emotional_state):
  #if the reward for this location is -1, then it is not a terminal state (i.e., it is a 'white square')
  if rewards[elemet1_property, element2_property, element3_property, emotional_state] == 1.:
    return True
  else:
    return False

#define a function that will choose a random, non-terminal starting location
def get_starting_location():
  current_element1_property = np.random.randint(element_1)
  current_element2_property = np.random.randint(element_2)
  current_element3_property = np.random.randint(element_3)
  current_emontionalState = np.random.randint(emotional_states)
  #continue choosing random row and column indexes until a non-terminal state is identified

  while is_terminal_state(current_element1_property, current_element2_property,current_element3_property,current_emontionalState):
    current_element1_property = np.random.randint(element_1)
    current_element2_property = np.random.randint(element_2)
    current_element3_property = np.random.randint(element_3)
    current_emontionalState = np.random.randint(emotional_states)
  return current_element1_property, current_element2_property, current_element3_property, current_emontionalState

#define an epsilon greedy algorithm that will choose which action to take next (i.e., where to move next)
def get_next_action(current_element1_property, current_element2_property, current_element3_property,current_emontionalState, epsilon):
  #if a randomly chosen value between 0 and 1 is less than epsilon, 
  #then choose the most promising value from the Q-table for this state.
  if np.random.random() < epsilon:
    return np.argmax(q_values[current_element1_property, current_element2_property, current_element3_property, current_emontionalState])
  else: #choose a random action
    return np.random.randint(action_count)

#define a function to imitate human emotion
def get_updated_user_emotion(current_element1_property, current_element2_property, current_element3_property,current_emontionalState):
  element1_property = current_element1_property
  element2_property = current_element2_property
  element3_property = current_element3_property
  emotional_state = current_emontionalState
  #Situations that might annoy the user
  if element1_property == 0 and element2_property == 0 and element3_property == 0:
    emotional_state = np.random.randint(4,6)
  elif element1_property == 2 and element2_property == 0 and element3_property == 0:
    emotional_state = np.random.randint(4,6)
  elif element1_property == 2 and element2_property == 0 and element3_property == 0:
    emotional_state = np.random.randint(4,6)
  #Situations that might slightly annoy the user
  elif element1_property == 1 and element2_property == 0 and element3_property == 0:
    emotional_state = np.random.randint(2,3)
  elif element1_property == 1 and element2_property == 0 and element3_property == 0:
    emotional_state = np.random.randint(2,3)
  elif element1_property == 1 and element2_property == 0 and element3_property == 0:
    emotional_state = np.random.randint(2,3)

  #Situations the user might like
  elif element1_property == 1 and element2_property == 1 and element3_property == 1:
    emotional_state = np.random.randint(0,2)
  elif element1_property == 0 and element2_property == 1 and element3_property == 1:
    emotional_state = np.random.randint(0,2)
  elif element1_property == 1 and element2_property == 1 and element3_property == 0:
    emotional_state = np.random.randint(0,2)
  elif element1_property == 1 and element2_property == 1 and element3_property == 1:
    emotional_state = np.random.randint(0,2)
  elif element1_property == 2 and element2_property == 1 and element3_property == 1:
    emotional_state = np.random.randint(0,2)
  elif element1_property == 1 and element2_property == 1 and element3_property == 2:
    emotional_state = np.random.randint(0,2)

  return emotional_state

#define a function that will get the next location based on the chosen action
def get_next_location(current_element1_property, current_element2_property, current_element3_property,current_emontionalState, action_index):
  new_element1_property = current_element1_property 
  new_element2_property = current_element2_property
  new_element3_property = current_element3_property

  new_emotional_state = get_updated_user_emotion(current_element1_property, current_element2_property, current_element3_property,current_emontionalState)
  #new_emotional_state = current_emontionalState
 
  # messing around with the emotional state
  #if current_element1_property == 1 and current_element2_property == 2 and current_element3_property == 2:
  #  new_emotional_state = 0

  if actions[action_index] == 'header_1' and current_element1_property != 0:
    new_element1_property = 0
  elif actions[action_index] == 'header_2' and current_element1_property != 1:
    new_element1_property = 1
  elif actions[action_index] == 'header_3' and current_element1_property != 2:
    new_element1_property = 2
  
  elif actions[action_index] == 'background_1' and current_element2_property != 0:
    new_element2_property = 0
  elif actions[action_index] == 'background_2' and current_element2_property != 1:
    new_element2_property = 1
  elif actions[action_index] == 'background_3' and current_element2_property != 2:
    new_element2_property = 2
    
  elif actions[action_index] == 'fontsize_1' and current_element3_property != 0:
    new_element3_property = 0
  elif actions[action_index] == 'fontsize_2' and current_element3_property != 1:
    new_element3_property = 1
  elif actions[action_index] == 'fontsize_3' and current_element3_property != 2:
    new_element3_property = 2
  return new_element1_property, new_element2_property, new_element3_property, new_emotional_state


#Define a function that will get the shortest path between any location within the warehouse that 
#the robot is allowed to travel and the item packaging location.
def get_shortest_path(start_element1_property, start_element2_property, start_element3_property, start_emotional_state):
  #return immediately if this is an invalid starting location
  if is_terminal_state(start_element1_property, start_element2_property, start_element3_property, start_emotional_state):
    return []
  else: #if this is a 'legal' starting location
    current_element1_property, current_element2_property,current_element3_property, current_emotional_state = start_element1_property, start_element2_property, start_element3_property, start_emotional_state
    shortest_path = []
    shortest_path.append([current_element1_property, current_element2_property, current_element3_property, current_emotional_state])
    #continue moving along the path until we reach the goal (i.e., the item packaging location)
    while not is_terminal_state(current_element1_property, current_element2_property, current_element3_property, current_emotional_state):
      #get the best action to take
      action_index = get_next_action(current_element1_property, current_element2_property, current_element3_property, current_emotional_state, 1.)
      #move to the next location on the path, and add the new location to the list
      current_element1_property, current_element2_property, current_element3_property, current_emotional_state = get_next_location(current_element1_property, current_element2_property, current_element3_property, current_emotional_state, action_index)
      shortest_path.append([current_element1_property, current_element2_property, current_element3_property, current_emotional_state])
    return shortest_path

#define training parameters
epsilon = 0.9 #the percentage of time when we should take the best action (instead of a random action)
discount_factor = 0.9 #discount factor for future rewards
learning_rate = 0.9 #the rate at which the AI agent should learn

#run through 1000 training episodes
for episode in range(100000):
  #get the starting location for this episode
  elemen1_property, element2_property, element3_property, emotional_state = get_starting_location()
  
  #row_index, column_index = get_starting_location()

  #continue taking actions (i.e., moving) until we reach a terminal state
  #(i.e., until we reach the item packaging area or crash into an item storage location)
  while not is_terminal_state(elemen1_property, element2_property, element3_property, emotional_state):
    #choose which action to take (i.e., where to move next)
    action_index = get_next_action(elemen1_property, element2_property, element3_property, emotional_state, epsilon)

    #perform the chosen action, and transition to the next state (i.e., move to the next location)
    old_element1_property, old_element2_property, old_element3_property, old_emotional_state = elemen1_property, element2_property, element3_property, emotional_state
    elemen1_property, element2_property, element3_property, emotional_state = get_next_location(elemen1_property, element2_property, element3_property, emotional_state, action_index)
    
    #receive the reward for moving to the new state, and calculate the temporal difference
    reward = rewards[elemen1_property, element2_property, element3_property, emotional_state]
    old_q_value = q_values[old_element1_property, old_element2_property, old_element3_property, old_emotional_state, action_index]
    temporal_difference = reward + (discount_factor * np.max(q_values[elemen1_property, element2_property, element3_property, emotional_state])) - old_q_value

    #update the Q-value for the previous state and action pair
    new_q_value = old_q_value + (learning_rate * temporal_difference)
    q_values[old_element1_property, old_element2_property, old_element3_property, old_emotional_state, action_index] = new_q_value

print('Training complete!')

#print(q_values)

print(get_shortest_path(2,2,2,6))
print(get_shortest_path(2,2,2,5))
print(get_shortest_path(2,2,2,4))
print(get_shortest_path(2,2,2,3))
print(get_shortest_path(0,0,0,6))
print(get_shortest_path(0,0,0,5))
print(get_shortest_path(2,0,2,4))
print(get_shortest_path(0,0,0,4))
print(get_shortest_path(0,2,0,3))
print(get_shortest_path(0,0,0,3))



