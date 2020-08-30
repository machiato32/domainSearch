class Domain{
    constructor(name, sender, date, url, matchingKey=''){
        this.name=name;
        this.sender=sender;
        this.date=date;
        this.url=url;
        this.matchingKey=matchingKey;
    }
    toString(){
        return this.name+', '+this.sender;
    }
}