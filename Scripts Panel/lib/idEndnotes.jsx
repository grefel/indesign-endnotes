/*
//DESCRIPTION: Convert Footnotes to Endnotes  ( Uses the cross-reference function from InDesign )
# Acknowledgements
I derived the idea of using InDesign cross references for endnotes from Peter Kahrel. Peters solution is still a good source of inspiration and can be found here [http://www.kahrel.plus.com/indesign/footnotes.html](http://www.kahrel.plus.com/indesign/footnotes.html)

@Version: 3.3
@Date: 2017-06-14
@Author: Gregor Fellenz https://www.publishingx.de/
*/

/*
    InDesign endnote solution based on scripting and cross references. 
    Copyright (C) 2017  Gregor Fellenz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

#include config.jsx 
#include idsHelper.jsx
#include idsLog.jsx

// Debug Einstellungen publishingX 
if (app.extractLabel("px:debugID") == "Jp07qcLlW3aDHuCoNpBK_Gregor-") {
//~ 	px.debug = true;
//~ 	px.showGui = false;
	if ( ! $.global.hasOwnProperty('idsTesting') ) {
		checkAndStart(["createEndnotes"]);
//~ 		checkAndStart(["addBacklinks"]);
//~ 		checkAndStart(["jumpBetweenMarkerAndNote"]);
//~ 		checkAndStart(["deleteEndnote"]);
//~ 		checkAndStart(["deleteEndnoteHyperlinksAndBacklinks"]);
	}
}

function checkAndStart(args) {
	if (app.documents.length == 0) {
		return;
	}

	if (parseInt(app.version) < 7) {
		alert(localize(px.ui.versionWarning));
		return;
	}

	var dok = app.documents[0].getElements()[0];
	if (dok.stories.length == 0) {
		alert(localize(px.ui.noTextInDoc)); 
		return;
	}
	var mode = args[0];

	initLog();
	
	log.info("Run: " + mode);

	if (mode == "createEndnotes") {
		createEndnotes(dok);
	}
	else if (mode == "addBacklinks") {
		addBacklinks(dok);
	} 
	else if (mode == "jumpBetweenMarkerAndNote") {
		jumpBetweenMarkerAndNote(dok);
	} 
	else if (mode == "deleteEndnote") {
		deleteEndnote(dok);
	} 
	else if(mode == "deleteEndnoteHyperlinksAndBacklinks") {
		deleteEndnoteHyperlinksAndBacklinks(dok);
	}
}

// Environment checking and startup
function createEndnotes(dok) {
	var endnoteStory = getEndnoteStory(dok, true);
	if (endnoteStory  == null) {
		return;
	}

	if (dok.extractLabel(px.scriptVersionLabel) != "" || dok.extractLabel(px.pStyleEndnoteLabel) != "") {
		var dokVersion = "1";
		if (dok.extractLabel(px.scriptVersionLabel) != "") {
			dokVersion = dok.extractLabel(px.scriptVersionLabel);
		} 		
		if (dok.extractLabel(px.scriptVersionLabel) != px.scriptMajorVersion) {
			log.warnAlert(localize (px.ui.scriptVersionWarning, dokVersion));
		}
	}

	// Dokument gespeichert? 
	if ((!dok.saved || dok.modified) && !px.debug) {
		var userLevel = app.scriptPreferences.userInteractionLevel;
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL; 

		if ( confirm ( localize(px.ui.saveDocInfo) , undefined, localize(px.ui.saveDoc))) {
			try {
				dok = dok.save();
			} catch (e) { 
				if (e.number != 2) { //Vorgang vom Benutzer abgebrocehn
					log.warnAlert (localize(px.ui.saveDocFail) + e);
				}
				return;
			}		
			app.scriptPreferences.userInteractionLevel = userLevel;
		}
		else { // User does not want to save -> exit;
			app.scriptPreferences.userInteractionLevel = userLevel;
			return; 
		}
	}

	// Read Existing Style mapping from document
	getStyleInformation(dok);
	readStyles(dok);
	
	var userLevel = app.scriptPreferences.userInteractionLevel;	
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	var redraw = app.scriptPreferences.enableRedraw;
	app.scriptPreferences.enableRedraw = true; // --> progressbar

    //Ebenen entsperren und sichtbar machen
	var layerState = [];
	for (var i = 0; i < dok.layers.length; i++) {
		layerState[i] = [dok.layers[i].visible, dok.layers[i].locked];
		dok.layers[i].visible = true;
		dok.layers[i].locked = false;
	}

	if (px.debug) {		
		var result = foot2end (dok, endnoteStory);
	}
	else {
		try {			
			var result = foot2end (dok, endnoteStory);
		} catch (e) {
			log.warn(localize (px.ui.errorInfo) +  e + "\nLine: " + e.line); 
		}
	}
		    
	app.scriptPreferences.userInteractionLevel = userLevel; 
	app.scriptPreferences.enableRedraw = redraw;
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;

	if (result == 2) {
		return; // Abbruch durch Benutzer 
	} 

    // Ebenen zurücksetzen
	for (var i = 0; i < dok.layers.length; i++) {
		dok.layers[i].visible = layerState[i][0];
		dok.layers[i].locked = layerState[i][1];
	}

	var resultInfo = localize(px.ui.resultInfo, px.foot2EndCounter);
	if (px.showGui && result != 2) {
		log.showWarnings();
		log.infoAlert("Ergebnis\n" + resultInfo);
	}
	else {
		log.info(resultInfo);
		log.info(" --- ");
	}
}
// Environment checking and startup
function addBacklinks(dok) {
	var endnoteStory = getEndnoteStory(dok, false);
	if (endnoteStory == null) {
		return;
	}

	if (px.showGui) {
		if ( !confirm (localize(px.ui.addBacklinkWarning)) ) {
			return;
		}
	}	

	if (dok.extractLabel(px.scriptVersionLabel) != "" || dok.extractLabel(px.pStyleEndnoteLabel) != "") {
		var dokVersion = "1";
		if (dok.extractLabel(px.scriptVersionLabel) != "") {
			dokVersion = dok.extractLabel(px.scriptVersionLabel);
		} 		
		if (dok.extractLabel(px.scriptVersionLabel) != px.scriptMajorVersion) {
			log.warnAlert(localize (px.ui.scriptVersionWarning, dokVersion));
		}
	}

	// Dokument gespeichert? 
	if ((!dok.saved || dok.modified) && !px.debug) {
		var userLevel = app.scriptPreferences.userInteractionLevel;
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL; 

		if ( confirm ( localize(px.ui.saveDocInfo) , undefined, localize(px.ui.saveDoc))) {
			try {
				dok = dok.save();
			} catch (e) { 
				if (e.number != 2) { //Vorgang vom Benutzer abgebrocehn
					log.warnAlert (localize(px.ui.saveDocFail) + e);
				}
				return;
			}		
			app.scriptPreferences.userInteractionLevel = userLevel;
		}
		else { // User does not want to save -> exit;
			app.scriptPreferences.userInteractionLevel = userLevel;
			return; 
		}
	}

	// Read Existing Style mapping from document
	getStyleInformation(dok);
	readStyles(dok);
	
	var userLevel = app.scriptPreferences.userInteractionLevel;	
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	var redraw = app.scriptPreferences.enableRedraw;
	app.scriptPreferences.enableRedraw = true; // --> progressbar

    //Ebenen entsperren und sichtbar machen
	var layerState = [];
	for (var i = 0; i < dok.layers.length; i++) {
		layerState[i] = [dok.layers[i].visible, dok.layers[i].locked];
		dok.layers[i].visible = true;
		dok.layers[i].locked = false;
	}

	if (px.debug) {		
		var result = foot2manual (dok, endnoteStory);
	}
	else {
		try {			
			var result = foot2manual (dok, endnoteStory);
		} catch (e) {
			log.warn(localize (px.ui.errorInfo) +  e + "\nLine: " + e.line); 
		}
	}
		
    // Ebenen zurücksetzen
	for (var i = 0; i < dok.layers.length; i++) {
		dok.layers[i].visible = layerState[i][0];
		dok.layers[i].locked = layerState[i][1];
	}

	var newFile = File (dok.fullName.parent + "/" + dok.name.replace(/\.indd/, "") + "_MANUELL_NUMMERIERT.indd");
	try {
		dok.save (newFile);
	}
	catch (e) {
		log.warn(e);
	}
	    
	app.scriptPreferences.userInteractionLevel = userLevel; 
	app.scriptPreferences.enableRedraw = redraw;
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;

	var resultInfo = localize(px.ui.resultInfoConvert, px.foot2EndCounter);
	if (px.showGui && result != 2) {
		log.showWarnings();
		log.infoAlert("Ergebnis\n" + resultInfo);
	}
	else {
		log.info(resultInfo);
		log.info(" --- ");
	}
}



// jumpBetweenMarkerAndNote
function jumpBetweenMarkerAndNote(dok) {
	if (app.selection.length == 0) {
		return false;
	}
	if (!app.selection[0].hasOwnProperty ("baseline")) {
		alert(localize (px.ui.noEndnoteOrMarker));
		return false;
	}
	if (!app.selection[0].paragraphs[0].isValid) {
		alert(localize (px.ui.noEndnoteOrMarker));
		return false;
	}

	fixHyperlinks(dok);
	
	var selectionText = app.selection[0];
	var index = app.selection[0].index;
	var parIndex = app.selection[0].paragraphs[0].index
	for (var i = 0; i  < dok.hyperlinks.length; i++) {
		if (dok.hyperlinks[i].extractLabel(px.hyperlinkLabel) == "true") {
			var hLink = dok.hyperlinks[i];
//~ 			$.writeln(hLink.source.sourceText.index + " - " +  hLink.destination.destinationText.index);
			if (hLink.source.sourceText.index == index && hLink.destination == null) {
				log.warnAlert(localize(px.ui.missingHyperlinkDestination, hLink.id));
				return false;
			}

			if (hLink.source.sourceText.index == index) {
				hLink.showDestination();				
				return true;
			}
			if (hLink.destination && hLink.destination.destinationText.paragraphs[0].index == parIndex) {
				hLink.showSource();
				return true;
			} 
		}
	}
	alert(localize (px.ui.noEndnoteOrMarker));
}

function deleteEndnoteHyperlinksAndBacklinks(dok) {
	if (px.showGui) {
		if ( !confirm (localize(px.ui.deleteAllWarning)) ) {
			return;
		}
	}	
	// Dokument gespeichert? 
	if ((!dok.saved || dok.modified) && !px.debug) {
		var userLevel = app.scriptPreferences.userInteractionLevel;
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL; 

		if ( confirm ( localize(px.ui.saveDocInfo) , undefined, localize(px.ui.saveDoc))) {
			try {
				dok = dok.save();
			} catch (e) { 
				if (e.number != 2) { //Vorgang vom Benutzer abgebrocehn
					log.warnAlert (localize(px.ui.saveDocFail) + e);
				}
				return;
			}		
			app.scriptPreferences.userInteractionLevel = userLevel;
		}
		else { // User does not want to save -> exit;
			app.scriptPreferences.userInteractionLevel = userLevel;
			return; 
		}
	}		
	
	var layerState = [];
	for (var i = 0; i < dok.layers.length; i++) {
		layerState[i] = [dok.layers[i].visible, dok.layers[i].locked];
		dok.layers[i].visible = true;
		dok.layers[i].locked = false;
	}


	for (var i = dok.hyperlinks.length-1; i >= 0; i--) {
		deleteMe(dok.hyperlinks[i]);
	} 

	for (var i = dok.paragraphDestinations.length-1; i >= 0; i--) {
		deleteMe(dok.paragraphDestinations[i]);
	} 

	for (var i = dok.crossReferenceSources.length-1; i >= 0; i--) {
		deleteMe(dok.crossReferenceSources[i]);
	} 
	
	for (var i = dok.hyperlinkTextDestinations.length-1; i >= 0; i--) {
		deleteMe(dok.hyperlinkTextDestinations[i]);
	} 

	for (var i = dok.hyperlinkTextSources.length-1; i >= 0; i--) {
		deleteMe(dok.hyperlinkTextSources[i]);
	} 	
}

// 
function deleteEndnote(dok) {
    //Ebenen entsperren und sichtbar machen
	var layerState = [];
	for (var i = 0; i < dok.layers.length; i++) {
		layerState[i] = [dok.layers[i].visible, dok.layers[i].locked];
		dok.layers[i].visible = true;
		dok.layers[i].locked = false;
	}

	if (dok.extractLabel(px.pStyleEndnoteFollowLabel) != "") {
		px.pStyleEndnoteFollowName = dok.extractLabel(px.pStyleEndnoteFollowLabel);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingLabel) != "") {
		px.pStyleEndnoteSplitHeadingName = dok.extractLabel(px.pStyleEndnoteSplitHeadingLabel);
	}

	// Read all Styles  
	for (var i = 0; i < dok.allParagraphStyles.length; i++) {
		var style = dok.allParagraphStyles[i];
		if (style.name == px.pStyleEndnoteFollowName)  {
			px.pStyleEndnoteFollow = style;			
		}
		if (style.name == px.pStyleEndnoteSplitHeadingName) {
			px.pStyleEndnoteSplitHeading = style;			
		}
	}

	
	if (!removeEndnote()) {
		log.warn(localize(px.ui.noEndnoteOrMarker));
		log.showWarnings();
	}	

    // Ebenen zurücksetzen
	for (var i = 0; i < dok.layers.length; i++) {
		dok.layers[i].visible = layerState[i][0];
		dok.layers[i].locked = layerState[i][1];
	}
}



function deleteMe(object) {
	if ( object.extractLabel(px.hyperlinkLabel) == "true" || object.extractLabel(px.hyperlinkLabel) == "backlink" ||
		object.name.indexOf("EndnoteBacklink_") == 0 		// Legacy Skript
	) {
//~ 		$.writeln(object.constructor.name);
		object.remove();
	}
}



function removeEndnote() {
	if (app.selection.length == 0) {
		return false;
	}
	if (!app.selection[0].hasOwnProperty ("baseline")) {
		return false;
	}
	if (!app.selection[0].paragraphs[0].isValid) {
		return false;
	}
	var dok = app.documents[0];
	var selectionText = app.selection[0];
	var index = app.selection[0].index;
	var parIndex = app.selection[0].paragraphs[0].index
	for (var i = 0; i  < dok.hyperlinks.length; i++) {
		if (dok.hyperlinks[i].extractLabel(px.hyperlinkLabel) == "true") {
			var hLink = dok.hyperlinks[i];
			
			if (hLink.destination == null) {
				log.warn(localize (px.ui.hyperlinkProblemDestination, hLink.name, hLink.source.sourceText.contents, idsTools.getPageNameByObject(hLink.source.sourceText)));
				continue;
			}				
			
			if (hLink.source.sourceText.index == index) {
				removeHL(hLink);
				return true;
			}
		
			if (hLink.destination.destinationText.paragraphs[0].index == parIndex) {
				removeHL(hLink);
				return true;
			} 
		}
	}
	return false;
}

function removeHL(hLink) {
	var hLinkPar = hLink.destination.destinationText.paragraphs[0];
	var story = hLinkPar.parentStory;
	if (confirm (localize(px.ui.confirmEndnoteDelete,  hLinkPar.bulletsAndNumberingResultText.replace(/\./, ''), hLinkPar.contents.replace(/^\t+/,'') ) ) ) {
		hLink.source.sourceText.contents = "";
		while (hLinkPar.insertionPoints[-1].isValid && story.insertionPoints[hLinkPar.insertionPoints[-1].index].paragraphs[0].isValid && story.insertionPoints[hLinkPar.insertionPoints[-1].index].paragraphs[0].appliedParagraphStyle.id == px.pStyleEndnoteFollow.id) {
			story.insertionPoints[hLinkPar.insertionPoints[-1].index].paragraphs[0].contents = "";
		}
		if  (hLinkPar.insertionPoints[-1].isValid && story.insertionPoints[hLinkPar.insertionPoints[-1].index].paragraphs[0].isValid) {
			story.insertionPoints[hLinkPar.insertionPoints[-1].index].paragraphs[0].numberingStartAt = hLinkPar.numberingStartAt;
			story.insertionPoints[hLinkPar.insertionPoints[-1].index].paragraphs[0].numberingContinue  = hLinkPar.numberingContinue;
		}
		hLinkPar.contents = "";		
	}
	app.documents[0].crossReferenceSources.everyItem().update();
}


function foot2manual (dok, endnoteStory) {
	log.info("Run footnote to manual numbering conversion with version " + px.version);
	// Styles einsammeln 
	for (var i = 0; i < dok.allParagraphStyles.length; i++) {
		var style = dok.allParagraphStyles[i];
		if (style.name == px.pStyleEndnoteName)  {
			px.pStyleEndnote = style;			
		}
		if (style.name == px.pStyleEndnoteFollowName)  {
			px.pStyleEndnoteFollow = style;
		}
		if (style.name == px.pStyleEndnoteSplitHeadingName) {
			px.pStyleEndnoteSplitHeading = style;			
		}				
		if (style.name == px.pStyleEndnoteSplitHeadingPrecedingName) {
			px.pStyleEndnoteSplitHeadingPreceding = style;			
		}				
		if (style.name == px.pStyleEndnoteSplitHeadingFollowingName) {
			px.pStyleEndnoteSplitHeadingFollowing = style;			
		}	
		if (style.name == px.pStyleFootnoteIgnoreName) {
			px.pStyleFootnoteIgnore = style;			
		}
		if (style.name == px.pStyleEndnoteSplitHeadingPrecedingRepeatName) {
			px.pStyleEndnoteSplitHeadingPrecedingRepeat = style;			
		}				
		if (style.name == px.pStyleEndnoteSplitHeadingFollowingRepeatName) {
			px.pStyleEndnoteSplitHeadingFollowingRepeat = style;
		}	
		if (style.name == px.pStyleEndnoteHeadingName) {
			px.pStyleEndnoteHeading = style;			
		}
	}
	for (var i = 0; i < dok.allCharacterStyles.length; i++) {
		var style = dok.allCharacterStyles[i];
		if (style.name == px.cStyleEndnoteMarkerName)  {
			px.cStyleEndnoteMarker = style;			
		}
	}
	
	
	// Find empty Endnote Paragraphs, 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.findGrepPreferences.findWhat = "(?-m)(?<=\\r)[~m~>~f~|~S~s~<~/~.~3~4~% \\n]*\\r";
	var emptyEndnotes = endnoteStory.findGrep();
	if (emptyEndnotes.length > 0) {
		log.warn(localize(px.ui.emptyEndnotePar, emptyEndnotes.length, px.pStyleEndnote.name));
		for (var e = 0; e < emptyEndnotes.length; e++) {
			log.warn(localize(px.ui.emptyEndnoteParContent) + emptyEndnotes[e].parentStory.insertionPoints[emptyEndnotes[e].index-1].paragraphs[0].contents  );
		}
		idsTools.showIt(emptyEndnotes[0]);
		return;
	}

	var hLinksPerStory = getCurrentEndnotes(dok, endnoteStory);
	if (!hLinksPerStory) {
		return;
	}


	fixHyperlinks(dok); // Fix broken Links before processing

	checkStyles(dok);

	var endnoteBlock = getEndnoteBlock(endnoteStory, dok, hLinksPerStory);
	endnoteBlock.convertBulletsAndNumberingToText ();
	
	// Backlinks löschen 
	for (var i = dok.hyperlinks.length -1; i >= 0; i--) {
		hlink = dok.hyperlinks[i];
		if (hlink.extractLabel(px.hyperlinkLabel) == "backlink" ) {
			hlink.remove();
		}
	}

	for (var i = dok.hyperlinkTextDestinations.length -1; i >= 0; i--) {
		hlink = dok.hyperlinkTextDestinations[i];
		if (hlink.extractLabel(px.hyperlinkLabel) == "backlink" ) {
			hlink.remove();
		}
	}
	for (var i = dok.hyperlinkTextSources.length -1; i >= 0; i--) {
		hlink = dok.hyperlinkTextSources[i];
		if (hlink.extractLabel(px.hyperlinkLabel) == "backlink" ) {
			hlink.remove();
		}
	}

	app.findGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.findGrepPreferences.findWhat = "^.+?(\\t| )";

//~ 	var hLinksPerStory = getCurrentEndnotes(dok, endnoteStory);

	var createList = [];
	for (var i = 1; i < hLinksPerStory.length - 1; i++) {
		var hlink =  dok.hyperlinks.itemByID(hLinksPerStory[i].hLinkID);
		if (! hlink.destination instanceof ParagraphDestination ) {
			log.warn(localize (px.ui.couldNotCreateBacklink, hlink.name) ); 
			continue;
		}
		var hlinkPar = hlink.destination.destinationText.paragraphs[0].getElements()[0];
		var numberingText = hlinkPar.findGrep()[0];
		if (numberingText) {
			var sourceText = hlink.source.sourceText;
			var startPos = 1;
			var endPos = 1;
			if (sourceText.parentStory.id != hlink.destination.destinationText.parentStory.id || sourceText.parent instanceof Cell) {
				// Weil der hinzugefügte Anker in der gleichen Story noch einen Index weiterschiebt. In Tabelle aber verankerten Textrahmen nicht.
				startPos = 0;
				endPos = 2;
			} 
			numberingText = numberingText.characters.itemByRange(startPos,numberingText.characters.length-endPos);
			
			var endnote_backlink = dok.hyperlinkTextDestinations.add (sourceText.insertionPoints[0]);
			endnote_backlink.insertLabel(px.hyperlinkLabel, "backlink");			
			
//~ 			$.writeln(numberingText.contents);
//~ 			$.bp(numberingText.contents = ".	")
			
			hyperlinkTextSource = dok.hyperlinkTextSources.add(numberingText);			
			hyperlinkTextSource.insertLabel(px.hyperlinkLabel, "backlink");
			var sourceIndex =  getIndexInStory(sourceText);
			createList.push({
				hyperlinkTextSource:hyperlinkTextSource, 
				endnoteBacklink:endnote_backlink,
				sourceIndexArray:sourceIndex
				});
		}
		else  {
			log.warn(localize (px.ui.couldNotCreateBacklink, hlink.name) ); 
		}
	}
	
	for (var x = 0; x < createList.length; x++) {
		var hlink = dok.hyperlinks.add (createList[x].hyperlinkTextSource, createList[x].endnoteBacklink, {visible: false});
		hlink.name = "EndnoteBacklink_" + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + new Date().getTime();
		hlink.insertLabel(px.hyperlinkLabel, "backlink");
		px.foot2EndCounter++;
	}




}
/* Returns a valid endnote story for processing or null*/
function getEndnoteStory(dok, checkForFootnotes) {
	// Check for valid stories
	var story;
	var endnoteStory = null;
	var footnoteStories = [];
	var footnoteStoryCounter = 0;
	var endnoteStoryMap = idsMap();
	var endnoteRealStoryMap = idsMap();
	var hlinkStoryMap = idsMap();
	for (var k = 0; k < dok.hyperlinks.length; k++) {
		var hlink = dok.hyperlinks[k];
		try {
			if ( hlink.destination && 
				 (	hlink.extractLabel(px.hyperlinkLabel) == "true" || 
					   hlink.destination.extractLabel(px.hyperlinkLabel) == "true"	) &&
				 hlink.destination.destinationText.parentStory.isValid ) {
					 
				var destinationStory = getParentStory(hlink.destination.destinationText);
				hlinkStoryMap.pushItem(destinationStory.id, "true");
				// sourceText ist immer valid, weil sonst der Hyperlink gelöscht wäre.
				var sourceText = hlink.source.sourceText;
				endnoteRealStoryMap.pushItem(sourceText.parentStory.id, "true");
				if (sourceText.parent instanceof Cell) {
					endnoteRealStoryMap.pushItem("t" + sourceText.parent.parent.id, "true");
				}
				var sourceStory =  getParentStory(hlink.source.sourceText); 
				hlinkStoryMap.pushItem(sourceStory.id, "true");
			}
		} 
		catch (e) {
			log.info("Broken Hyperlink ignored!");
			log.info(e);
		}
	}
	
	for (var i = 0; i < dok.stories.length; i++) {
		story = dok.stories[i];
		if (story.footnotes.length > 0 ) {
			var relevantStory = getParentStory(story);			
			if (footnoteStories.length > 0 && footnoteStories[0].id != relevantStory.id ) {
				footnoteStories.push(relevantStory);				
			}
			else if (footnoteStories.length == 0) {
				footnoteStoryCounter++;
				footnoteStories[0] = relevantStory;
			}
			else if (relevantStory.id != story.id) {
				footnoteStoryCounter++ 
			}
		}
		if ( hlinkStoryMap.getItem(story.id) == "true") {
			endnoteStory = story;
			endnoteStoryMap.pushItem(story.id, story);
		}
	}

	// Die einfachen Fälle 
	if (checkForFootnotes && footnoteStories.length == 0) {
		log.warnAlert(localize(px.ui.noFootnoteInDoc)); 
		return null;
	}
	if (endnoteStoryMap.length > 1) {
		log.warnAlert(localize(px.ui.multipleEndnoteLinks)); 
		return null;
	}
	if (footnoteStories.length == 1 && endnoteStoryMap.length == 0) { // New doc
		endnoteStory = footnoteStories[0];
	}
	else if (footnoteStories.length == 1 && endnoteStoryMap.length == 1 && endnoteStoryMap.hasItem(footnoteStories[0].id)) { // Update Doc
		endnoteStory = footnoteStories[0];
	}

	if (footnoteStories.length == 1 && endnoteStoryMap.length == 1 && !endnoteStoryMap.hasItem(footnoteStories[0].id)) { 
		log.warnAlert(localize(px.ui.endnoteAndFootnotesAreNotInTheSameStory)); 
		return null;
	}
	
	// Auswahl der gültigen Story durch user 
	if (footnoteStories.length > 1) {		
		if (checkSelection() ) {
			var selectionID = app.selection[0].parentStory.id;
			for (var i = 0; i < footnoteStories.length; i++) {
				if (selectionID == footnoteStories[i].id) {
					log.infoAlert (localize(px.ui.willProcessCurrentSelection));
					endnoteStory = footnoteStories[i];
					break;
				}
			}
			if (endnoteStoryMap.length > 0 && !endnoteStoryMap.hasItem(footnoteStories[0].id) ) {
				alert(localize(px.ui.endnoteAndFootnotesAreNotInTheSameStory)); 
				return null;
			}
		}
		else {
			alert (localize(px.ui.createSelection));
			return null;
		}
	}
	
	if (!checkForFootnotes && endnoteStoryMap.length != 1) {
		alert(localize(px.ui.unknownSelectionError)); 
		return null;		
	}

	if (endnoteStory == null) {
		// Darf eigentlich nicht passieren 
		alert(localize(px.ui.unknownSelectionError)); 
		return null;
	}
	
	px.multipleStories =  (footnoteStoryCounter > 1 || endnoteRealStoryMap.length > 1);
		
	return endnoteStory;
} 
function getFootnotes(dok, endnoteStory) {
	var footnotes = [];
	for (var i = 0; i < dok.stories.length; i++) {
		var story = dok.stories[i];
		var relevantStory = getParentStory(story);			
		if (relevantStory.id == endnoteStory.id ) {
			footnoteLoop : for (var f  = story.footnotes.length-1; f >= 0; f--) {
				var footnote = story.footnotes[f];
//~ 				log.writeln(footnote.contents);
				if (px.footnoteIgnore && px.footnoteIgnore) {
					for (var ff = 0; ff < footnote.paragraphs.length; ff++) {
						if (footnote.paragraphs[ff].appliedParagraphStyle.id == px.pStyleFootnoteIgnore.id ) {
							log.info("Footnote " + getShortText(footnote)  + " ignored by PargraphStyle ");
							story.characters[footnote.storyOffset.index].applyConditions ([px.footNoteIgnoreCondition]);
							continue footnoteLoop;
						}
					}						
				} 			
				var storyOffset = footnote.storyOffset;
				footnotes.push({fn:footnote.getElements()[0],
										sourceIndexArray:getIndexInStory(storyOffset),
										storyOffset:storyOffset,
										contents:footnote.contents
										});
			}
		}
	}
	return footnotes;
}

