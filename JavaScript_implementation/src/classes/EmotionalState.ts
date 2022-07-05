export class EmotionalState {
    
    /*  Emotional States
        0 - Happiness 
        1 - Sadness
        2 - Surprise
        3 - Fear
        4 - Anger
        5 - Disgust (Towards something considered offensive or unpleasant)
        6 - Contempt (The feeling that a person or thing is worthless)
    */

    private current_emotion;
    private maxAvailableStates = 7;

    constructor() {
        this.current_emotion = 0;
    }
    setCurrentEmotionalState = (emotion:number) => {
        this.current_emotion = emotion;
    }
    getCurrentEmotion = () => {
        return this.current_emotion;
    }
    getAvailableStateCount = () => {
        return this.maxAvailableStates;
    }
}