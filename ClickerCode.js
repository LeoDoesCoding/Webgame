//Doccument elements
let rockSprite = document.getElementById("clickContainer");
let up1Butt = document.getElementById("up:click");
let up2Butt = document.getElementById("up:auto");
let dep1Butt = document.getElementById("depth:1");
let dep2Butt = document.getElementById("depth:2");
let dep3Butt = document.getElementById("depth:3");
dep2Butt.disabled = true;
dep3Butt.disabled = true;

//Misc variables
let hardness; //Damage until rock breaks
let depth = 1; //Start on beggining depth
let wait; //Control when the user can hit rock
let checkWait = false; //Prevents user click and auto click from overlapping rock break
let hardnessLeft; //Rock "health"
let money = 0; //Money user has
let clicks = 0; //Times user has clicked rock(when active)
let gross = 0; //Total money user has gained

//Upgrade stats
let pick = 1; //Damage done by user
let auto = 0; //Auto damage

//Upgrade prices
let up1Price = 5; //Cost of upgrade 1
let up2Price = 5; //Cost of upgrade 2
let dep2Price = 50;
let dep3Price = 400;

//Rock types
let rock1 = {name:"Rose quartz", hardness:5, weight:0, points:1, collected: 0, img:"url(Images/Gems/rose.png)", gotImg:"Images/Gems/roseGot.png"};
let rock2 = {name:"Amethyst", hardness:10, weight:0, points:5,  collected: 0, img:"url(Images/Gems/ame.png)", gotImg:"Images/Gems/ameGot.png"};
let rock3 = {name:"Opal", hardness:20, weight:0, points:20, collected: 0, img:"url(Images/Gems/opal.png)", gotImg:"Images/Gems/opalGot.png"};
let rock4 = {name:"Malachite", hardness:30, weight:0, points:30, collected: 0, img:"url(Images/Gems/mal.png)", gotImg:"Images/Gems/malGot.png"};
let rock5 = {name:"Agate", hardness:45, weight:0, points:50, collected: 0, img:"url(Images/Gems/agate.png)", gotImg:"Images/Gems/agateGot.png"};
let rock6 = {name:"Ruby", hardness:50, weight:0, points:70, collected: 0, img:"url(Images/Gems/ruby.png)", gotImg:"Images/Gems/rubyGot.png"};
let rock7 = {name:"Peridot", hardness:70, weight:0, points:100, collected: 0, img:"url(Images/Gems/peri.png)", gotImg:"Images/Gems/periGot.png"};
let rock8 = {name:"Diamond", hardness:100, weight:0, points:200, collected: 0, img:"url(Images/Gems/dia.png)", gotImg:"Images/Gems/diaGot.png"};
let rock9 = {name:"Prismite", hardness:100, weight:0, points:200, collected: 0, img:"url(Images/Gems/final.png)", gotImg:"Images/Gems/finalGot.png"};
let rocks = [rock1, rock2, rock3, rock4, rock5, rock6, rock7, rock8, rock9];
let currentRock;



//Bring on first rock an set weights
window.onload = function() {
	reDepth(1);
	next();
}


//When user clicks rock
function hit(){
	if (!wait){ //only run function if not already in motion (including checkNext function)
		wait = true; //disables user from hitting rock again
		hardnessLeft = hardnessLeft - pick; //deals damage
		clicks ++;
		document.getElementById("clicks").textContent = "Clicks: " + clicks;
		damage();
	}
}

//Deals damage/animation for auto clicker
function autoDamage(){
	if (!wait){
		hardnessLeft = hardnessLeft - auto; //deals damage
		damage();
	}
}


//When either user or auto hits rock
function damage(){
	//If broken a certain ammount, change image position
	if ((0.40 * rocks[currentRock].hardness) >= hardnessLeft){
		rockSprite.style.backgroundPosition = "600px";
	}else if ((0.75 * rocks[currentRock].hardness) >= hardnessLeft){
		rockSprite.style.backgroundPosition = "900px";
	}
	
	
	if (hardnessLeft <= 0){
		rockSprite.style.backgroundPosition = "300px";
		if (rocks[currentRock].collected == 0){ //If user has not got rock in collection,add
			rocks[currentRock].collected = 1;
			document.getElementById("collected").textContent = rocks[currentRock].name + " collected!";
			document.getElementById(rocks[currentRock].name).src = rocks[currentRock].gotImg;
			setTimeout(function(){
				document.getElementById("collected").textContent = "";
			},1200);
		}
	}
		
	//Hit animation
	clickContainer.classList.add("apply-shake");
	setTimeout(() => {
	clickContainer.classList.remove("apply-shake");
	checkNext();
	}, 200);
}


