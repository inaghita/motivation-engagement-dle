/*--- CUSTOMIZATION: ---*/
// Graph:
const graphFont = "sans-serif"; //it was: Rajdhani
const graphBGColor = "#050505";
const fontColor = "#CCC";
const groupColors = ["#D34581","#28C2D1","#56A84F","#9953C0","#2B88D7","#F7B548","#FAF9F8"];
// Sidebar:
const titleFont = "monospace"
const sbFont = graphFont;
const sbBGColor = "#171717";
const linkColor = groupColors[1];


let Graph;
let topicsText =  Array();
const vr = false;
if(vr)
{
	Graph = ForceGraphVR()
	(document.getElementById('3d-graph'))
}
else{
	Graph = ForceGraph3D()
	(document.getElementById('3d-graph'))
}
window.onload = function(){
	document.querySelector("body").style.backgroundColor = graphBGColor;
	document.querySelector("a").style.color = linkColor;
	document.querySelector(".sidebar").style.backgroundColor = sbBGColor;
	document.querySelector(".sidebar").style.color = fontColor;
	document.querySelector(".container").style.fontFamily = sbFont;
	document.querySelector("h1#sidebar-title").style.fontFamily = titleFont;

	fetch('topics-graph-names.json')
	.then(response => response.text())
	.then(data => {
		// Do something with your data
		gData = JSON.parse(data);
		Graph.cooldownTicks(200)
		.width(window.innerWidth*0.7)
		.backgroundColor(graphBGColor)
		.nodeLabel('id')
		.nodeColor( node => {
			return groupColors[node.group];
		})
		.nodeVal( node => {
			if(node.uberTopic == "1")
				return 10;
			else
				return 0.5;
		})
		.nodeOpacity(1)
		.nodeResolution(20)
		.forceEngine('ngraph')
		.linkOpacity(0.75)
		.linkWidth(0.5)
		.linkColor( link => {
			const colorIndex = getGroup(link.target, gData.nodes);
			return(groupColors[colorIndex]);
		})
		//.jsonUrl('../topics-graph-names.json');
		.graphData(gData)
		.nodeThreeObjectExtend(true)
		.nodeThreeObject(node => {
			const sprite = new SpriteText(node.id);
			if(node.uberTopic == "1")
				sprite.center.y = -3;
			else
				sprite.center.y = -2;
			sprite.fontFace = graphFont;
			sprite.color = fontColor;
			sprite.textHeight = 3;
		//	sprite.material.depthWrite = false;
			return sprite;
		})
		.onNodeClick(node => {
			let groupName = getGroupName(node.group, gData.nodes);
			let color = groupColors[node.group];
			document.querySelector("#sidebar-variable").innerHTML = "";
			var title = document.createElement('h2');
			title.classList.add("topic-title");
			title.style.backgroundColor = color;
			title.style.color = sbBGColor;
			title.innerHTML = groupName;
			document.querySelector("#sidebar-variable").appendChild(title);
			if(node.uberTopic==0) {
				var subTitle = document.createElement('p');
				subTitle.classList.add("topic-text");
				subTitle.innerHTML = node.id + ":";
				document.querySelector("#sidebar-variable").appendChild(subTitle);
			}
			var text = document.createElement('p');
			text.classList.add("topic-text");
			text.innerHTML = fetchTopic(topicsText,node.id);
			document.querySelector("#sidebar-variable").appendChild(text);
		});
		Graph.cameraPosition({x:0,y:0,z:250})
		/* Set camera position: */
		//a = new THREE.Vector3(0,0,0);
		//Graph.cameraPosition({x: -200, y: -600, z: -200}, a);
		changeClassAttribute("scene-tooltip", "fontFamily", graphFont);
		changeClassAttribute("scene-tooltip", "backgroundColor", graphBGColor);
		changeClassAttribute("scene-tooltip", "color", fontColor);
		changeClassAttribute("scene-tooltip", "paddingLeft", "4px");
		changeClassAttribute("scene-tooltip", "paddingRight", "4px");
		changeClassAttribute("scene-tooltip", "textAlign", "center");
	});

	d3.csv("topics-text.csv", function(data) {
		for (var i = 0; i < data.length; i++) {
			topicsText[i] = {topic: data[i].topic, text: data[i].text, who: data[i].who};
			console.log(data[i]);
		}
		console.log(topicsText);
	});

};

function fetchTopic(topicsText,topic) {
	for(var i=0;i<topicsText.length;i++) {
		if(topicsText[i]["topic"] == topic) {
			if(topicsText[i]["who"] != "") {
				//var imgPath = topicsText[i]["who"].toLowerCase().replace(/\ /g, "-");
				//imgPath += ".jpg"
				var result = "";
				result += topicsText[i]["text"];
				/*
				result += '<img class="interpreter" src="/images/interpreters/';
				result += imgPath + '"></img>';
				result += '<span class="who">'; // quote dash, if required: &#8213;
				result += topicsText[i]["who"];
				result += "</span>";
				*/
				return(result);
			}
			else
				return(topicsText[i]["text"]);
		}
	}
	return ("");
}

function getGroup(name, data)
{
	for (var i = 0, len = data.length; i < len; i++)
	{
		if(data[i].id == name)
			return data[i].group;
	}
	return(0);
}

function getGroupName(index, data)
{
	for (var i = 0, len = data.length; i < len; i++)
	{
		if(data[i].group == index)
			return data[i].id;
	}
	return("");
}

/* Trying to avoid jQuery. For now at least. As much as possible. Hopefully. */
function changeClassAttribute(className, attr, value)
{
	var good = document.getElementsByClassName(className);
	for (var i = 0; i < good.length; i++) {
	  good[i].style[attr] = value;
	}
}

/* Loren Ipsum randomization */
let lorenIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at turpis arcu. Proin lorem dolor, ornare non magna vel, luctus facilisis eros. Aliquam erat volutpat. Donec non eros tempus lectus luctus volutpat. Vivamus tempor justo quis nulla feugiat varius. Donec quis magna nisl. Sed sed magna vitae urna egestas rhoncus eu et magna. Quisque tincidunt scelerisque sem ac aliquet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse potenti. Ut tincidunt imperdiet augue vel suscipit. Praesent tempus, lacus vel malesuada finibus, enim nisl imperdiet dolor, vel convallis lacus ante ac massa. Sed elit felis, pellentesque nec nisl ut, imperdiet fermentum lorem. Aliquam facilisis cursus nibh non bibendum. ";
function shuffleLoren(loren) {
	let array = loren.split(". ");
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
	}
	return array.join(". ");
}

function getTopicText(title) {

}