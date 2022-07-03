export class EmotionalState {
    private current_emotion = 0;
    private maxAvailableStates = 7;

    constructor(emotion:number) {
        this.current_emotion = emotion;
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