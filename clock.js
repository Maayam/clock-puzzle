var play = true;
var difficulty = true;
var clockSize = false;

while(play){
    difficulty = prompt("Type in your desired difficulty level (easy, medium, hard, or extreme) Note that some puzzle might not be solvable for now... I need to fix that");
    if(difficulty != "easy" && difficulty != "medium" && difficulty != "hard" && "difficulty" != "extreme")
        play = confirm("I did not get the difficulty you wanted (maybe a typo ?) want to stop playing ?");
    else
        play = false;
}
if(difficulty == "easy"){
    clockSize = 6;
    play = true;
}
if(difficulty == "medium"){
    clockSize = 8;
    play = true;
}
if(difficulty == "hard"){
    clockSize = 12;
    play = true;
}
if(difficulty == "extreme"){
    clockSize = 18;
    play = true;
}

function clickFunction(elmt){
    if(elmt.getAttribute('checked') == "false"){ //has part already been checked ?
        if(elmt.getAttribute('checkable') == "true"){ //is part checkable with current set ?
            var position = elmt.id.split('-')[1]; //gets last part of the id (which is the position)
            clock.checkPart(parseInt(position)); //check it
            elmt.style.backgroundColor = "grey";
            elmt.style.opacity = "0.6";
        }
        else{
            console.log('part not checkable');
        }
    }
    else{
        console.log('part already checked');
    }
}

function ClockPart(position, value){
    this.position = position; //position on the clock
    this.value = value; // constant
    this.isChecked = false; // either false or position in check order
    this.isCheckable = true; // wether can be checked or not (according to the clock setup)
    this.chords = [
        -Math.cos((Math.PI/2)+(Math.PI/clockSize)*position*2), //I need a minus here to turn it clockwise
        -Math.sin((Math.PI/2)+(Math.PI/clockSize)*position*2) //the minus is to cope with Y axis invertion from web page
    ]
    
    this.element = document.createElement('div');
    this.element.className = "clock-part";
    this.element.id = "part-"+position;
    this.element.value = value;
    this.element.innerHTML = value;
    this.element.setAttribute('checked', this.isChecked);
    this.element.setAttribute('checkable', this.isCheckable);
    this.element.addEventListener('click', function(e){
        clickFunction(this);
    });
    
    this.check = function(turn){
        this.isChecked = turn;
        this.element.innerHTML = "";
        this.update();
        // if(clock.isSolved()){
        //     alert('Congrats ! you solved a '+difficulty+' puzzle !');
        // }
        // else if(!clock.isSolvable){
        //     alert("You're stuck ! Try to click the reset button at the bottom of the page or maybe an other puzzle ?");
        // }
    }
    this.makeCheckable = function(){
        if(typeof this.checked == "Number"){
            this.isCheckable = false;
        }
        else{
            this.isCheckable = true;
            this.element.style.backgroundColor = "#7ed475"
            this.update();   
        }
    }
    this.makeUncheckable = function(){
        this.isCheckable = false;
        this.element.style.backgroundColor = "red"
        this.update();
    }
    
    this.update = function(){
        this.element.setAttribute('checked', this.isChecked);
        this.element.setAttribute('checkable', this.isCheckable);
        document.getElementsByClassName('clock-part')[this.position]
        .replaceChild(
            this.element,
            document.getElementsByClassName('clock-part')[this.position]
        );
    }
    
    this.reset = function(){
        this.isChecked = false; // either false or position in check order
        this.isCheckable = true; // wether can be checked or not (according to the clock setup)

        this.element.setAttribute('checked', this.isChecked);
        this.element.setAttribute('checkable', this.isCheckable);
        this.element.style.backgroundColor = "white";
        this.element.innerHTML = this.value;
        this.element.style.opacity = 1;
        this.update();
    }
    document.getElementById('clock').appendChild(this.element);
}

function Clock(size){
    this.turn = 0; //number of turns played by the user
    this.size = size; //number of parts or "hours" on the clock
    this.width = 190; //width of the clock on the page
    this.parts = []; //array of parts of the clock (HTMLElement)
    this.addPart = function(position, value=null){
        var max = Math.floor(size/2);
        (value == null) ? value = Math.floor(Math.random()*max+1) : value = value;
        //I use floor for uniform distribution  and +1 to get the right range of possible integer (between 1 and max included)
        var clockPart = new ClockPart(position, value);
        this.parts.push(clockPart);
        //place this part
        var xPos = this.parts[i].chords[0]*this.width;
        var yPos = this.parts[i].chords[1]*this.width;
        this.parts[clockPart.position].element.style.transform += " translate("+xPos+"px, "+yPos+"px)";
    }
    this.checkPart = function(position){
        //set turn in history
        this.parts[position].isChecked = this.turn;
        //update parts states
        this.parts[position].check(this.turn); //mark the part as checked
        //update the checkable parts
        for(var i=0; i<this.parts.length; i++){
            this.parts[i].isCheckable = false;
        }
        var value = parseInt(this.parts[position].value);
        var nextCheckable = false;
        var prevCheckable = false;
        //find the previous part to make checkable
        if(position-value < 0){
            var prevPosition = (position-value)+this.size;
        }
        else{
            var prevPosition = position-value;
        }
        //find the next part to make checkable
        if(position+value > this.size-1){
            var nextPosition = (position+value)-this.size;
        }
        else{
            var nextPosition = position+value;
        }
        //set all to uncheckable
        for(var i=0; i<this.size; i++){
            this.parts[i].makeUncheckable();
        }
        //set right to checkable
        console.log("prev position: "+prevPosition);
        console.log("next position: "+nextPosition);
        this.parts[prevPosition].makeCheckable();
        this.parts[nextPosition].makeCheckable();
        //increase turn count
        this.turn++;
    }
    this.getPart = function(position){
        return document.getElementById("part-"+position);
    }
    this.reset = function(){
        this.turn = 0;
        for(var i=0; i<this.size; i++){
            this.parts[i].reset();
        }
    }
    
    for(var i=0; i<this.size; i++){
        this.addPart(i)
    }
}

if(play){
     var clock = new Clock(clockSize);
    document.getElementById('resetClock').addEventListener('click', function(){
       clock.reset(); 
    });   
}