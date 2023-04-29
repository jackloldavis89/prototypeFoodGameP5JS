let gamemode;
let currentMode = 0; //set to resturaunt by default for now
let midX;
let midY;
let keyText;
let xSpeed;
let ySpeed;
let characterShape;
let characterDirection = 0;
let canvasX = 500;
let canvasY = 500;
let customerArray = [];
let interactableArray = [];
let closestObject;
let interacting = false;
let characterHolding = 0;
let COOKINGCONSTANT = " (Cooked)";

//someArray.forEach(item, iterator => {} ); this is sample code for a forEach in javascript

//ideas:
//make a max distance u can interact with stuff? if player leaves this distance close the interaction?
//collisions with interactable objects?

function setup() {
  //create canvas
  createCanvas(canvasX, canvasY);
  
  //created an object so I could hashmap integers to Strings.
  gamemode = new Object(); 
  //gamemodes or screens, tells what to draw
  gamemode = {
    0 : "Resturaunt",
    1 : "Runner"
  }
  //middle of canvas
  midX = width/2;
  midY = height/2;
  //player speed
  xSpeed = 2;
  ySpeed = 2;
  //character object
  characterShape = new character(midX, midY);
  //interactables
  storage1 = new storageContainer("storage1", 50, 50); //name, x, y
  storage2 = new storageContainer("storage2", 300, 50);
  riceCooker = new cookingInstrument("Rice Cooker", ["Rice"], 300, 400);
  //ingredients
  rice = new ingredient("Rice", 3); //name, cookingTime
  vegetables = new ingredient("Vegetables", 3);
  //TBD: recipes
  // burrito = new recipe([]);
  //text size
  textSize(width / 50);
  //background
  background(220);
  
  //debug
  characterHolding = rice; //start character with rice for debug
}

//keycodes: a = 65 (left), w = 87 (forward), s = 83 (backwards), d = 68 (right)

// space = 32, e = 69

function draw() {
  //switch for current game mode
  switch(gamemode[currentMode]){
    case "Resturaunt":
      //Resturaunt Code...
      background(220);
      characterShape.display();
      //debug text
      fill(0);
      text(keyCode, 10, 30);
      text(gamemode[currentMode], 30, 30);
      text("WASD to walk, Space to interact, R for more rice, V for veggies", 30, 40);
      //text(storage1.selectedItem, 30, 40)
      //text(storage1.stores, 30, 50);
      //text(storage1.ammountStored, 60, 50);
      //Character Movement
      if(!interacting) {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
          characterShape.move(0-xSpeed, 0);
          characterDirection = 2;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
          characterShape.move(xSpeed, 0);
          characterDirection = 3;
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
          characterShape.move(0, 0-ySpeed);
          characterDirection = 0;
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
          characterShape.move(0, ySpeed);
          characterDirection = 1;
        }
      }
      //interactable objects
      storage1.display();
      storage2.display();
      riceCooker.display();
      break;
    case "Runner":
      //Runner code...
      background(220);
      fill(0);
      text(keyCode, 10, 30);
      text(gamemode[currentMode], 30, 30);
      text(interacting, 30, 40);
      break;
    default:
      currentMode = 0; //defaults to resturaunt game
  }
}


