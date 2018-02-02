/**
 * Created by Albert Lin on 2018/2/1.
 */

window.clickedDoms = [];
window.clickedXPths = [];
window.lastMouseOver = { dom: null, backgroundColor: null};

function messageSender (data) {
	window.parent.postMessage(data, "*");
}

function receiveProcess (event) {
	switch (event.data['command']) {
		case "return":
			messageSender(window.clickedXPths);
			break;
		case "reset":
			for (let i = window.clickedDoms.length-1; i >= 0; i--) {
				popClickedEle(window.clickedDoms[i]);
			}
	}
}

function overDom (event) {
	let overDom = window.lastMouseOver;
	if (overDom.dom) {
		overDom.dom.style.backgroundColor = overDom.backgroundColor;
	}
	overDom.dom = event.target;
	overDom.backgroundColor = overDom.dom.style.backgroundColor;
	overDom.dom.style.backgroundColor = "rgba(0, 204, 204, 0.2)";
}

function getClickedDomXPath (event) {
	let currentClickedDom = event.target;
	let exist = false;
	window.clickedDoms.forEach((dom, index)=>{
		if (currentClickedDom === dom) {
			exist = true;
			return false;
		}
	});
	
	if (exist) {
		popClickedEle(currentClickedDom);
		
	} else {
		pushClickedEle(currentClickedDom);
	}
}

function pushClickedEle (currentClickedDom) {
	currentClickedDom.style.border = '2px';
	currentClickedDom.style.borderColor = '#ff6666';
	currentClickedDom.style.borderStyle = 'solid';
	window.clickedDoms.push(currentClickedDom);
	window.clickedXPths.push(getXPath(currentClickedDom));
}

function popClickedEle (currentClickedDom) {
	let index = window.clickedDoms.indexOf(currentClickedDom);
	currentClickedDom.style.border = null;
	currentClickedDom.style.borderColor = null;
	currentClickedDom.style.borderStyle = null;
	window.clickedDoms.splice(index, 1);
	window.clickedXPths.splice(index, 1);
}

function getXPath(node){
	
	let result = '';
	let currentNode = node;
	
	if(currentNode.ownerElement === undefined){
		// Element 	:
		if(currentNode.nodeName === '#text'){
			// #text:
			// result = "/text()";
		}
		else{
			// others:
			let tagName = currentNode.nodeName.toLowerCase();
			let id = currentNode.id;
			let parentElement = currentNode.parentElement;
			result += tagName;
			if(parentElement !== null){
				result = "/"+result;
				let childNum = parentElement.children.length;
				let index = 0;
				if(id.length > 0){
					result += " [@id='"+id+"']";
				}
				else if(childNum > 0){
					for(let i = 0; i < childNum; i++){
						if(parentElement.children[i].nodeName.toLowerCase() === tagName){
							index++;
							if(parentElement.children[i] === currentNode){
								result += " ["+index+"]";
								break;
							}
						}
					}
				}
			}
		}
		currentNode = currentNode.parentElement;
	}
	else{
		// Attribute:
		result = "/@"+currentNode.nodeName+"='"+currentNode.nodeValue+"'";
		currentNode = currentNode.ownerElement;
	}
	
	while( currentNode !== null && currentNode !== undefined){
		let currentResult = '';
		let tagName = currentNode.nodeName.toLowerCase();
		let id = currentNode.id;
		let parentElement = currentNode.parentElement;
		currentResult += tagName;
		if(parentElement !== null){
			let childNum = parentElement.children.length;
			currentResult = "/"+currentResult;
			if(id.length > 0){
				currentResult += " [@id='"+id+"']";
			}
			else if(childNum > 0){
				let index = 0;
				// if(childNum > 0){
					for(let i = 0; i < childNum; i++){
						if(parentElement.children[i].nodeName.toLowerCase() === tagName){
							index++;
							if(parentElement.children[i] === currentNode){
								currentResult += " ["+index+"]";
								break;
							}
						}
					}
				// }
			}
		}
		
		result = currentResult + result;
		currentNode = parentElement;
	}

	return "//"+xpathRegex(result);
}

function xpathRegex(xpath) {
	let result = xpath.replace(/tbody(?<=tbody).*(?=\/tr)/gi, '\/');
	return result.replace(/\/s/gi, '\/a');
}

function eventRegister () {
	window.addEventListener("message", receiveProcess);
	window.addEventListener("click", getClickedDomXPath);
	window.addEventListener("mouseover", overDom);
}

(function(){
	setTimeout(eventRegister, 1000);
})();