// Main Script 
function foot2end (dok, endnoteStory) {
	if (px.showGui) {
		var result = getConfig();
		if ( result == 2) {
			return 2;
		}
		else if (result == 3) {
			saveSettings(dok);
			return 2;
		}
		else {
			saveSettings(dok);
		}
	}
	else {
		// Nur DEBUG 
		for (var i = 0; i < dok.allParagraphStyles.length; i++) {
			var style = dok.allParagraphStyles[i];
			if (style.name == px.pStyleEndnoteName)  {
				px.pStyleEndnote = style;			
			}
			if (style.name == px.pStyleEndnoteFollowName)  {
				px.pStyleEndnoteFollow = style;
			}
			if (style.name == px.pStyleEndnoteSplitHeadingName) {
				px.pStyleEndnoteSplitHeading = style;			
			}				
			if (style.name == px.pStyleEndnoteSplitHeadingPrecedingName) {
				px.pStyleEndnoteSplitHeadingPreceding = style;			
			}				
			if (style.name == px.pStyleEndnoteSplitHeadingFollowingName) {
				px.pStyleEndnoteSplitHeadingFollowing = style;			
			}	
			if (style.name == px.pStyleFootnoteIgnoreName) {
				px.pStyleFootnoteIgnore = style;			
			}
			if (style.name == px.pStyleEndnoteSplitHeadingPrecedingRepeatName) {
				px.pStyleEndnoteSplitHeadingPrecedingRepeat = style;			
			}				
			if (style.name == px.pStyleEndnoteSplitHeadingFollowingRepeatName) {
				px.pStyleEndnoteSplitHeadingFollowingRepeat = style;
			}	
			if (style.name == px.pStyleEndnoteHeadingName) {
				px.pStyleEndnoteHeading = style;			
			}
		}
		for (var i = 0; i < dok.allCharacterStyles.length; i++) {
			var style = dok.allCharacterStyles[i];
			if (style.name == px.cStyleEndnoteMarkerName)  {
				px.cStyleEndnoteMarker = style;			
			}
		}
	}
	log.info("Run footnote to endnote conversion with version " + px.version);
	
	// Find empty Endnote Paragraphs, 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.findGrepPreferences.findWhat = "(?-m)(?<=\\r)[~m~>~f~|~S~s~<~/~.~3~4~% \\n]*\\r";
	var emptyEndnotes = endnoteStory.findGrep();
	if (emptyEndnotes.length > 0) {
		log.warn(localize(px.ui.emptyEndnotePar, emptyEndnotes.length, px.pStyleEndnote.name));
		for (var e = 0; e < emptyEndnotes.length; e++) {
			log.warn(localize(px.ui.emptyEndnoteParContent) + emptyEndnotes[e].parentStory.insertionPoints[emptyEndnotes[e].index-1].paragraphs[0].contents  );
		}
		idsTools.showIt(emptyEndnotes[0]);
		log.showWarnings();
		return 2;
	}

	// Sicherheitskopie anlegen? 
	if (px.createBackupCopy && !px.debug) {
		var date = new Date();
		var day = idsTools.pad(date.getDate(), 2);
		var month = idsTools.pad(date.getMonth() + 1, 2);
		var year = date.getYear() + 1900;
		
		var backupFile = File( dok.fullName.toString().replace(/.indd$/, "") + "__" + year + month + day + "_" + date.getTime() + "_" + px.backupCopySuffix);
		dok.saveACopy(backupFile);
	}

	fixHyperlinks(dok); // Fix broken Links before processing

	checkStyles(dok);

	var hLinksPerStory = getCurrentEndnotes(dok, endnoteStory);
	if (!hLinksPerStory) {
		log.showWarnings();
		return 2;
	}

	var continueAnyway = log.confirmWarnings();
	if (continueAnyway == 2) {
		dok.revert();
		return 2;
	}

	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.findGrepPreferences.findWhat = "\\s\\Z";
	endnoteStory.changeGrep();

	// Fußnoten zu Endnoten konvertieren 
	var firstHlink, firstHlinkIndex, headingParagraph, footnote, endnote, endnote_link, cue, hlink, nextHlink,  hyperLinkID;	
	var oldPages = dok.pages.length;

	// EndnotenTitel einfügen  // Das könnte man auch ganz am Ende machen, Wäre vielleicht sinnvoller. Dann müsste man sich "nur" mit dem Endnotenblock herumschlagen und man könnt sich das erneute Einlesen der Endnoten nach dem Konvertieren sparen.	
	hyperLinkID =  hLinksPerStory[1].hLinkID;
	px.newEndnoteBlock = hyperLinkID == "last";
	if (px.newEndnoteBlock) { // --> There is no Endnote Hyperlink in the story.
		log.info("Create new endnote block");
		endnoteStory.insertionPoints[-1].contents = "\r" + px.endnoteHeadingString;
		endnoteStory.insertionPoints[-1].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteHeading;
	}
	else {
		log.info("Update exisiting endnote block");
		firstHlink = dok.hyperlinks.itemByID(hyperLinkID);
		firstHlinkIndex = firstHlink.destination.destinationText.paragraphs[0].insertionPoints[0].index;
//~ 		if (firstHlink.destination.destinationText.parentStory.id != endnoteStory.id) {
//~ 			log.warn( localize(px.ui.endnoteStoryMoved) );
//~ 			return;
//~ 		}
		firstEndnote = endnoteStory.insertionPoints[firstHlinkIndex].paragraphs[0];
		headingParagraph = endnoteStory.insertionPoints[firstHlinkIndex-1].paragraphs[0];
		if (px.numberBySection) {
			var checkPar = endnoteStory.insertionPoints[firstHlinkIndex-1].paragraphs[0];
			var checkPreviousParagraph = 0;
			while (checkPreviousParagraph < 4) {
				checkPar = endnoteStory.insertionPoints[checkPar.insertionPoints[0].index-1].paragraphs[0];
				if (checkPar.appliedParagraphStyle.id == px.pStyleEndnoteHeading.id) {
					headingParagraph = checkPar;
				}
				checkPreviousParagraph++;				
			}			
		}
		if (headingParagraph.contents != px.endnoteHeadingString + "\r") {
			log.warn (localize (px.ui.headingStyleFail , px.endnoteHeadingString, headingParagraph.contents.replace(/\r/g,'') ));
			
			app.findGrepPreferences = NothingEnum.NOTHING;
			app.changeGrepPreferences = NothingEnum.NOTHING;
			app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnoteHeading;
			var result = endnoteStory.changeGrep();
			if (result.length > 0) {
				log.warn(localize (px.ui.headingStyleFailInfo, result.length));
			}
			var headingIndex = headingParagraph.index;
			headingParagraph.insertionPoints[0].contents = px.endnoteHeadingString + "\r";
			headingParagraph = endnoteStory.characters[headingIndex].paragraphs[0];				
			firstEndnote = headingParagraph.insertionPoints[-1].paragraphs[0];
			hLinksPerStory = getCurrentEndnotes(dok, endnoteStory);
		}
	
		headingParagraph.appliedParagraphStyle = px.pStyleEndnoteHeading;
		firstEndnote.appliedParagraphStyle = px.pStyleEndnote;
	}

	// Fußnoten konvertieren 
	if (px.footnoteIgnore) {
		px.footNoteIgnoreCondition = dok.conditions.add();
		px.footNoteIgnoreCondition.visible = false;
	}
	var footn = getFootnotes(dok, endnoteStory);
	// Fußnoten sind jetzt rückwärts sortiert
	footn.sort(sortSourceIndexArray);
	
	if (px.showGui) {
		var pBar = idsTools.getProgressBar(localize(px.ui.menuTitle, px.version));
		pBar.reset("Verarbeite Endnoten", footn.length);
	}

	endnoteStory.insertionPoints[-1].contents = "\r";
//~ 	einfuegeIndex = endnoteStory.insertionPoints[-1].index;
	idsTools.checkOverflow(endnoteStory);
	
	footnoteLoop : for (var i = footn.length-1; i >= 0; i--) {
		if (px.showGui) {
			pBar.hit();
		}
	
		footnote = footn[i].fn;						
		
//~ 		$.writeln("i"  + i + " -> " + footnote.contents);
		
		trimFootnoteSpace(footnote);
		if (footnote.contents.replace(//, '').replace(/\s/g, '') == "") {
			log.warn(localize(px.ui.emptyFootnote));
			continue;
		}
			
		// Formatieren 				
		footnote.paragraphs[0].applyParagraphStyle (px.pStyleEndnote, false);
		if(footnote.paragraphs.length > 1) {
			footnote.paragraphs.itemByRange(1,footnote.paragraphs.length-1).applyParagraphStyle (px.pStyleEndnoteFollow, false);
		}				
				
		hyperLinkID = getPosition(footn[i].sourceIndexArray, hLinksPerStory); // Find the next existing Hyperlink in the story
		if (hyperLinkID == null) {
			// Fehler bei getPosition();
			return;
		}
		if (hyperLinkID == "first") {
			log.warn( localize(px.ui.statusFail) ); 
			continue;
		}
		else if (hyperLinkID == "last") {
			var endnoteBlock = getEndnoteBlock(endnoteStory, dok, hLinksPerStory);
//~ 			endnote = footnote.texts[0].move (LocationOptions.after, endnoteStory.insertionPoints[einfuegeIndex]);
			endnote = footnote.texts[0].move (LocationOptions.after, endnoteBlock.insertionPoints[-1]);
		}
		else {
			// Vor dem Hyperlink mit der ID muss die Endnote eingefügt werden:
			nextHlink = dok.hyperlinks.itemByID(hyperLinkID);					
			endnote = footnote.texts[0].move (LocationOptions.BEFORE, nextHlink.destination.destinationText.paragraphs[0].insertionPoints[0]);
		}
	
		// Verlinkung herstellen 
		endnote_link = dok.paragraphDestinations.add (endnote.insertionPoints[0]);
		endnote_link.insertLabel(px.hyperlinkLabel, "true");
		cue = dok.crossReferenceSources.add (footn[i].storyOffset, px.crossRefStyleEndnote);
//~ 		einfuegeIndex++;
		cue.insertLabel(px.hyperlinkLabel, "true");
		hlink = dok.hyperlinks.add (cue, endnote_link, {visible: false});
		hlink.insertLabel(px.hyperlinkLabel, "true");

		pushHLink ( hLinksPerStory, hyperLinkID, hlink);		
				
		px.foot2EndCounter++;
	} // footnoteLoop : for

	
	

	idsTools.checkOverflow(endnoteStory);

	hLinksPerStory = getCurrentEndnotes(dok, endnoteStory);
	if (!hLinksPerStory) {
		return;
	}
	var endnoteBlock = getEndnoteBlock(endnoteStory, dok, hLinksPerStory);
	// Endnoten Nummerierung  zurücksetzen... 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.changeGrepPreferences.numberingContinue = true;
	var result = endnoteBlock.changeGrep();
	if (result) {
		result[0].paragraphs[0].numberingStartAt = 1;
		result[0].paragraphs[0].numberingContinue = false;
	}
	
	// Wenn wir nach Section splitten müssen, werden jetzt die Positionen der Sections ausgewertet die ggf. zugeordnet werden müssen
	// Problem zweiter Durchlauf, hier muss geprüft werden ob die neue eingefügte Endnote bereits die richtige Überschrift hat.
	if (px.numberBySection) {		
		// Alte Abschnittsüberschriften löschen...
		app.findGrepPreferences = NothingEnum.NOTHING;
		app.changeGrepPreferences = NothingEnum.NOTHING;
		app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnoteSplitHeading;
		endnoteBlock.changeGrep();
		if (px.pStyleEndnoteSplitHeadingPrecedingCopy) {
			app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnoteSplitHeadingPrecedingRepeat;
			endnoteBlock.changeGrep();
		}		
		if (px.pStyleEndnoteSplitHeadingFollowingCopy) {
			app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnoteSplitHeadingFollowingRepeat;
			endnoteBlock.changeGrep();
		}
			
		var sectionIndexArray = getSections(endnoteStory);	
		if (px.newEndnoteBlock) {
			var endnotenStartEndPositions = hLinksPerStory;
		}
		else {
			// Im Update Modus müssen die Endnoten neu eingelesen werden, weil die IndexWerte in hLinksPerStory verschoben sind. Im Idealfall (Performance) würde man nur die Indexwerte in hLinksPerStory updaten
			var endnotenStartEndPositions = getCurrentEndnotes(dok, endnoteStory);
		}
		
		// In length -1 steckt nur der leere String für den letzten Insertion Point der Story
		var sectionCounter = sectionIndexArray.length-2;
		
		var currentSection, nextSection, endnotenIndex, endnotenTextIndex;

		
		for (var i =  endnotenStartEndPositions.length-2; i >= 0; i--) {
			// Endnoten
			endnotenTextIndex = endnotenStartEndPositions[i].sourceIndexArray[0];
			endnotenIndex = endnotenStartEndPositions[i].destinationIndexArray[0];
			if (i > 0) {
				previousEndnotenTextIndex = endnotenStartEndPositions[i-1].sourceIndexArray[0];
			}
			else {
				previousEndnotenTextIndex = -1;
			}
			
			if (i ==  endnotenStartEndPositions.length-2) {
				nextEndnotenIndex = endnotenIndex;
			}
			else {
				nextEndnotenIndex = endnotenStartEndPositions[i+1].destinationIndexArray[0];
			}
			
			// Abschnitte 
			if (sectionCounter < 0) {
				// Problems with Sections 
				log.warn(localize(px.ui.sectionBroken));
				sectionCounter = 0;
//~ 				$.bp();
			}

			currentSection = sectionIndexArray[sectionCounter];
			currentSectionStartIndex = currentSection[1];
			nextSection = sectionIndexArray[sectionCounter+1];
			nextSectionStartIndex = nextSection[1];
			
			if (currentSection == undefined) {
				log.warn(localize(px.ui.sectionIsEmpty));
			}
			else if (
				previousEndnotenTextIndex < currentSectionStartIndex 
				&& endnotenTextIndex > currentSectionStartIndex 
				&& endnotenTextIndex < nextSectionStartIndex) {
				if (currentSection[2] == "") {
					currentSection[2] = "\r";
				}
			
				if (px.pStyleEndnoteSplitHeadingFollowingCopy && currentSection[4] != "") {
					endnoteStory.insertionPoints[endnotenIndex].contents = currentSection[4];
					endnoteStory.insertionPoints[endnotenIndex].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteSplitHeadingFollowingRepeat;
				}
			
//~ 				$.bp(currentSection[2].indexOf("Chapter 2") > -1);
				endnoteStory.insertionPoints[endnotenIndex].contents = currentSection[2];				
				endnoteStory.insertionPoints[endnotenIndex].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteSplitHeading;

				var nextPar = idsTools.nextParagraph (endnoteStory.insertionPoints[endnotenIndex].paragraphs[0]);
				if (px.pStyleEndnoteSplitHeadingFollowingCopy && currentSection[4] != "") {
					var nextPar = idsTools.nextParagraph (nextPar);
				}
				if (nextPar != null) {
					nextPar.numberingStartAt = 1;
					nextPar.numberingContinue = false;
				}
				else {
					log.warn(localize(px.ui.numberingFail));
				}

				if (px.pStyleEndnoteSplitHeadingPrecedingCopy && currentSection[3] != "") {
					endnoteStory.insertionPoints[endnotenIndex].contents = currentSection[3];
					endnoteStory.insertionPoints[endnotenIndex].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteSplitHeadingPrecedingRepeat;
				}
			

				sectionCounter--;
			}
			else if (endnotenTextIndex < currentSectionStartIndex && sectionCounter > 0) {
				i++; // endnote zurücksetzen, weil wir gucken müssen ob sie in der nächsten Section steht.
				sectionCounter--;						
			}
		}
	}


	deleteNotemarkers (dok, endnoteStory);
	endnoteStory.characters[-1].contents = "";
	
	recreateIgnoredFootnotes(dok, endnoteStory);
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.findGrepPreferences.findWhat = "^\\t";
	endnoteBlock.changeGrep();
	
	// Force Footnote Numbering Reset (CC 2017 Problem )
	var oldRestartNumbering = dok.footnoteOptions.restartNumbering;
	dok.footnoteOptions.restartNumbering = FootnoteRestarting.PAGE_RESTART;
	dok.footnoteOptions.restartNumbering = FootnoteRestarting.SPREAD_RESTART;
	dok.footnoteOptions.restartNumbering = oldRestartNumbering;
	
	// Seiten auflösen 
	idsTools.checkOverflow(endnoteStory);
	for (var c = 0; c < dok.hyperlinks.length; c++) {
		var hlink = dok.hyperlinks[c];
		if (hlink.extractLabel(px.hyperlinkLabel)  == "true" && hlink.source ) {
			hlink.source.update();
		}
	}

	if (px.showGui) {
		var newPages = dok.pages.length - oldPages ;
		if (dok.pages.length != oldPages ) {
			log.warn (localize (px.ui.newPagesAdded, newPages));
		}
		pBar.close();
	}

	return 0;
}


function saveSettings(dok) {
	// Save Style and Heading in current document 
	dok.insertLabel(px.pStyleEndnoteLabel, px.pStyleEndnoteName);
	dok.insertLabel(px.pStyleEndnoteFollowLabel, px.pStyleEndnoteFollowName);
	dok.insertLabel(px.pStyleEndnoteHeadingLabel, px.pStyleEndnoteHeadingName);
	dok.insertLabel(px.pStyleEndnoteSplitHeadingLabel, px.pStyleEndnoteSplitHeadingName);
	dok.insertLabel(px.pStyleEndnoteSplitHeadingPrecedingLabel, px.pStyleEndnoteSplitHeadingPrecedingName);
	dok.insertLabel(px.pStyleEndnoteSplitHeadingFollowingLabel, px.pStyleEndnoteSplitHeadingFollowingName);	
	dok.insertLabel(px.pStyleEndnoteSplitHeadingPrecedingRepeatLabel, px.pStyleEndnoteSplitHeadingPrecedingRepeatName);
	dok.insertLabel(px.pStyleEndnoteSplitHeadingFollowingRepeatLabel, px.pStyleEndnoteSplitHeadingFollowingRepeatName);	
	dok.insertLabel(px.pStyleEndnoteSplitHeadingPrecedingCopyLabel, px.pStyleEndnoteSplitHeadingPrecedingCopy + "");
	dok.insertLabel(px.pStyleEndnoteSplitHeadingFollowingCopyLabel, px.pStyleEndnoteSplitHeadingFollowingCopy + "");
	dok.insertLabel(px.cStyleEndnoteMarkerLabel, px.cStyleEndnoteMarkerName);
	dok.insertLabel(px.endnoteHeadingStringLabel, px.endnoteHeadingString);
	dok.insertLabel(px.pStylePrefixMarkerLabel, px.pStylePrefix);
	dok.insertLabel(px.numberBySectionLabel, px.numberBySection +"");
	dok.insertLabel(px.footnoteIgnoreLabel, px.footnoteIgnore +"");		
	dok.insertLabel(px.pStyleFootnoteIgnoreLabel, px.pStyleFootnoteIgnoreName);

	dok.insertLabel(px.scriptVersionLabel, px.scriptMajorVersion);
}
function getSections (story) {
	// die performanteste Lösung ist vermutlich nach allen AF zu suchen die mit dem Präfix anfangen und dann den SectionArray zu bauen.
	var sectionIndexArray = [[0,story.characters[0].index, "", "\r", "\r"]];
	for (var ps = 0; ps < px.dokParagraphStylePrefixStyles[px.pStylePrefix].length; ps++) {
		var pStyle = px.dokParagraphStylePrefixStyles[px.pStylePrefix][ps];
		app.findGrepPreferences = NothingEnum.NOTHING;
		app.changeGrepPreferences = NothingEnum.NOTHING;
		app.findGrepPreferences.appliedParagraphStyle = pStyle;
		app.findGrepPreferences.findWhat = ".+";
		if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
			app.findChangeGrepOptions.searchBackwards = false;
		}		
		var results = story.findGrep();		
		var lastPar = null;
		for (var i = 0; i < results.length; i++) {
			var result = results[i].paragraphs[0];
			if ( lastPar && lastPar.index == result.index) {
				continue;
			}
		
			var sectionPar = result.paragraphs[0];
			var sectionParContents = fixInDesignString(sectionPar.contents);
			if (sectionParContents.replace(/\s/g, '') == "") {
				continue;
			} 
		
			var prevPar = null;
			var prevParContents = "";
			if (px.pStyleEndnoteSplitHeadingPrecedingCopy) {
				prevPar = story.characters[sectionPar.index -1].paragraphs[0];
				if (prevPar.isValid && prevPar != null && prevPar.appliedParagraphStyle.id ==  px.pStyleEndnoteSplitHeadingPreceding.id) {
					prevParContents = fixInDesignString(prevPar.contents);
				}
			}		
			var followPar = null;
			var followParContents = "";
			if (px.pStyleEndnoteSplitHeadingFollowingCopy) {
				followPar = idsTools.nextParagraph (sectionPar);
				if (followPar != null && followPar.appliedParagraphStyle.id ==  px.pStyleEndnoteSplitHeadingFollowing.id) {
					followParContents = fixInDesignString(followPar.contents);
				}
			}
		
			sectionIndexArray.push([sectionIndexArray.length,result.index+1, sectionParContents, prevParContents, followParContents]);
			lastPar = result;
		}
	}

	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	
	sectionIndexArray.push([sectionIndexArray.length, story.characters[-1].index, "", "\r", "\r"]);			
	sectionIndexArray.sort(sortSecondEntry);

	if (px.debug) {
		for (var s = 0; s < sectionIndexArray.length; s++) {
			log.debug(sectionIndexArray[s].join(",").replace(/\r/g, ''));
		}
	}

	return sectionIndexArray;
}