//Checks if rock is broken, if so, calls function "next"
function checkNext(){
	if (hardnessLeft <= 0 && checkWait === false){ //If broken and function not alread in progress...
		wait = true;
		checkWait = true;
		
		money += rocks[currentRock].points; //Adds money of value rock property "points"
	    gross += rocks[currentRock].points; //Adds money of value rock property "points"
		document.getElementById("money").textContent = "£" + money; //Updates on screen stats
		document.getElementById("total").textContent = "Total gain: " + gross; //Updates on screen stats
		updateButts();
		
		//Fly off screen right
		pos = 50;
		setTimeout(function(){
			timer = setInterval(function(){
				pos += 10;
				rockSprite.style.left = pos + "%";
				if(pos > 100) {clearInterval(timer); rockSprite.style.visibility = "hidden"; next();} //When off screen, exit timer function and hides rock sprite and call the next
			},25);
		},300);
	}
	else { //If not broken or function is already in progress, allow for more hits
		wait = false;
	}
}


//Generates and sends in the next rock
function next(){
	//Generates next rock, and sets appropriate property to rock type
	generateRock();
	hardnessLeft = rocks[currentRock].hardness;
	rockSprite.style.backgroundImage = rocks[currentRock].img;
	rockSprite.style.backgroundPosition = "0px";
	rockSprite.style.visibility = "visible";
	
	//Fall into frame from top of screen animation
	rockSprite.style.left = 50 + "%";
	rockSprite.style.top = "-50%";
	var pos = -60;
	timer = setInterval(function(){
		pos += 15;
		rockSprite.style.top = pos + "%";
		if( pos >= 30) { //When in position, exit timer function and enable user to hit rock
			clearInterval(timer);
			wait = false;
			checkWait = false;
		}
	},25);
}


//Choses a rock type from the pool at random, chance deppendant on assigned weights (see function "reDepths")
function generateRock(){
	let total = 0;
	for (let i = 0; i <rocks.length; i++){ //adds weights together
		total += rocks[i].weight;
	}
	
	var chosen = Math.random() * total; //A number is chosen, from 0 to total weights
	
	//Find item with the weight
	total = 0;
	for (let i = 0; i < rocks.length; ++i) {
		// Add the weight to our running total.
		total += rocks[i].weight;
		if (total >= chosen) {
			currentRock = i; //"currentRock" gains index of chosen rock type
			break;
		}
	}
}


//Checks money to enable/disable upgrade buttons
function updateButts(){
	//Upgrade 1 check
	if (money >= up1Price){
		up1Butt.disabled = false;
	} else if (money <= up1Price){
		up1Butt.disabled = true;		
	}
	
	//Upgrade 2 check
	if (money >= up2Price){
		up2Butt.disabled = false;
	} else if (money <= up2Price){
		up2Butt.disabled = true;		
	}
	
	//Depth 2 check
	if (money >= dep2Price){
		dep2Butt.disabled = false;
	}
	
	//Depth 2 check
	if (money >= dep3Price){
		dep3Butt.disabled = false;
	}
}


//When user clicks an upgrade, set upgrade and change prices
function purchase(upgrade){
	//Upgrade #1 clicked
	if (upgrade == 1 && up1Price <= money){
		money -= up1Price;
		up1Price *= 2;
		if (pick < 10){
			pick += 0.5;
		} else if (pick < 50){
			pick += 2;
		} else {
			pick += 50;
		}
		updateButts();
		document.getElementById("up:click").innerHTML = "Pickaxe damage: " + pick + "<br>£" + up1Price;
	
	//Upgrade #2 clicked
	} else if (upgrade == 2 && up2Price <= money){ //If upgrade#2 clicked
		money -= up2Price;
		up2Price *= 2;
		auto += 0.5;
		document.getElementById("up:auto").innerHTML = "Auto damage: " + auto + "<br>£" + up2Price;
		if (auto == 0.5){ //If auto has just been initialized, start the autoclicker loop function
			setInterval(autoDamage,1000);
		}
		updateButts();
		
	//Depth #2 clicked
	} else if (upgrade == 3 && dep2Price <= money){
		money -= dep2Price;
		dep2Price = 0;
		updateButts();
		reDepth(2);
		document.getElementById("depth:2").innerHTML = "Depth 2<br>(unlocked)";
	
	//Depth #3 clicked	
	}else if (upgrade == 4 && dep3Price <= money){
		money -= dep3Price;
		dep3Price = 0;
		updateButts();
		reDepth(3);
		document.getElementById("depth:3").innerHTML = "Depth 3<br>(unlocked)";
	}
	
	//Updates money display ammount
	document.getElementById("money").textContent = "£" + money;
}


