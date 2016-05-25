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
//DESCRIPTION: Gehe zur Endnote (Gehe zum Hyperlink der diesen Textanker nutzt); 
@Version: 1.1
@Date: 2016-01-15
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
		alert(localize(px.ui.versionWarning) );
		return;
	}
	
	if (app.documents.length == 0) {
		return;
	}

	if (!jump()) {
		alert(localize (px.ui.noEndnoteOrMarker));
	}
}

function jump() {
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

	fixHyperlinks(dok);
	
	var selectionText = app.selection[0];
	var index = app.selection[0].index;
	var parIndex = app.selection[0].paragraphs[0].index
	for (var i = 0; i  < dok.hyperlinks.length; i++) {
		if (dok.hyperlinks[i].extractLabel(px.hyperlinkLabel) == "true") {
			var hLink = dok.hyperlinks[i];
			$.writeln(hLink.source.sourceText.index + " - " +  hLink.destination.destinationText.index);
			if (hLink.source.sourceText.index == index) {
				hLink.showDestination();				
				return true;
			}
			if (hLink.destination.destinationText.index == parIndex) {
				hLink.showSource();
				return true;
			} 
		}
	}
	return false;
}

function fixHyperlinks(dok) {
	var hLink;
	for (var i = 0; i  < dok.hyperlinks.length; i++) {
		hLink = dok.hyperlinks[i];
		if (hLink.destination.extractLabel(px.hyperlinkLabel) == "true") {
			hLink.insertLabel(px.hyperlinkLabel, "true");
		}
		if (hLink.destination.extractLabel(px.hyperlinkLabel) == "backlink") {
			hLink.insertLabel(px.hyperlinkLabel, "backlink");
		}
	}
}