/* find the textrange with endnotes */
function getEndnoteBlock (endnoteStory, dok, endnotenStartEndPositions) {
	var startOfTextRange = endnoteStory.characters[-1].index;
	var endOfTextRange = endnoteStory.characters[-1].index;
	
	if (endnotenStartEndPositions.length > 0) {
		startOfTextRange = endnotenStartEndPositions[1].destinationIndexArray[0];
		// In -1 befindet sich die Dummy Endnote!
		var endBlockIndex = endnotenStartEndPositions[endnotenStartEndPositions.length - 2].destinationIndexArray[0];
		// TODO Second Paragraph berücksichtigen 
		var endBlockPar = endnoteStory.characters[endBlockIndex].paragraphs[0];
		while (endBlockPar.insertionPoints[-1].isValid && 
				endnoteStory.insertionPoints[endBlockPar.insertionPoints[-1].index].paragraphs[0].isValid &&
				endnoteStory.insertionPoints[endBlockPar.insertionPoints[-1].index].paragraphs[0].contents.length > 1 &&
				endnoteStory.insertionPoints[endBlockPar.insertionPoints[-1].index].paragraphs[0].appliedParagraphStyle.id == px.pStyleEndnoteFollow.id &&
				endnoteStory.insertionPoints[-1].index > endBlockPar.insertionPoints[-1].index
				) {
			endBlockPar = endnoteStory.insertionPoints[endBlockPar.insertionPoints[-1].index].paragraphs[0];
		}
		endOfTextRange = endBlockPar.characters[-1].index;
	} 
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.findWhat = px.endnoteHeadingString;
	app.findGrepPreferences.appliedParagraphStyle =px.pStyleEndnoteHeading;
	if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
		app.findChangeGrepOptions.searchBackwards = false;
	}	
	var results = endnoteStory.findGrep();
	
	if (results.length == 1) {
		startOfTextRange = results[0].index;
	}
	else if (results.length > 1) {
		startOfTextRange = results[0].index;
		log.warn (localize (px.ui.headingStyleFailBlockMoreThanOne, px.endnoteHeadingString, px.pStyleEndnoteHeading.name ));
	}
	else {
		log.warn (localize (px.ui.headingStyleFailBlock, px.endnoteHeadingString, px.pStyleEndnoteHeading.name ));
	}
	
	return endnoteStory.characters.itemByRange(startOfTextRange, endOfTextRange).getElements()[0]
}

