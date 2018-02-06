/**
 * Created by Albert Lin on 2018/2/1.
 */

// = [Data] ==================================================
/**
 * The complete data
 * @type {{}}
 */
window.apiFrame = {
	clickedDomList: [],
	clickedXPaths: [],
	lastMouseOver: { dom: null, backgroundColor: null},
	checkingDomList: [],
	originCheckDomStyle: []
};

// = [Event] =================================================
function eventRegister () {
	window.addEventListener("message", receiveProcess);
	window.addEventListener("click", getClickedDomXPath, true);
	window.addEventListener("mouseover", overDom);
}

// = [Message] ===============================================
/**
 * Function which sending data back to SolData Vue iframe
 * @param data
 */
function messageSender (data) {
	window.parent.postMessage(data, "*");
}

/**
 * The message event listener,
 * which is route of process
 * @param event
 */
function receiveProcess (event) {
	switch (event.data['command']) {
		case "return":
			returnCommand(event.data);
			break;
		case "reset":
			resetCommand();
			break;
		case "executeXPath":
			executeXPathCommand(event.data);
			break;
	}
}

/**
 * Function sending special data of apiFrame
 * back to SolData Vue iframe
 * @param {event.data} data
 */
function returnCommand (data) {
	let column = data['column'] || "";
	messageSender(window.apiFrame[column]);
	// console.log(window.apiFrame[column]);
}

/**
 * Function to reset all style back to original
 */
function resetCommand () {
	// 01. reset elements of user click for getting xpath
	for (let i = window.apiFrame.clickedDomList.length-1; i >= 0; i--) {
		popClickedEle(window.apiFrame.clickedDomList[i]);
	}
	
	// 02. reset elements of checking xpath
	window.apiFrame.checkingDomList.forEach((ele, index)=>{
		ele.style = window.apiFrame.originCheckDomStyle[index];
	});
	window.apiFrame.checkingDomList = [];
	window.apiFrame.originCheckDomStyle = [];
}

/**
 * Function execute xpath which from SolData Vue iframe
 * @param data
 */
function executeXPathCommand (data) {
	// 01. get xpath
	let xpath = data['xpath'];
	if (xpath) {
		// 02. apiFrame data init
		// resetCommand();
		window.apiFrame.checkingDomList = getAllNodeWithXPath(xpath);
		
		// 03. set special style for all elements that match the xpath
		window.apiFrame.checkingDomList.forEach((ele, index)=>{
			window.apiFrame.originCheckDomStyle.push(ele.style);
			ele.style.border = '2px';
			ele.style.borderColor = '#ff6666';
			ele.style.borderStyle = 'solid';
		});
	}
}

// = [Click] =================================================
/**
 * Click event listener which going to get clicked element
 * @param event
 */
function getClickedDomXPath (event) {
	// get the clicked element
	let currentClickedDom = event.target;
	let exist = false;
	window.apiFrame.clickedDomList.forEach((dom, index)=>{
		if (currentClickedDom === dom) {
			exist = true;
			return false;
		}
	});
	
	if (exist) {
		// remove element if already exist in "clickedDomList"
		popClickedEle(currentClickedDom);
	} else {
		// add element if not in "clickedDomList"
		pushClickedEle(currentClickedDom);
	}
	
	// stop click event propagation which user clicked
	if (currentClickedDom.getAttribute("data-allow") === "41") {
		event.stopPropagation();
		event.preventDefault();
	}
}

/**
 * Add element from "clickedDomList"
 * @param currentClickedDom
 */
function pushClickedEle (currentClickedDom) {
	currentClickedDom.style.border = '2px';
	currentClickedDom.style.borderColor = '#ff6666';
	currentClickedDom.style.borderStyle = 'solid';
	window.apiFrame.clickedDomList.push(currentClickedDom);
	window.apiFrame.clickedXPaths.push(getXPath(currentClickedDom));
}

/**
 * Remove element from "clickedDomList"
 * @param currentClickedDom
 */
function popClickedEle (currentClickedDom) {
	let index = window.apiFrame.clickedDomList.indexOf(currentClickedDom);
	currentClickedDom.style.border = null;
	currentClickedDom.style.borderColor = null;
	currentClickedDom.style.borderStyle = null;
	window.apiFrame.clickedDomList.splice(index, 1);
	window.apiFrame.clickedXPaths.splice(index, 1);
}

// = [Mouse Over] ============================================
/**
 * Mouse over event listener
 * @param event
 */
function overDom (event) {
	let overDom = window.apiFrame.lastMouseOver;
	if (overDom.dom) {
		overDom.dom.style.backgroundColor = overDom.backgroundColor;
		overDom.dom.removeAttribute("data-allow");
	}
	overDom.dom = event.target;
	overDom.backgroundColor = overDom.dom.style.backgroundColor;
	overDom.dom.style.backgroundColor = "rgba(0, 204, 204, 0.2)";
	
	// add "data-allow" attribute value as "41" for stop
	// click event propagation
	overDom.dom.setAttribute("data-allow", "41");
}

// = [Xpath Utility] =========================================
/**
 * Get xpath of given element
 * @param node
 * @returns {string}
 */
function getXPath(node){
	
	let result = '';
	let currentNode = node;
	
	while(currentNode){
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
				for(let i = 0; i < childNum; i++){
					if(parentElement.children[i].nodeName.toLowerCase() === tagName){
						index++;
						if(parentElement.children[i] === currentNode){
							currentResult += " ["+index+"]";
							break;
						}
					}
				}
			}
		}
		
		result = currentResult + result;
		currentNode = parentElement;
	}

	return "//"+xpathRegex(result);
}

/**
 * Special regex for xpath
 * @param xpath
 * @returns {string|XML}
 */
function xpathRegex(xpath) {
	let result = xpath.replace(/tbody(?<=tbody).*(?=\/tr)/gi, '\/');
	return result.replace(/\/s /gi, '\/a ');
}

/**
 * Get element by execute xpath
 * @param xpath
 * @returns {Array}
 */
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