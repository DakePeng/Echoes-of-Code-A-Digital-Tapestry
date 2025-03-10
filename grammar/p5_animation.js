//Tracery example by Allison Parrish
//But we'll also create a box to hold our lines as they move
let particles = [];

let bgImage;

function preload() {
    bgImage = loadImage("background.jpg"); // Change to your file name
}
function drawTitle() {
  textSize(15);  // Huge text size
  textAlign(CENTER, CENTER);  // Center both horizontally and vertically
  textFont("Courier", 150);  // Bold font (700 weight)
  fill(255);  // Solid white color for the title
  stroke(150);  // Gray stroke color
  strokeWeight(2);  // Thickness of the stroke
  text("Plato Babbles", width / 2, height / 2);  // Centered in the canvas and placed slightly higher
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(50);
}


function draw() {
  image(bgImage, 0, 0, width, height);
  // Draw the faint title
  drawTitle();
  // This moves the particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
  background(50,50,50,50);

  // Add source note (new code)
  textSize(20);
  textAlign(LEFT, BOTTOM);
  textFont("Courier");
  fill(150);  // Medium gray color
  noStroke();

}

//This draws the word with each mouse click
function mouseClicked() {
  var grammar = tracery.createGrammar(grammarSource);
  var output = grammar.flatten("#origin#");
  // Capitalize first letter
  output = output.charAt(0).toUpperCase() + output.slice(1);
  let p = new Particle(mouseX, mouseY, output);
  particles.push(p);
}

// grammerSource is generated using:
// http://tracery.io/ 
// See the tutorial here: http://www.crystalcodepalace.com/traceryTut.html
var grammarSource = {
    "origin": [
        "#state# is the #quality# of #person#, and it is through #activity# that we achieve #idea#.",
        "To #understand# the #natural_object#, one must first #think# about the #content# of #belief#.",
        "The #emotion# of #person# is a reflection of their #condition#, which is shaped by the #happening# in the #region#.",
        "In the pursuit of #idea#, #person# must confront the #difficulty# of #change#, which leads to #improvement#.",
        "The #structure# of #natural_object# reveals the #property# of #content#, and thus we #understand# the #idea#.",
        "Through #activity#, #person# seeks to #create_by_mental_act# a #representation# of #belief#, which is the essence of #idea#.",
        "The #feeling# of #person# is influenced by the #state# of #region#, and this #affect# their #desire# for #improvement#.",
        "To #see# the #quality# of #person#, one must #evaluate# their #action# in the context of #happening#.",
        "The #message# of #person# is a #representation# of their #belief#, which is shaped by the #condition# of #region#.",
        "The #change_state# of #natural_object# is a metaphor for the #condition# of #person#, and it is through #activity# that we #understand# this #idea#."
    ],
    "state": ["perfection", "existence", "freedom", "unity", "imperfection", "feeling", "condition", "situation", "readiness", "separation"],
    "quality": ["excellence", "power", "difference", "nature", "morality", "simplicity", "uncertainty", "accuracy", "complexity", "goodness"],
    "person": ["modern", "leader", "intellectual", "lover", "friend", "ruler", "warrior", "worker", "native", "seeker"],
    "activity": ["attempt", "education", "search", "work", "creation", "process", "game", "help", "practice", "training"],
    "idea": ["ideal", "notion", "conception", "plan", "construct", "inspiration", "suggestion"],
    "understand": ["comprehend", "apprehend", "interpret", "solve"],
    "natural_object": ["world", "body", "universe", "stone", "rock", "nest", "covering"],
    "think": ["consider", "conclude", "reason", "meditate", "view"],
    "content": ["thought", "essence", "idea", "representation", "belief", "wisdom", "tradition"],
    "belief": ["philosophy", "doctrine", "conviction", "religion", "opinion", "faith"],
    "emotion": ["love", "fear", "hate", "joy", "anger", "reverence"],
    "condition": ["need", "silence", "circumstance", "danger", "comfort", "guilt", "despair", "purity"],
    "happening": ["beginning", "case", "fate", "fire", "change", "occasion", "destiny", "success"],
    "region": ["side", "heaven", "paradise", "hell", "mansion", "territory", "area"],
    "difficulty": ["problem", "trouble", "hindrance", "impediment", "predicament"],
    "change": ["improve", "transform", "grow", "prepare", "convert", "adapt"],
    "improvement": ["revival", "development", "reform", "amelioration", "recovery", "repair"],
    "structure": ["building", "pattern", "tower", "shelter", "monument", "partition"],
    "property": ["style", "age", "manner", "mode", "characteristic", "feature", "way", "strength"],
    "create_by_mental_act": ["conceive", "invent", "imagine", "design", "contrive"],
    "representation": ["image", "memory", "interpretation", "picture", "perception", "map"],
    "feeling": ["humour", "pleasure", "desire", "passion", "sentiment", "pride", "enthusiasm"],
    "affect": ["disturb", "surprise", "stimulate", "trouble", "influence"],
    "desire": ["long", "wish", "ambition", "longing", "lust"],
    "see": ["respect", "esteem", "behold", "deem", "idealize"],
    "evaluate": ["attribute", "anticipate", "accept", "expect", "reject"],
    "action": ["attempt", "continue", "engage", "sacrifice", "pursue", "discover"],
    "message": ["tale", "subject", "narrative", "meaning", "instruction", "statement", "story"],
    "change_state": ["become", "decline", "prosper", "perish", "awake", "liberate", "relax", "dissolve"]
};