function getCurrentEndnotes(dok, endnoteStory) {
	// Die aktuellen Endnoten einsammeln
	var hLink, j, sourceText, destinationText;
	var hLinksPerStory = [{
//~ 						hLink:null,
						hLinkID:"first",
						sourceIndexArray:[-1],
						destinationIndexArray:[-1],
//~ 						destinationContents:"Dummy Endnote Postion Start"
					}];	

	for (j = 0; j < dok.hyperlinks.length; j++) {
		hLink = dok.hyperlinks[j];
		if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
			try {
				if (getParentStory(hLink.source.sourceText).id != endnoteStory.id) {
					log.warn( localize(px.ui.hyperlinkInWrongStory, hLink.id, getParentStory(hLink.source.sourceText).id) );
					continue;
				}
				if (hLink.destination == null) {
					log.warn ( localize(px.ui.missingHyperlinkDestination, hLink.id) );
					continue;
				}
			
				sourceText = hLink.source.sourceText;
				sourceIndex =  getIndexInStory(sourceText);
				
				destinationText = hLink.destination.destinationText;
				destIndex = getIndexInStory(destinationText);
//~ 				destinationTextContents = getShortText(destinationText);				
//~ 				log.debug("hLink.id : " + hLink.id + " -> " + sourceIndex + " sourceText: " + sourceText.contents + " destinationText: " +  destinationTextContents);
				// [hLink.id, sourceIndex, destIndex, destPar.contents]
				hLinksPerStory.push( {
//~ 					hLink:hLink,
					hLinkID:hLink.id,
					sourceIndexArray:sourceIndex,
					destinationIndexArray:destIndex,
//~ 					destinationContents: destinationTextContents
				});
			} catch (e) {
				log.warn("Fehler bei der Verarbeitung der Hyperlinks, Hyperlinks sind eventuell nicht mehr gültig?\n" + e);
			}
		}
	}
	// Endnoten nach Position in der Story sortieren	
	hLinksPerStory.sort(sortSourceIndexArray);

	hLinksPerStory.push({
//~ 						hLink:null,
						hLinkID:"last",
						sourceIndexArray:[endnoteStory.insertionPoints[-1].index],
						destinationIndexArray:[endnoteStory.insertionPoints[-1].index],
//~ 						destinationContents:"Dummy Endnote Postion End"
					});

	// Prüfen ob die Reihenfolge in den Stories noch stimmt - Copy & Paste Bugs könnten so auffalen. 
	var lastPositionIndexArray = [-2];
	for (var m =0; m < hLinksPerStory.length; m++) {
		log.debug(hLinksPerStory[m].toSource());
		var destinationindexArray = hLinksPerStory[m].destinationIndexArray;
		var c = 0;
		while(destinationindexArray[c+1]  != undefined && lastPositionIndexArray[c+1]  != undefined &&
				destinationindexArray[c] ==  lastPositionIndexArray[c] ) {
			c++;
		} 
		if (destinationindexArray[c] > lastPositionIndexArray[c] ) {
			lastPositionIndexArray = hLinksPerStory[m].destinationIndexArray;
		}
		else {
			var destinationTextContents = getShortText(dok.hyperlinks.itemByID(hLinksPerStory[m].hLinkID).destination.destinationText);
			log.warn(localize (px.ui.wrongEndnoteOrder, destinationTextContents));			
			idsTools.showIt(dok.hyperlinks.itemByID(hLinksPerStory[m].hLinkID).destination.destinationText);
			return null;
		}
	}
	
	return hLinksPerStory;
}