function keyPressed() { //runs evertime a key is pressed, regardless
  if(keyCode >= 48 & keyCode <= 57) { //checks if a number key has been pressed, if so changes the gamemode.
    switchGameModes(keyCode - 48);
  }
  
  if(keyCode == 82) { //82 is r, gives rice
    characterHolding = rice;
  }
  
  if(keyCode == 86) { //86 is v, gives vegetables
    characterHolding = vegetables;
  }
  
  if(interacting) { //check if we're interacting
    switch(closestObject.type) {//different keystrokes for different object types
      case "storage": //for storageContainers
        switch(keyCode) {
            case UP_ARROW:
                //checks if at start of list, if not decreases by
                if(closestObject.selectedItem > 0){closestObject.selectedItem --;}  
                break;
              case DOWN_ARROW:
                //checks if at end of list, if not increases by 1
                if(closestObject.selectedItem < closestObject.stores.length - 1){closestObject.selectedItem ++;} 
                break;
              case 32: //space or the interaction key
                if(closestObject.stores.length > 0) { //makes sure there is an item in stores[] before trying to remove anything
                characterHolding = closestObject.stores[closestObject.selectedItem]; // gives the item to the character
                closestObject.removeStored(closestObject.stores[closestObject.selectedItem]); // removes the item from the storage 
                }
                closestObject.selectedItem = 0;  //resets selected
                interacting = false;
                closestObject.display();
                break;
        }
        break;
        case "cooking":
          switch(keyCode) {
              case 32:
              interacting = false;
              closestObject.display();
          }
        break;
        }
    
  } else {
    if(keyCode == 32) { //interaction code, keyCode 32 is spacebar
    //if(interacting) {
    //interacting = false;
    //closestObject.display();
    //} else {
    characterShape.closestTo();
    interacting = true;
    //}
  }
  }
}


class ingredient {
  constructor (name, cookingTime) {
    this.name = name;
    this.cookingTime = cookingTime;
    this.cooked = false;
  }
}

class plate {
  constructor (name) {
    this.name = name;
    this.ingredientsOnPlate = [];
  }

  checkIfComplete () {
    //TBD: add a way to check if all the ingredients on a plate add up to a recipe
  }
}

class recipe {
  constructor (name, x, y) {
    
  }
  //make an easy way for new recipes to be added
}

class cookingInstrument {
  constructor (name, accepts, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.accepts = accepts;
    this.height = 50;
    this.width = 75;
    this.type = "cooking";
    this.cooking = "";
    this.timer = 0;
    
    interactableArray.push(this);
  }
  display () {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
    //interacting
    if(closestObject == this && interacting) {
      if(this.accepts.indexOf(characterHolding.name) != -1 && !characterHolding.cooked) { //checks if the cooker accepts the item
        this.cook(characterHolding);
      }
      if(characterHolding == 0) {
        //if not holding anything
        if(this.cooking.cookingTime - this.timer == 0) { //if cooking is done
          characterHolding = new ingredient(this.cooking.name + COOKINGCONSTANT, -1); //maybe add another way for cooked items to be differentiated
          characterHolding.cooked = true;
          this.cooking = "";
          this.timer = 0;
        }
      } 
      interacting = false;
      closestObject.display();
    } 
    //currentlyCooking
    if(this.cooking != "") {
      fill(255); //sets text to black
      if(frameCount % 60 == 0 && this.timer < this.cooking.cookingTime) { //frameCount % 60 == 0 happens every one second
        this.timer ++;
        text(this.timer, this.x + 5, this.y + 30);
      }
    }
    //change text display back to normal
    textStyle(NORMAL);
    fill(0);
    //display storage container's name
    text(this.name, this.x + 5, this.y + 10);
    //check if there is an item cooking, displays the item
    if(this.cooking.name != undefined){ 
      text(this.cooking.name + " " + (this.cooking.cookingTime - this.timer), this.x + 5, this.y + 20);
    }
  }
  
  cook(ingredientToCook) {
    this.cooking = ingredientToCook; //sets current item cooking
    characterHolding = 0; //sets character holding to zero
    //closes menu
    interacting = false;
    closestObject.display();
  }
}