class Particle {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.ax = random(-0.02, 0.02);
    this.ay = random(-0.02, 0.02);
    this.size = 16;
    this.text = this.splitAtSentence(text);
    this.textWidth1 = textWidth(this.text[0]);
    this.textWidth2 = this.text[1] ? textWidth(this.text[1]) : 0;
    this.boxWidth = max(this.textWidth1, this.textWidth2) + 20;
    this.boxHeight = this.text[1] ? this.size * 2 + 25 : this.size + 25;
    this.createdTime = millis(); // Track creation time
  }

  finished() {
    const age = millis() - this.createdTime;
    return age > 20000 || 
           this.x < 0 || 
           this.x > windowWidth || 
           this.y < 0 || 
           this.y > windowHeight;
  }

  show() {
    const age = millis() - this.createdTime;
    const fadeRatio = Math.max(1 - age / 20000, 0); // 1 to 0 over 20 seconds
    
    textSize(this.size);
    textFont("Courier");
    textAlign(CENTER, CENTER);

    // Fading effects
    fill(255, 200 * fadeRatio); // Bubble background
    stroke(0, 150 * fadeRatio); // Bubble border
    strokeWeight(2);
    rect(this.x - this.boxWidth / 2, this.y - this.boxHeight / 2, 
         this.boxWidth, this.boxHeight, 15);

    fill(0, 255 * fadeRatio); // Text color with fade
    noStroke();
    text(this.text[0], this.x, this.y - this.size / 4);
    if (this.text[1]) {
      text(this.text[1], this.x, this.y + this.size / 1.5);
    }
  }

  // Update particle position and handle edge bouncing
  update() {
    // Update the velocity with acceleration
    this.vx += this.ax;
    this.vy += this.ay;

    // Update position based on velocity
    this.x += this.vx;
    this.y += this.vy;
    let leftbound = this.x - 1/2 * this.boxWidth
    let rightbound = this.x + 1/2 * this.boxWidth
    let upperbound = this.y - 1/2 * this.boxHeight
    let lowerbound = this.y + 1/2 * this.boxHeight
    // Bounce off the left and right edges
    if (leftbound < 0 || rightbound> width) {
      this.vx *= -1; // Reverse horizontal velocity
      this.x = constrain(this.x , 0, width); // Keep particle within boundaries
    }

    // Bounce off the top and bottom edges
    if (upperbound < 0 || lowerbound > height) {
      this.vy *= -1; // Reverse vertical velocity
      this.y = constrain(this.y, 1/2 * this.boxHeight , height - 1/2 * this.boxHeight); // Keep particle within boundaries
    }
  }

  // Display the particle with a speech bubble
  show() {
    textSize(this.size);
    textFont("Courier");
    textAlign(CENTER, CENTER);

    // Calculate the width of the text and the speech bubble size
    let textWidth1 = textWidth(this.text[0]);
    let textWidth2 = this.text[1] ? textWidth(this.text[1]) : 0;
    let boxWidth = max(textWidth1, textWidth2) + 20;
    // Adjusted height of the speech bubble to make it taller
    let boxHeight = this.text[1] ? this.size * 2 + 25 : this.size + 25;

    // Draw the speech bubble (rounded rectangle)
    fill(255, 200); // Semi-transparent white
    stroke(0);
    strokeWeight(2);
    rect(this.x - boxWidth / 2, this.y - boxHeight / 2, boxWidth, boxHeight, 15); // Rounded corners

    // Draw the text inside the bubble
    fill(0); // Black text
    noStroke();
    text(this.text[0], this.x, this.y - this.size / 4);
    if (this.text[1]) {
      text(this.text[1], this.x, this.y + this.size / 1.5);
    }
  }

  // Split the text into two lines at the first punctuation mark (comma or period)
  splitAtSentence(text) {
    let splitPoint = text.indexOf(",") !== -1 ? text.indexOf(",") : text.indexOf(".");
    if (splitPoint !== -1 && splitPoint < text.length - 1) {
      return [text.substring(0, splitPoint + 1), text.substring(splitPoint + 2)];
    }
    return [text]; // Return single line if no punctuation found
  }
}