function getIndexInStory(sourceText) {
	var indexArray = []
	indexArray[0] = sourceText.index;
	while ( px.multipleStories &&
				( sourceText.parent instanceof Cell || 
				( sourceText.parentTextFrames.length > 0 && sourceText.parentTextFrames[0].parent instanceof Character ) ) ) {
		if (sourceText.parent instanceof Cell) {
			indexArray.unshift(sourceText.parent.index);
			sourceText = sourceText.parent.parent.storyOffset;
			indexArray.unshift(sourceText.index);
		}
		if (!(sourceText.parent instanceof Cell) && sourceText.parentTextFrames[0].parent instanceof Character) {
			sourceText = sourceText.parentTextFrames[0].parent;
			indexArray.unshift(sourceText.index);
		}
	} 
	return indexArray;
}
function getParentStory(sourceText) {
	if (sourceText instanceof Story) {
		sourceText = sourceText.insertionPoints[0];
	} 
	while ( sourceText.parent instanceof Cell || 
				( sourceText.parentTextFrames.length > 0 && sourceText.parentTextFrames[0].parent instanceof Character ) ) {
		if (sourceText.parent instanceof Cell) {
			sourceText = sourceText.parent.parent.storyOffset;
		}
		if (!(sourceText.parent instanceof Cell) && sourceText.parentTextFrames[0].parent instanceof Character) {
			sourceText = sourceText.parentTextFrames[0].parent;
		}
	} 
	return sourceText.parentStory;
}



// Fixes Hyperlink Labels lost thru Copy&Paste and shows deleted/orphaned Hyperlinks
function fixHyperlinks(dok) {
	var hLink, hLinkCounter, parDestCounter, parDestArray;
	parDestArray = [];
	hLinkCounter =  parDestCounter = 0;

	for (var i = 0; i  < dok.hyperlinks.length; i++) {
		hLink = dok.hyperlinks[i];
		try {
			if (hLink.destination == null) {
				if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
					log.warn(localize (px.ui.hyperlinkProblemDestination, hLink.name, hLink.source.sourceText.contents, idsTools.getPageNameByObject(hLink.source.sourceText)));
				}
				continue;
			}
		}
		catch (e) {
			log.warn(localize (px.ui.hyperlinkProblemDestination, hLink.name, hLink.source.sourceText.contents, idsTools.getPageNameByObject(hLink.source.sourceText)));			
			continue;
		}
//~ 	Dieser Fall kann überhaupt nicht auftreten, weil dann der Hyperlink gelöscht wäre. 2016.02.27 --- beim entfernen auch px.ui.hyperlinkProblemSource löschen
//~ 		if (hLink.source == null) {
//~ 			if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
//~ 				log.warn(localize (px.ui.hyperlinkProblemSource, hLink.name, hLink.destination.destinationText.contents, idsTools.getPageNameByObject(hLink.destination.destinationText)));
//~ 			}
//~ 			continue;
//~ 		}	
		if (hLink.destination && hLink.destination.extractLabel(px.hyperlinkLabel) == "true") {
			hLink.insertLabel(px.hyperlinkLabel, "true");
			parDestArray[hLink.destination.id] = true;
			hLinkCounter++;
		}
	}

	// Hyperlink ist gelöscht 
	for (var i = 0; i < dok.paragraphDestinations.length; i++) {
		parDest = dok.paragraphDestinations[i];
		if (parDest.extractLabel(px.hyperlinkLabel, "true") ) {
			if (parDestArray[parDest.id] == undefined ) {
				//  Seite [%1] im Absatz [%2] steht ein Zielanker [%3]
				var par = parDest.destinationText.paragraphs[0];
				log.warn(localize (px.ui.parDestProblemDestination, idsTools.getPageNameByObject(par), par.contents.substring(0,35), parDest.name));
			}
			parDestCounter++
		}
	}

	if (hLinkCounter != parDestCounter) {
		log.warn(localize (px.ui.NumberOfHLinksNotParDest, hLinkCounter, parDestCounter));
	}
}


function getPosition(footNotePositionIndexArray, hLinksPerStory) {
	for (var m = 1; m < hLinksPerStory.length; m++) {
		var sourceIndexArray = hLinksPerStory[m].sourceIndexArray;
		var c = 0;
		while(sourceIndexArray[c+1] != undefined && footNotePositionIndexArray[c+1] != undefined && 
				sourceIndexArray[c] == footNotePositionIndexArray[c] ) {
			c++;
		} 
	
		var previousSourceIndexArray = hLinksPerStory[m-1].sourceIndexArray;
		var p = 0;
		while(previousSourceIndexArray[p+1] != undefined && footNotePositionIndexArray[p+1] != undefined &&
				previousSourceIndexArray[p] == footNotePositionIndexArray[p] ) {
			p++;
		} 

		if (footNotePositionIndexArray[c] <= sourceIndexArray[c] && footNotePositionIndexArray[p] > previousSourceIndexArray[p]) {
			return hLinksPerStory[m].hLinkID; 
		} 
	}

	log.warn(localize (px.ui.positionFail));
	return null; 
}

function pushHLink ( hLinksPerStory, hyperLinkID, hLink) {
	for (var m =1; m < hLinksPerStory.length; m++) {
		if (hLinksPerStory[m].hLinkID == hyperLinkID) {
			var endnoteObject = {
//~ 						hLink:hLink,
						hLinkID:hLink.id,
						sourceIndexArray:getIndexInStory(hLink.source.sourceText),
						destinationIndexArray:getIndexInStory(hLink.destination.destinationText) ,
//~ 						destinationContents: getShortText(hLink.destination.destinationText) 
					}
			hLinksPerStory.splice(m,0, endnoteObject);
			return;
		} 
	}
	log.warn(localize (px.ui.statusFail));
	return null; 
}