//When depth selected, recalibrate rock spawn weights
function reDepth(level){
	let posRock = 30;
	wait = true;
	
	//If depth #1 clicked
	if (level == 1){
		//Disable buttons while moving
		dep1Butt.classList.add("active");
		dep2Butt.classList.remove("active");
		dep3Butt.classList.remove("active");
		dep2Butt.disabled = true;
		dep3Butt.disabled = true;
		
		//Background moving animation
		if (depth == 2){
			pos = -120;
			timer = setInterval(function(){
				pos += 5;
				posRock += 10;
				document.getElementById("bg").style.top = pos + "%";
				rockSprite.style.top = posRock + "%";
				if(pos >= 0) {clearInterval(timer); dep1Butt.disabled = false; dep1Butt.classList.add("active"); wait = false; next();}
			},25);
		} else if (depth == 3){
			pos = -230;
			timer = setInterval(function(){
				pos += 5;
				posRock += 10;
				document.getElementById("bg").style.top = pos + "%";
				rockSprite.style.top = posRock + "%";
				if(pos >= 0) {clearInterval(timer); dep1Butt.disabled = false; dep1Butt.classList.add("active"); wait = false; next();}
			},25);
		}else{
			wait = false;
		}
		updateButts();
		depth = 1;
	
		//Rock weights for depth
		rock1.weight = 20;
		rock2.weight = 12;
		rock3.weight = 1;
		rock4.weight = 0;
		rock5.weight = 0;
		rock6.weight = 0;
		rock7.weight = 0;
		rock8.weight = 0;
		rock9.weight = 0;
	}
	
	//If depth #2 clicked	
	if (level == 2){
		//Disable buttons while moving
		dep1Butt.classList.remove("active");
		dep2Butt.classList.add("active");
		dep3Butt.classList.remove("active");
		dep1Butt.disabled = true;
		dep3Butt.disabled = true;
		
		//Background moving animation
		if (depth == 1){
			pos = 0;
			timer = setInterval(function(){
				pos -= 5;
				posRock -= 10;
				document.getElementById("bg").style.top = pos + "%";
				rockSprite.style.top = posRock + "%";
				if(pos <= -120) {clearInterval(timer); dep1Butt.disabled = false; dep2Butt.classList.add("active"); wait = false; next();}
			},25);
		} else if (depth == 3){
			pos = -230;
			posRock += 10;
			timer = setInterval(function(){
				pos += 5;
				document.getElementById("bg").style.top = pos + "%";
				rockSprite.style.top = posRock + "%";
				if(pos >= -120) {clearInterval(timer); dep1Butt.disabled = false; dep2Butt.classList.add("active"); wait = false; next();}
			},25);
		}else{
			wait = false;
		}
		updateButts();
		depth = 2;
	
		//Rock weights for depth
		rock1.weight = 3;
		rock2.weight = 2;
		rock3.weight = 1;
		rock4.weight = 25;
		rock5.weight = 5;
		rock6.weight = 2;
		rock7.weight = 0;
		rock8.weight = 0;
		rock9.weight = 0;
	}
	
	//If depth #3 clicked
	if (level == 3){
		//Disable buttons while moving
		dep1Butt.classList.remove("active");
		dep3Butt.classList.add("active");
		dep2Butt.classList.remove("active");
		dep1Butt.disabled = true;
		dep2Butt.disabled = true;
		
		//Background moving animation
		if (depth == 1){
			pos = 0;
			timer = setInterval(function(){
				pos -= 5;
				posRock -= 10;
				document.getElementById("bg").style.top = pos + "%";
				rockSprite.style.top = posRock + "%";
				if(pos <= -230) {clearInterval(timer); dep1Butt.disabled = false; dep3Butt.classList.add("active"); wait = false; next();}
			},25);
		} else if (depth == 2){
			pos = -120;
			timer = setInterval(function(){
				pos -= 5;
				posRock -= 10;
				document.getElementById("bg").style.top = pos + "%";
				rockSprite.style.top = posRock + "%";
				if(pos <= -230) {clearInterval(timer); dep1Butt.disabled = false; dep3Butt.classList.add("active"); wait = false; next();}
			},25);
		}else{
			wait = false;
		}
		updateButts();
		depth = 3;
	
		//Rock weights for depth
		rock1.weight = 0;
		rock2.weight = 0;
		rock3.weight = 0;
		rock4.weight = 2;
		rock5.weight = 50;
		rock6.weight = 30;
		rock7.weight = 10;
		rock8.weight = 3;
		rock9.weight = 1;
	}
}


rockSprite.addEventListener('click', hit); //Player clicks rock
up1Butt.addEventListener('click', function(){
	purchase(1);//Buy upgrade 1
});
up2Butt.addEventListener('click', function(){
	purchase(2); //Buy upgrade 2
});
dep1Butt.addEventListener('click', function(){
	if (!wait){reDepth(1);}//Depth 1
});
dep2Butt.addEventListener('click', function(){
	if (!wait){purchase(3);}//Depth 2
});
dep3Butt.addEventListener('click', function(){
	if (!wait){purchase(4);}//Depth 3
});
