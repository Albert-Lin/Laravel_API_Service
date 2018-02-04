/**
 * Created by Albert Lin on 2018/2/1.
 */

window.apiFrame = {
	clickedDomList: [],
	clickedXPaths: [],
	lastMouseOver: { dom: null, backgroundColor: null},
	checkingDomList: [],
	originCheckDomStyle: []
};

function messageSender (data) {
	window.parent.postMessage(data, "*");
}

function receiveProcess (event) {
	switch (event.data['command']) {
		case "return":
			let column = event.data['column'];
			messageSender(window.apiFrame[column]);
			break;
		case "reset":
			for (let i = window.apiFrame.clickedDomList.length-1; i >= 0; i--) {
				popClickedEle(window.apiFrame.clickedDomList[i]);
			}
			window.apiFrame.checkingDomList.forEach((ele, index)=>{
				ele.style = window.apiFrame.originCheckDomStyle[index];
			});
			window.apiFrame.checkingDomList = [];
			break;
		case "listPatternCheck":
			let xpathPattern = event.data['pattern'];
			console.log(xpathPattern);
			if (xpathPattern) {
				window.apiFrame.checkingDomList = getAllNodeWithXPath(xpathPattern);
				window.apiFrame.originCheckDomStyle = [];
				window.apiFrame.checkingDomList.forEach((ele, index)=>{
					window.apiFrame.originCheckDomStyle.push(ele.style);
					ele.style.border = '2px';
					ele.style.borderColor = '#ff6666';
					ele.style.borderStyle = 'solid';
				});
			}
	}
}

function overDom (event) {
	let overDom = window.apiFrame.lastMouseOver;
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
	window.apiFrame.clickedDomList.forEach((dom, index)=>{
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
	window.apiFrame.clickedDomList.push(currentClickedDom);
	window.apiFrame.clickedXPaths.push(getXPath(currentClickedDom));
}

function popClickedEle (currentClickedDom) {
	let index = window.apiFrame.clickedDomList.indexOf(currentClickedDom);
	currentClickedDom.style.border = null;
	currentClickedDom.style.borderColor = null;
	currentClickedDom.style.borderStyle = null;
	window.apiFrame.clickedDomList.splice(index, 1);
	window.apiFrame.clickedXPaths.splice(index, 1);
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
	return result.replace(/\/s /gi, '\/a ');
}

function eventRegister () {
	window.addEventListener("message", receiveProcess);
	window.addEventListener("click", getClickedDomXPath);
	window.addEventListener("mouseover", overDom);
}

function getAllNodeWithXPath(xpath){
	let result = [];
	let nodes = document.evaluate(xpath, document, null, XPathResult.ANY_PATH, null);
	let node;
	while( (node = nodes.iterateNext()) ){
		result.push(node);
	}
	
	return result;
}

(function(){
	setTimeout(eventRegister, 1000);
})();