function deleteNotemarkers (dok, endnoteStory) {
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findChangeGrepOptions.includeFootnotes = true;
	for (var i = 0; i < dok.stories.length; i++) {
		var story = dok.stories[i];
		var relevantStory = getParentStory(story);			
		if (relevantStory.id == endnoteStory.id ) {
			//~ 	// Es gibt Abstürze bei wenn der Footnote Marker am Ende des Textabschnitts steht Suche Ersetze Kombinationen in CS6
			story.insertionPoints[-1].contents = " ";
			app.findGrepPreferences.findWhat = "~F";
			story.changeGrep();
			story.characters[-1].contents = "";
		}
	}
}

function recreateIgnoredFootnotes(dok, endnoteStory) {
	if (!px.footnoteIgnore) {
		return;
	}
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;

	for (var i = 0; i < dok.stories.length; i++) {
		var story = dok.stories[i];
		var relevantStory = getParentStory(story);			
		if (relevantStory.id == endnoteStory.id ) {
			app.findGrepPreferences.appliedParagraphStyle = px.pStyleFootnoteIgnore;
			app.findGrepPreferences.findWhat = "\\r+\\Z"; // Das funktioniert in CC 2017 nicht.
			story.changeGrep();
			app.findGrepPreferences.findWhat = "\\r+(?!=.)";  
			story.changeGrep();				
		}
	}
	px.footNoteIgnoreCondition.remove();
}


function trimFootnoteSpace (footNote) {
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findChangeGrepOptions.includeFootnotes = true;
	app.findGrepPreferences.findWhat = "(~F\\t)( |\\t)+";
	app.changeGrepPreferences.changeTo = "$1";
	if (footNote.texts[0].characters.length > 0) footNote.texts[0].changeGrep();
	app.findGrepPreferences.findWhat = "^( |\\t)+";
	app.changeGrepPreferences.changeTo = "";
	if (footNote.texts[0].characters.length > 0) footNote.texts[0].changeGrep();
	app.findGrepPreferences.findWhat = "( |\\t)+(?=\\r)";
	if (footNote.texts[0].characters.length > 0) footNote.texts[0].changeGrep();
	app.findGrepPreferences.findWhat = "( |\\t)+\\z";
	if (footNote.texts[0].characters.length > 0) footNote.texts[0].changeGrep();
	app.findGrepPreferences.findWhat = "\\r";
	if (footNote.texts[0].characters.length > 1) footNote.texts[0].characters[1].changeGrep();
	footNote.insertionPoints[-1].contents = "\r";
}


// Read Existing Style mapping from document
function getStyleInformation (dok) {
	if (dok.extractLabel(px.pStyleEndnoteLabel) != "") {
		px.pStyleEndnoteName = dok.extractLabel(px.pStyleEndnoteLabel);
		log.debug ("px.pStyleEndnoteName" + px.pStyleEndnoteName);
	}	
	if (dok.extractLabel(px.pStyleEndnoteFollowLabel) != "") {
		px.pStyleEndnoteFollowName = dok.extractLabel(px.pStyleEndnoteFollowLabel);
		log.debug ("px.pStyleEndnoteFollowName" + px.pStyleEndnoteFollowName);
	}	
	if (dok.extractLabel(px.pStyleEndnoteHeadingLabel) != "") {
		px.pStyleEndnoteHeadingName = dok.extractLabel(px.pStyleEndnoteHeadingLabel);
		log.debug ("px.pStyleEndnoteHeadingName" + px.pStyleEndnoteHeadingName);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingLabel) != "") {
		px.pStyleEndnoteSplitHeadingName = dok.extractLabel(px.pStyleEndnoteSplitHeadingLabel);
		log.debug ("px.pStyleEndnoteSplitHeadingName" + px.pStyleEndnoteSplitHeadingName);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingPrecedingLabel) != "") {
		px.pStyleEndnoteSplitHeadingPrecedingName = dok.extractLabel(px.pStyleEndnoteSplitHeadingPrecedingLabel);
		log.debug ("px.pStyleEndnoteSplitHeadingPrecedingName" + px.pStyleEndnoteSplitHeadingPrecedingName);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingPrecedingRepeatLabel) != "") {
		px.pStyleEndnoteSplitHeadingPrecedingRepeatName = dok.extractLabel(px.pStyleEndnoteSplitHeadingPrecedingRepeatLabel);
		log.debug ("px.pStyleEndnoteSplitHeadingPrecedingRepeatName" + px.pStyleEndnoteSplitHeadingPrecedingRepeatName);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingPrecedingCopyLabel) != "") {
		px.pStyleEndnoteSplitHeadingPrecedingCopy = dok.extractLabel(px.pStyleEndnoteSplitHeadingPrecedingCopyLabel) == "true";
		log.debug ("px.pStyleEndnoteSplitHeadingPrecedingCopy" + px.pStyleEndnoteSplitHeadingPrecedingCopy);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingFollowingLabel) != "") {
		px.pStyleEndnoteSplitHeadingFollowingName = dok.extractLabel(px.pStyleEndnoteSplitHeadingFollowingLabel);
		log.debug ("px.pStyleEndnoteSplitHeadingFollowingName" + px.pStyleEndnoteSplitHeadingFollowingName);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingFollowingRepeatLabel) != "") {
		px.pStyleEndnoteSplitHeadingFollowingRepeatName = dok.extractLabel(px.pStyleEndnoteSplitHeadingFollowingRepeatLabel);
		log.debug ("px.pStyleEndnoteSplitHeadingFollowingRepeatName" + px.pStyleEndnoteSplitHeadingFollowingRepeatName);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingFollowingCopyLabel) != "") {
		px.pStyleEndnoteSplitHeadingFollowingCopy = dok.extractLabel(px.pStyleEndnoteSplitHeadingFollowingCopyLabel) == "true";
		log.debug ("px.pStyleEndnoteSplitHeadingFollowingCopy" + px.pStyleEndnoteSplitHeadingFollowingCopy);
	}
	if (dok.extractLabel(px.pStyleFootnoteIgnoreLabel) != "") {
		px.pStyleFootnoteIgnoreName = dok.extractLabel(px.pStyleFootnoteIgnoreLabel);
		log.debug ("px.pStyleFootnoteIgnoreName" + px.pStyleFootnoteIgnoreName);
	}
	if (dok.extractLabel(px.cStyleEndnoteMarkerLabel) != "") {
		px.cStyleEndnoteMarkerName = dok.extractLabel(px.cStyleEndnoteMarkerLabel);
		log.debug ("px.cStyleEndnoteMarkerName" + px.cStyleEndnoteMarkerName);
	}
	if (dok.extractLabel(px.endnoteHeadingStringLabel) != "") {
		px.endnoteHeadingString = dok.extractLabel(px.endnoteHeadingStringLabel);
		log.debug ("px.endnoteHeadingString" + px.endnoteHeadingString);
	}
	if (dok.extractLabel(px.pStylePrefixMarkerLabel) != "") {
		px.pStylePrefix = dok.extractLabel(px.pStylePrefixMarkerLabel);
		log.debug ("px.pStylePrefix" + px.pStylePrefix);
	}
	if (dok.extractLabel(px.numberBySectionLabel) != "") {
		px.numberBySection = dok.extractLabel(px.numberBySectionLabel) == "true" ? true : false;
		log.debug ("px.numberBySection" + px.numberBySection);
	}
	if (dok.extractLabel(px.footnoteIgnoreLabel) != "") {
		px.footnoteIgnore = dok.extractLabel(px.footnoteIgnoreLabel) == "true" ? true : false;
		log.debug ("px.footnoteIgnore" + px.footnoteIgnore);
	}
}

/* Read all Styles for GUI and Prefix Mapping */
function readStyles (dok) {
	for (var i = 1; i < dok.allParagraphStyles.length; i++) {
		var style = dok.allParagraphStyles[i];
		if (style.name == px.pStyleEndnoteName)  px.pStyleEndnoteIndex = i-1;
		if (style.name == px.pStyleEndnoteFollowName)  px.pStyleEndnoteFollowIndex = i -1;
		if (style.name == px.pStyleEndnoteHeadingName)  px.pStyleEndnoteHeadingIndex = i -1;
		if (style.name == px.pStyleEndnoteSplitHeadingName)  px.pStyleEndnoteSplitHeadingIndex = i -1;
		if (style.name == px.pStyleEndnoteSplitHeadingPrecedingName)  px.pStyleEndnoteSplitHeadingPrecedingIndex = i -1;		
		if (style.name == px.pStyleEndnoteSplitHeadingFollowingName)  px.pStyleEndnoteSplitHeadingFollowingIndex = i -1;
		if (style.name == px.pStyleFootnoteIgnoreName)  px.pStyleFootnoteIgnoreIndex = i -1;
		if (style.name == px.pStyleEndnoteSplitHeadingPrecedingRepeatName)  px.pStyleEndnoteSplitHeadingPrecedingRepeatIndex = i -1;		
		if (style.name == px.pStyleEndnoteSplitHeadingFollowingRepeatName)  px.pStyleEndnoteSplitHeadingFollowingRepeatIndex = i -1;
	
		px.dokParagraphStyleNames[i-1] = style.name;
		px.dokParagraphStyles[i-1] = style;
		prefix = style.name.match(/^[^~]+/);
		if (prefix) {
			prefix = prefix[0];
			px.dokParagraphStylePrefixes.push(prefix);
			if (px.dokParagraphStylePrefixStyles[prefix]) px.dokParagraphStylePrefixStyles[prefix].push(style);
			else  px.dokParagraphStylePrefixStyles[prefix] = [style];
		}		
	}
	px.dokParagraphStylePrefixes = idsTools.unique(px.dokParagraphStylePrefixes);
	px.pStylePrefixIndex = 0;
	for (var i = 0; i < px.dokParagraphStylePrefixes.length; i++) {
		if (px.dokParagraphStylePrefixes[i] == px.pStylePrefix) {
			px.pStylePrefixIndex = i;
			break;
		}
	}

	for (var i = 0; i < dok.allCharacterStyles.length; i++) {
		var style = dok.allCharacterStyles[i];
		if (style.name == px.cStyleEndnoteMarkerName)  px.cStyleEndnoteMarkerIndex = i;
		px.dokCharacterStyleNames[i] = style.name;
		px.dokCharacterStyles[i] = style;
	}
}

/* Check endnote style and cross ref format for usability in script */
function checkStyles(dok) {
	// Absätze von Endnoten müssen immer nummeriert sein!
	if (px.pStyleEndnote.id == px.pStyleEndnoteFollow.id) {
		px.pStyleEndnoteFollow = px.pStyleEndnote.duplicate();
		dok.insertLabel(px.pStyleEndnoteFollowLabel, px.pStyleEndnoteFollow.name);
		log.warn( localize (px.ui.samePStyle, px.pStyleEndnoteName ) );	
	}		
	if (px.pStyleEndnote.bulletsAndNumberingListType != ListType.numberedList) {
		px.pStyleEndnote.bulletsAndNumberingListType = ListType.numberedList;
		px.pStyleEndnote.numberingFormat = NumberingStyle.ARABIC;
	}

	if (px.pStyleEndnoteFollow.bulletsAndNumberingListType == ListType.numberedList) {
		px.pStyleEndnoteFollow.bulletsAndNumberingListType = ListType.NO_LIST;
		log.warn( localize (px.ui.endnoteStyleNumberingDeactivate, px.pStyleEndnoteFollowName) );	
	}
	// Check CrossRef Format 
	px.crossRefStyleEndnote = dok.crossReferenceFormats.item (px.crossRefStyleEndnoteName);
	if (!px.crossRefStyleEndnote.isValid) {
		px.crossRefStyleEndnote = dok.crossReferenceFormats.add ({name: px.crossRefStyleEndnoteName});
		px.crossRefStyleEndnote.appliedCharacterStyle = px.cStyleEndnoteMarker;
		px.crossRefStyleEndnote.buildingBlocks.add (BuildingBlockTypes.paragraphNumberBuildingBlock);
	}
	else {
		px.crossRefStyleEndnote.buildingBlocks[0].blockType = BuildingBlockTypes.paragraphNumberBuildingBlock;			
		if (px.crossRefStyleEndnote.appliedCharacterStyle == null || (px.cStyleEndnoteMarker != null &&  px.crossRefStyleEndnote.appliedCharacterStyle.id != px.cStyleEndnoteMarker.id)) {
			px.crossRefStyleEndnote.appliedCharacterStyle = px.cStyleEndnoteMarker;
			log.warn(localize (px.ui.crossrefFormatFail, px.crossRefStyleEndnoteName, px.cStyleEndnoteMarkerName));
		} 
	}
}

