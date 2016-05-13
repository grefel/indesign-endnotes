/*
    InDesign endnote solution based on scripting and cross references. 
    Copyright (C) 2015  Gregor Fellenz

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

/*  
//DESCRIPTION: Delete all endnotes 
@Date: 2016-15-01
@Author Gregor Fellenz http://www.publishingx.de/
*/

#include config.jsx 
// Debug Einstellungen publishingX
if (app.extractLabel("px:debugID") == "Jp07qcLlW3aDHuCoNpBK") {
     px.debug = true;
}


if ( ! $.global.hasOwnProperty('idsTesting') ) {
	startProcessing();
}

function startProcessing() {
	if (parseInt(app.version) < 6) {
		alert( localize(px.ui.versionWarning) );
		return;
	}
	
	if (app.documents.length == 0) {
		return;
	}
	app.doScript(removeStart, ScriptLanguage.JAVASCRIPT , undefined, UndoModes.ENTIRE_SCRIPT,  localize(px.ui.deleteEndnoteName));
}

function removeStart() {
    //Ebenen entsperren und sichtbar machen
	var  dok  =app.documents[0];
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

    // Ebenen zurücksetzen
	for (var i = 0; i < dok.layers.length; i++) {
		dok.layers[i].visible = layerState[i][0];
		dok.layers[i].locked = layerState[i][1];
	}

	
	if (!remove()) {
		alert(localize(px.ui.noEndnoteOrMarker));
	}	
}

function remove() {
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
			if (hLink.source.sourceText.index == index) {
				removeHL(hLink);
				return true;
			}
			if (hLink.destination.destinationText.index == parIndex) {
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