class storageContainer {
  constructor (name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.type = "storage";
    this.height = 50;
    this.width = 50; 
    this.stores = [];
    this.ammountStored = new Object();
    this.selectedItem = 0;
    interactableArray.push(this);
  
  }
  display() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
    if(closestObject == this && interacting) {//interaction
      if(characterHolding != 0) {//if character is holding an ingredient
        if(this.ammountStored[characterHolding.name] >= 0) { //if already in storage
          this.ammountStored[characterHolding.name] ++; //simply add to whats already stored
          
        } else { //if not already in storage
          this.stores.unshift(characterHolding);  //put a new characterHolding at the start of stores, unshift is the opposite of push
          this.ammountStored[characterHolding.name] = 1; //have the newly stored items name hashed to the amount, have this set to 1 as if there wasnt any before, now there has to be one
        }
      characterHolding = 0; //set character to not be holding anything, as anything held is already placed in the storage
      } else {//if character is not holding an ingredient
        rect(this.x, this.y, this.width, this.height * 2); //display the menuscreen
        this.stores.forEach((item , i) => { //goes through all stored items in this container
          if(this.ammountStored[item.name] > 0) { //checks if ammount stored is > 0 and it needs to be display
            fill(0);
            if(this.selectedItem == i){ //shows what item is selected by changing font type
              textStyle(BOLDITALIC);
            }else{
              textStyle(NORMAL);
            }
            text(item.name + " " + this.ammountStored[item.name], this.x + 10, this.y + (i+1) * 20); //displays items and stored amount
          }
        });
      }
    }
    //change text display back to normal
    textStyle(NORMAL);
    fill(0);
    //display storage container's name
    text(this.name, this.x + 5, this.y + 10); 
  }
  
  removeStored(removethis) {
    this.ammountStored[removethis.name] -= 1; //removes one from the inventory
    if(this.ammountStored[removethis.name] == 0) { //if we run out of the object
      //removes it from the this.stores array
      this.stores.splice(this.selectedItem, 1);
      //deletes the hash
      delete this.ammountStored[removethis.name];
    }
  }
}

function switchGameModes (switchTo) { //changes gamemode to passed integer
  this.switchTo = switchTo;
  currentMode = this.switchTo; //changes mode
  clear(); //then clears
}

function character(x, y){ //this handles the character geomotry, currently an ellipse
    this.x = x;
    this.y = y;
    this.size = 40;
    this.direction = new Object();
    this.direction = { //Might have to add octal directions?
      0 : "UP",
      1 : "DOWN",
      2 : "LEFT",
      3 : "RIGHT"
    }
  
    this.display = function (){
      fill(255,100);
      ellipse(this.x, this.y, this.size);
      
      //
      switch(this.direction[characterDirection]) { // this is responsible for the direction your character is facing, I use it to display what we're holding currently
        case "UP":
          //ellipse(this.x, this.y - (canvasY / 10), this.size / 10);
          fill(0);
          text(characterHolding.name, this.x, this.y - (canvasY / 10)); //places a textbox of what we're holding upwards
          //anymore stuff for upwards...
          break;
          
        case "DOWN":
          //ellipse(this.x, this.y + 50, this.size / 10);
          fill(0);
          text(characterHolding.name, this.x, this.y + 50);
          break;
          
        case "LEFT":
          //ellipse(this.x - 50, this.y, this.size / 10);
          fill(0);
          text(characterHolding.name, this.x - 50, this.y);
          break;
          
        case "RIGHT":
          //ellipse(this.x + 50, this.y, this.size / 10);
          fill(0);
          text(characterHolding.name, this.x + 50, this.y);
          break;
          
             }
    }
    
    this.move = function(xPos, yPos) {
      //makes sure character cant go out of bounds, will probably need to make this also deal with objects
      if(this.x <= canvasX & this.x >= 0){this.x += xPos;}else{if(this.x<0){this.x = 0}else{this.x = canvasX}}
      if(this.y <= canvasY & this.y >= 0){this.y += yPos;}else{if(this.y<0){this.y = 0}else{this.y = canvasY}}
    }
  
  this.closestTo = function() {
    lastDistance = 999999999; //set to any super high number
    interactableArray.forEach( //runs distance formula for each interactable object in the array
    entity => {
      distance = Math.sqrt(
        Math.pow((entity.x - this.x), 2) + 
        Math.pow((entity.y - this.y), 2)
        );
      if(distance <= lastDistance) { //compares distances
        closestObject = entity; 
        lastDistance = distance;
      }
    });
    }
  }