/* GUI for configuration */
function getConfig() {
	var win = new Window("dialog", localize(px.ui.menuTitle, px.version));  
	with (win) {
		// Art der Verarbeitung 
		win.pMethod = add( "panel", undefined, localize(px.ui.methodPanel) );
		win.pMethod.preferredSize.width = 600;
		win.pMethod.alignChildren = ['left', 'top'];
		win.pMethod.spacing = 10;
		with (win.pMethod) {
			win.pMethod.gMethod = add( "group");
			win.pMethod.gMethod.margins = [0,10,0,10];
			win.pMethod.gMethod.spacing = 10;
			win.pMethod.gMethod.alignChildren = ['left', 'top'];
			win.pMethod.gMethod.orientation = 'column';
			with (win.pMethod.gMethod) {
				win.pMethod.gMethod.radioSplit = add( "radiobutton", undefined, localize(px.ui.splitByHeading) );
				win.pMethod.gMethod.radioSplit.value = px.numberBySection;
				win.pMethod.gMethod.radioCont = add( "radiobutton", undefined, localize(px.ui.continuousNumbering) );
				win.pMethod.gMethod.radioCont.value = !px.numberBySection;				
			}					
			win.pMethod.spacing = 0;
						
			win.pMethod.gMethod.gInfo = add("group");
			win.pMethod.gMethod.gInfo.margins = [0,5,0,0];
			
			with (win.pMethod.gMethod.gInfo) {
				win.pMethod.gMethod.gInfo.footnoteIgnoreCBox = add( "checkbox", undefined, localize(px.ui.ignoreFootnotesByStyle) );
				win.pMethod.gMethod.gInfo.footnoteIgnoreCBox.value = px.footnoteIgnore;
				win.pMethod.gMethod.gInfo.footnoteIgnoreCBox.preferredSize.height = 16;
				win.pMethod.gMethod.gInfo.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
				win.pMethod.gMethod.gInfo.ddList.selection = px.pStyleFootnoteIgnoreIndex;
				win.pMethod.gMethod.gInfo.ddList.preferredSize.width = 175;
				win.pMethod.gMethod.gInfo.ddList.enabled = win.pMethod.gMethod.gInfo.footnoteIgnoreCBox.value;
			}			
		}

		// Auswahl des Splitformats 
		win.pSplit = add( "panel", undefined, localize(px.ui.splitFormatPanel) );
		win.pSplit.preferredSize.width = 600;
		win.pSplit.orientation = 'column';
		win.pSplit.alignChildren = ['left', 'top'];
		win.pSplit.spacing = 10;
		with (win.pSplit) {
			win.pSplit.gInfo = add("group");
			win.pSplit.gInfo.orientation = 'column';
			win.pSplit.gInfo.alignChildren = ['left', 'top'];
			win.pSplit.gInfo.margins = [0,10,0,0];
			win.pSplit.gInfo.spacing = 5;
			with(win.pSplit.gInfo) {
				win.pSplit.gInfo.gEndnoteStyle = add("group");
				with(win.pSplit.gInfo.gEndnoteStyle){
					win.pSplit.gInfo.gEndnoteStyle.sText = add( "statictext", undefined, localize(px.ui.splitByHeadingStyle) );
					win.pSplit.gInfo.gEndnoteStyle.ddList =  add( "dropdownlist", undefined, px.dokParagraphStylePrefixes);
					win.pSplit.gInfo.gEndnoteStyle.ddList.selection = px.pStylePrefixIndex;
					win.pSplit.gInfo.gEndnoteStyle.ddList.preferredSize.width = 175;
				}
			}
			win.pSplit.gFormat = add("group");
			win.pSplit.gFormat.orientation = 'column';
			win.pSplit.gFormat.alignChildren = ['left', 'top'];
			win.pSplit.gFormat.margins = [0,0,0,0];
			win.pSplit.gFormat.spacing = 5;
			with(win.pSplit.gFormat){
				win.pSplit.gFormat.gEndnoteStyle = add("group");
				with(win.pSplit.gFormat.gEndnoteStyle){
					win.pSplit.gFormat.gEndnoteStyle.sText = add( "statictext", undefined, localize(px.ui.endNoteSplitHeadingParagraphStyle) );
					win.pSplit.gFormat.gEndnoteStyle.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
					win.pSplit.gFormat.gEndnoteStyle.ddList.selection = px.pStyleEndnoteSplitHeadingIndex;
					win.pSplit.gFormat.gEndnoteStyle.ddList.preferredSize.width = 175;
				}
			}
		
	
			win.pSplit.gCopy = add("group");
			win.pSplit.gCopy.orientation = 'column';
			win.pSplit.gCopy.alignChildren = ['left', 'top'];
			win.pSplit.gCopy.margins = [0,10,0,0];
			win.pSplit.gCopy.spacing = 5;
						
			with(win.pSplit.gCopy) {	
				win.pSplit.gCopy.gInfo = add("group");
				win.pSplit.gCopy.gInfo.orientation = 'column';
				win.pSplit.gCopy.gInfo.alignChildren = ['left', 'top'];
				win.pSplit.gCopy.gInfo.margins = [0,0,0,10];
				win.pSplit.gCopy.gInfo.spacing = 5;		
				with(win.pSplit.gCopy.gInfo) {
					win.pSplit.gCopy.gInfo.gPreceding = add("group");
					with(win.pSplit.gCopy.gInfo.gPreceding) {
						win.pSplit.gCopy.gInfo.gPreceding.cBox = add( "checkbox", undefined, localize(px.ui.endNoteSplitHeadingParagraphStylePreceding) );
						win.pSplit.gCopy.gInfo.gPreceding.cBox.value = px.pStyleEndnoteSplitHeadingPrecedingCopy;
						win.pSplit.gCopy.gInfo.gPreceding.cBox.preferredSize.height = 16;
						win.pSplit.gCopy.gInfo.gPreceding.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
						win.pSplit.gCopy.gInfo.gPreceding.ddList.enabled = win.pSplit.gCopy.gInfo.gPreceding.cBox.value
						win.pSplit.gCopy.gInfo.gPreceding.ddList.selection = px.pStyleEndnoteSplitHeadingPrecedingIndex;
						win.pSplit.gCopy.gInfo.gPreceding.ddList.preferredSize.width = 175;
					}
					win.pSplit.gCopy.gInfo.gPrecedingRepeat = add("group");
					with(win.pSplit.gCopy.gInfo.gPrecedingRepeat) {
						win.pSplit.gCopy.gInfo.gPrecedingRepeat.stext = add( "statictext", undefined, localize(px.ui.endNoteSplitHeadingParagraphStylePrecedingFollowingRepeat) );
						win.pSplit.gCopy.gInfo.gPrecedingRepeat.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
						win.pSplit.gCopy.gInfo.gPrecedingRepeat.ddList.enabled = win.pSplit.gCopy.gInfo.gPreceding.cBox.value
						win.pSplit.gCopy.gInfo.gPrecedingRepeat.ddList.selection = px.pStyleEndnoteSplitHeadingPrecedingRepeatIndex;
						win.pSplit.gCopy.gInfo.gPrecedingRepeat.ddList.preferredSize.width = 175;
					}
				
					win.pSplit.gCopy.gInfo.gFollowing = add("group");
					win.pSplit.gCopy.gInfo.gFollowing.margins = [0,10,0,0];
					with(win.pSplit.gCopy.gInfo.gFollowing) {
						win.pSplit.gCopy.gInfo.gFollowing.cBox = add( "checkbox", undefined, localize(px.ui.endNoteSplitHeadingParagraphStyleFollowing) );
						win.pSplit.gCopy.gInfo.gFollowing.cBox.value = px.pStyleEndnoteSplitHeadingFollowingCopy;
						win.pSplit.gCopy.gInfo.gFollowing.cBox.preferredSize.height = 16;
						win.pSplit.gCopy.gInfo.gFollowing.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
						win.pSplit.gCopy.gInfo.gFollowing.ddList.enabled = win.pSplit.gCopy.gInfo.gFollowing.cBox.value;
						win.pSplit.gCopy.gInfo.gFollowing.ddList.selection = px.pStyleEndnoteSplitHeadingFollowingIndex;
						win.pSplit.gCopy.gInfo.gFollowing.ddList.preferredSize.width = 175;
					}
					win.pSplit.gCopy.gInfo.gFollowingRepeat = add("group");
					with(win.pSplit.gCopy.gInfo.gFollowingRepeat) {
						win.pSplit.gCopy.gInfo.gFollowingRepeat.stext = add( "statictext", undefined, localize(px.ui.endNoteSplitHeadingParagraphStylePrecedingFollowingRepeat) );
						win.pSplit.gCopy.gInfo.gFollowingRepeat.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
						win.pSplit.gCopy.gInfo.gFollowingRepeat.ddList.enabled = win.pSplit.gCopy.gInfo.gFollowing.cBox.value;
						win.pSplit.gCopy.gInfo.gFollowingRepeat.ddList.selection = px.pStyleEndnoteSplitHeadingFollowingRepeatIndex;
						win.pSplit.gCopy.gInfo.gFollowingRepeat.ddList.preferredSize.width = 175;
					}
				}			
			}
		
			win.pSplit.gFormat.xsText = add( "statictext", undefined, localize(px.ui.formatWarnung) , {multiline:true});
			win.pSplit.gFormat.xsText.preferredSize.width = 515;
			win.pSplit.gFormat.xsText.preferredSize.height = 35;
		}
		win.pSplit.enabled = px.numberBySection;
		// Formatierung der Endnote
		win.pInfo = add( "panel", undefined, localize(px.ui.formatPanel) );
		win.pInfo.preferredSize.width = 600;
		win.pInfo.orientation = 'row';
		win.pInfo.spacing = 10;
		with (win.pInfo) {
			win.pInfo.gInfo = add("group");
			win.pInfo.gInfo.orientation = 'column';
			win.pInfo.gInfo.alignChildren = ['left', 'top'];
			win.pInfo.gInfo.margins = [0,10,0,0];
			win.pInfo.gInfo.spacing = 5;
			with(win.pInfo.gInfo){
				win.pInfo.gInfo.gEndnoteStyle = add("group");
				with(win.pInfo.gInfo.gEndnoteStyle){
					win.pInfo.gInfo.gEndnoteStyle.sText = add( "statictext", undefined, localize(px.ui.endnoteParagraphStyle) );
					win.pInfo.gInfo.gEndnoteStyle.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
					win.pInfo.gInfo.gEndnoteStyle.ddList.selection = px.pStyleEndnoteIndex;
					win.pInfo.gInfo.gEndnoteStyle.ddList.preferredSize.width = 175;
				}
				win.pInfo.gInfo.gEndnoteStyleFF = add("group");
				with(win.pInfo.gInfo.gEndnoteStyleFF){
					win.pInfo.gInfo.gEndnoteStyleFF.sText = add( "statictext", undefined, localize(px.ui.endnoteFollowParagraphStyle) );
					win.pInfo.gInfo.gEndnoteStyleFF.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
					win.pInfo.gInfo.gEndnoteStyleFF.ddList.selection = px.pStyleEndnoteFollowIndex;
					win.pInfo.gInfo.gEndnoteStyleFF.ddList.preferredSize.width = 175;
				}
				win.pInfo.gInfo.gEndnoteCStyle = add("group");
				with(win.pInfo.gInfo.gEndnoteCStyle ){
					win.pInfo.gInfo.gEndnoteCStyle.sText = add( "statictext", undefined, localize(px.ui.endnoteMarkerCharacterStyle) );
					win.pInfo.gInfo.gEndnoteCStyle.ddList =  add( "dropdownlist", undefined, px.dokCharacterStyleNames);
					win.pInfo.gInfo.gEndnoteCStyle.ddList.selection = px.cStyleEndnoteMarkerIndex;
					win.pInfo.gInfo.gEndnoteCStyle.ddList.preferredSize.width = 175;
				}			
			}
		}
		// Formatierung des Endnotentitels
		win.pTitle = add( "panel", undefined, localize(px.ui.endNoteHeadingPanel) );
		win.pTitle.preferredSize.width = 600;
		win.pTitle.orientation = 'column';
		win.pTitle.alignChildren = ['left', 'top'];
		win.pTitle.spacing = 10;
		with (win.pTitle) {
			win.pTitle.gInfo = add("group");
			win.pTitle.gInfo.orientation = 'row';
			win.pTitle.gInfo.alignChildren = ['left', 'fill'];
			win.pTitle.gInfo.margins = [0,10,0,0];
			win.pTitle.gInfo.spacing = 5;
			with (win.pTitle.gInfo) {
				win.pTitle.gInfo.sText = add( "statictext", undefined, localize(px.ui.endNoteHeading)  );
				win.pTitle.gInfo.sText.preferredSize.width = 60;
				win.pTitle.gInfo.eTextendNoteHeading = add( "edittext", undefined, px.endnoteHeadingString );
				win.pTitle.gInfo.eTextendNoteHeading.preferredSize.width = 350;
			}
			win.pTitle.gFormat = add("group");
			win.pTitle.gFormat.orientation = 'column';
			win.pTitle.gFormat.alignChildren = ['left', 'top'];
			win.pTitle.gFormat.margins = [0,0,0,0];
			win.pTitle.gFormat.spacing = 5;
			with(win.pTitle.gFormat) {
				win.pTitle.gFormat.gEndnoteStyle = add("group");
				with(win.pTitle.gFormat.gEndnoteStyle){
					win.pTitle.gFormat.gEndnoteStyle.sText = add( "statictext", undefined, localize(px.ui.endNoteHeadingParagraphStyle) );
					win.pTitle.gFormat.gEndnoteStyle.ddList =  add( "dropdownlist", undefined, px.dokParagraphStyleNames);
					win.pTitle.gFormat.gEndnoteStyle.ddList.selection = px.pStyleEndnoteHeadingIndex;
					win.pTitle.gFormat.gEndnoteStyle.ddList.preferredSize.width = 175;
				}
			}
		}
	

		// Steuerung Ok/Cancel
		win.groupStart = add("group");
		win.groupStart.preferredSize.width = 600;
		win.groupStart.alignChildren = ['right', 'center'];
		win.groupStart.margins = 0;
		with (win.groupStart) {
			win.groupStart.buttonSave = add( "button", undefined, localize(px.ui.saveButton) );
			win.groupStart.butOk = add( "button", undefined, localize(px.ui.okButton) );
			win.groupStart.butOk.enabled = true;
			win.groupStart.butCancel = add( "button", undefined, localize(px.ui.cancelButton) );
		}
	}

	win.pMethod.gMethod.radioCont.onClick = function () {
		win.pSplit.enabled = win.pMethod.gMethod.radioSplit.value;
	}
	win.pMethod.gMethod.radioSplit.onClick = function () {
		win.pSplit.enabled = win.pMethod.gMethod.radioSplit.value;
	}
	win.pSplit.gCopy.gInfo.gFollowing.cBox.onClick = function () {
		win.pSplit.gCopy.gInfo.gFollowing.ddList.enabled = win.pSplit.gCopy.gInfo.gFollowing.cBox.value;
		win.pSplit.gCopy.gInfo.gFollowingRepeat.ddList.enabled =win.pSplit.gCopy.gInfo.gFollowing.cBox.value;		
	}
	win.pSplit.gCopy.gInfo.gPreceding.cBox.onClick = function () {
		win.pSplit.gCopy.gInfo.gPreceding.ddList.enabled = win.pSplit.gCopy.gInfo.gPreceding.cBox.value;
		win.pSplit.gCopy.gInfo.gPrecedingRepeat.ddList.enabled = win.pSplit.gCopy.gInfo.gPreceding.cBox.value;
	}
	win.pMethod.gMethod.gInfo.footnoteIgnoreCBox.onClick = function () {
		win.pMethod.gMethod.gInfo.ddList.enabled = win.pMethod.gMethod.gInfo.footnoteIgnoreCBox.value;
	}

	// Ok / Set Values 
	win.groupStart.butOk.onClick = function() {
		if (!setValues()) {
			return;
		}
		win.close(1);
	}
	win.groupStart.butCancel.onClick = function() {
		win.close (2);
	}
	win.groupStart.buttonSave.onClick = function() {
		setValues();
		win.close (3);
	}

	// -
	win.center();
	return win.show();

	function setValues() {		
		px.numberBySection = win.pMethod.gMethod.radioSplit.value;
		px.footnoteIgnore = win.pMethod.gMethod.gInfo.footnoteIgnoreCBox.value;
		px.pStyleFootnoteIgnoreName = px.dokParagraphStyleNames[win.pMethod.gMethod.gInfo.ddList.selection.index];
		px.pStyleFootnoteIgnore = px.dokParagraphStyles[win.pMethod.gMethod.gInfo.ddList.selection.index];
		
		px.pStylePrefix = px.dokParagraphStylePrefixes[win.pSplit.gInfo.gEndnoteStyle.ddList.selection.index];		
		
		px.pStyleEndnoteName = px.dokParagraphStyleNames[win.pInfo.gInfo.gEndnoteStyle.ddList.selection.index];
		px.pStyleEndnote = px.dokParagraphStyles[win.pInfo.gInfo.gEndnoteStyle.ddList.selection.index];
		px.pStyleEndnoteFollowName = px.dokParagraphStyleNames[win.pInfo.gInfo.gEndnoteStyleFF.ddList.selection.index];
		px.pStyleEndnoteFollow = px.dokParagraphStyles[win.pInfo.gInfo.gEndnoteStyleFF.ddList.selection.index];
		px.pStyleEndnoteHeadingName = px.dokParagraphStyleNames[win.pTitle.gFormat.gEndnoteStyle.ddList.selection.index];
		px.pStyleEndnoteHeading = px.dokParagraphStyles[win.pTitle.gFormat.gEndnoteStyle.ddList.selection.index];
		
		px.pStyleEndnoteSplitHeadingName = px.dokParagraphStyleNames[win.pSplit.gFormat.gEndnoteStyle.ddList.selection.index];		
		px.pStyleEndnoteSplitHeading = px.dokParagraphStyles[win.pSplit.gFormat.gEndnoteStyle.ddList.selection.index];
		
		px.pStyleEndnoteSplitHeadingPrecedingCopy = win.pSplit.gCopy.gInfo.gPreceding.cBox.value;		
		px.pStyleEndnoteSplitHeadingFollowingCopy = win.pSplit.gCopy.gInfo.gFollowing.cBox.value;

		px.pStyleEndnoteSplitHeadingPrecedingName = px.dokParagraphStyleNames[win.pSplit.gCopy.gInfo.gPreceding.ddList.selection.index];
		px.pStyleEndnoteSplitHeadingPreceding = px.dokParagraphStyles[win.pSplit.gCopy.gInfo.gPreceding.ddList.selection.index];
		px.pStyleEndnoteSplitHeadingFollowingName = px.dokParagraphStyleNames[win.pSplit.gCopy.gInfo.gFollowing.ddList.selection.index];
		px.pStyleEndnoteSplitHeadingFollowing = px.dokParagraphStyles[win.pSplit.gCopy.gInfo.gFollowing.ddList.selection.index];

		px.pStyleEndnoteSplitHeadingPrecedingRepeatName = px.dokParagraphStyleNames[win.pSplit.gCopy.gInfo.gPrecedingRepeat.ddList.selection.index];
		px.pStyleEndnoteSplitHeadingPrecedingRepeat = px.dokParagraphStyles[win.pSplit.gCopy.gInfo.gPrecedingRepeat.ddList.selection.index];
		px.pStyleEndnoteSplitHeadingFollowingRepeatName = px.dokParagraphStyleNames[win.pSplit.gCopy.gInfo.gFollowingRepeat.ddList.selection.index];
		px.pStyleEndnoteSplitHeadingFollowingRepeat = px.dokParagraphStyles[win.pSplit.gCopy.gInfo.gFollowingRepeat.ddList.selection.index];


		px.endnoteHeadingString = win.pTitle.gInfo.eTextendNoteHeading.text.replace (/\r|\n/g,'');
		if (px.endnoteHeadingString == "") {
			alert (localize (px.ui.headingFail));
			return false;
		}
		if (px.pStyleEndnoteHeadingName == px.pStyleEndnoteSplitHeadingName) {
			alert (localize (px.ui.headingStyleSelectionFail));
			return false;
		}	
		if (px.pStyleEndnoteHeadingName == px.pStyleEndnoteSplitHeadingPrecedingRepeatName) {
			alert (localize (px.ui.headingStyleSelectionFail));
			return false;
		}	
		if (px.pStyleEndnoteHeadingName == px.pStyleEndnoteSplitHeadingFollowingRepeatName) {
			alert (localize (px.ui.headingStyleSelectionFail));
			return false;
		}	
	
		px.cStyleEndnoteMarkerName = px.dokCharacterStyleNames[win.pInfo.gInfo.gEndnoteCStyle.ddList.selection.index];
		px.cStyleEndnoteMarker = px.dokCharacterStyles[win.pInfo.gInfo.gEndnoteCStyle.ddList.selection.index];
		if (!(px.pStyleEndnoteName && px.pStyleEndnote && px.pStyleEndnoteFollowName && px.pStyleEndnoteFollow && px.pStyleEndnoteHeadingName && px.pStyleEndnoteHeading && px.endnoteHeadingString && px.cStyleEndnoteMarkerName && px.cStyleEndnoteMarker)) {
			alert (localize (px.ui.styleSelectionFail));
			return false;
		}
		if (px.numberBySection && !(px.pStylePrefix && px.pStyleEndnoteSplitHeading) ) {
			alert (localize (px.ui.styleSelectionFailSection));
			return false;
		}
		return true;
	}
}
/* String */ function getShortText(destinationText) {
	destinationTextContents = destinationText.paragraphs[0].contents;
	if (destinationTextContents != "") {
		destinationTextContents = destinationTextContents.replace(/\r/g, ' ');
	}
	if (destinationTextContents.length > 43) {
		destinationTextContents = destinationTextContents.substring(0,39) + "...";
	}
	return destinationTextContents; 
}

