export class Domain{
    name : string;
    sender : string;
    sendDate: Date;
    deadlineDate : Date;
    url : string;
    matchingKey : string;
    constructor(name : string, sender : string, sendDate : Date, url : string, matchingKey : string=''){
        this.name=name;
        this.sender=sender;
        this.sendDate=sendDate;
        this.deadlineDate=this.addDays(sendDate, 7);
        this.url=url;
        this.matchingKey=matchingKey;
    }
    toString(){
        return this.name+';,;'+this.sender+';,;'+this.sendDate.toString()+';,;'+this.url+';,;'+this.matchingKey;
    }
    addDays(date: Date, days: number): Date {
        let newDate = new Date(date.getTime());
        newDate.setDate(date.getDate() + days);
        return newDate;
    }
}