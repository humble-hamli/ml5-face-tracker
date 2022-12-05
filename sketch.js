let mobilenet;
let video;
let classifier;

// main category array
let categories = [];

//create Button vars
let train, predict, saveModel; 

function setup() 
{
	cvs = createCanvas(640,480);
	cvs.parent(videoContainer);

	// Videoaufnahme generieren.
	video = createCapture(VIDEO);
	video.size(640,480);
	video.hide();

	//MobileNet functionen laden
	featureExtractor = ml5.featureExtractor("MobileNet", modelReady);

	//Classifier aus Feature zuordnen
	classifier = featureExtractor.classification(video, videoReady);

	// Knöpfe Intialisieren
	showButtons();
}

function draw() {
	//Video in Canvas zeichnen
	image(video, 0, 0)
}

//Gibt an ob Model bereit ist
function modelReady() {
	console.log("Model is ready!")
}

//Gibt an ob Video bereit ist
function videoReady() {
	console.log("Video is ready!")
}

//Categorie Klase definieren
class Category {
	constructor (name) {
		this.name = name;
		this.images = [];
		this.index = 0
	}

	createButton() {
		let buttonContainer = select("#buttons");
		this.button = document.createElement("button");
		this.button.setAttribute("id", this.name)
		this.button.innerHTML = `Add ${this.name} Image`
		
		this.buttonIndex = document.createElement("span")
		this.buttonIndex.setAttribute("id", `${this.name}Amount`)
		this.buttonIndex.innerHTML = ` ${this.index}`


		buttonContainer.elt.appendChild(this.button);
		buttonContainer.elt.appendChild(this.buttonIndex);
		buttonContainer.elt.appendChild(document.createElement("br"));

		this.buttonPressed()

	}

	buttonPressed() {
		console.log("I fire")
		this.clickedBanner = select(`#${this.name}`)
		console.log(this.name)
		console.log(this.clickedBanner)
		this.clickedBanner.mousePressed(() => this.addImage())
	}

	addImage() {
		let img = cvs.elt.toDataURL("image/jpg", 1)
		this.images.push(img)
		this.index++
		this.buttonIndex.innerHTML = ` ${this.index}`
	}

}

function addCategory(name) {
	console.log("Category ", name, "is created")
	if (name  != "") {
		categories.push(new Category(name))
		categories[categories.length-1].createButton()
	}
}

function showButtons() {
	//Add Category
	addCategoryButton = select("#addCategory");
	addCategoryName = select("#categoryName");
	addCategoryButton.mousePressed(() => {addCategory(addCategoryName.elt.value)} )

	// Train Button
	let train = select("#Train");
	train.mousePressed(async function () {
	  await addTrainingData();
	  classifier.train(function (lossValue) {
		console.log("Loss is", lossValue);
	  });
	});
  
	// Predict Button
	let predict = select("#Predict");
	predict.mousePressed(classify);
  
	// Save Model
	let saveModel = select("#saveModel");
	saveModel.mousePressed(function () {
	  classifier.save();
	});
	// Load Model
	loadModel = select("#Load");
	loadModel.changed(function () {
	  files = loadModel.elt.files;
	  classifier.load(files);
	});


}

function addTrainingData() {
	for (let c =0; c < categories.length; c++) {
		for (let i = 0; i < categories[i].images.length; i++) {
			classifier.addImage(categories[i].images[i], categories[i].name)
		}
	}
}

function classify() {
	classifier.classify(video, gotResults)
}

function gotResults(error, results) {
	if (error) {
	  console.error();
	} else {
	  console.log(results);
	  classify();
	}
  }
  