/* String */ function fixInDesignString (string) {
	string = string.replace(/[\u0003\u0004\u0007\u0016]/g, ''); // <control> Character können raus
	string = string.replace(/\uFEFF/g, ''); // InDesign Spezialzeichen entfernen 
	string = string.replace(/\uFFFC/g, ''); // Anchored Obkject
	return string;
}
/* Array sort function */
function sortSecondEntry(a,b) {
	  return a[1] - b[1];
}
/* Array sort Story Index Array  */
function sortSourceIndexArray(a,b) {
	var a = a.sourceIndexArray;
	var b = b.sourceIndexArray;
	var c = 0;
	while ( a[c+1]  != undefined && b[c+1]  != undefined && a[c] == b[c]) {
		c++;
	}
	return a[c] - b[c];
}

/* Check if a text is selected*/
function checkSelection() {
	if (app.selection.length != 1) {
		return false;
	}		
	var selection = app.selection[0];
	selection = selection.getElements()[0];
	if (!(selection instanceof TextFrame || selection instanceof InsertionPoint || selection instanceof Text)) {		
		return false;
	}
	return true;
}

/**  Init Log File and System */
function initLog() {
	px.scriptFolderPath = getScriptFolderPath();
	if (px.scriptFolderPath.fullName.match(/lib$/)) {
		px.scriptFolderPath = px.scriptFolderPath.parent;
	}

	var logFolder = Folder( px.scriptFolderPath + "/log/");
	logFolder.create();
	var logFile = File ( logFolder + "/" + px.logFileName );

	if (px.debug) {
		log = idsLog.getLogger(logFile, "DEBUG", true);
		log.clearLog();
	} 
	else {
		log = idsLog.getLogger(logFile, "INFO", false);
	}
	log.info("Starte " + px.projectName + " v" + px.version + " Debug: " + px.debug);
	return logFile;
}

/** Get Filepath from current script  */
function getScriptFolderPath() {
	var skriptPath;
	
	try {
		skriptPath  = app.activeScript.parent;
	} 
	catch (e) { 
		/* We're running from the ESTK*/
		skriptPath = File(e.fileName).parent;
	}
	return skriptPath;
}
