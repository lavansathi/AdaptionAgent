export class UIElement {
    private property_count:number;
    private current_property:number = 0;
    private name:string = '';

    constructor(p_count:number, current_property:number, name:string){
        this.property_count = p_count;
        this.current_property = current_property;
        this.name = name;
    }

    setProperty = (property:number) => {
        this.current_property = property;
    }
    getProperty = () => {
        return this.current_property;
    }
    getPropertyCount = () => {
        return this.property_count;
    }
}