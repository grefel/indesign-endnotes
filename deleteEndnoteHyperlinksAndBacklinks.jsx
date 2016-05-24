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
//DESCRIPTION: Delete alls Hyperlinks and TextlinkSources but leave Endnotes alone (are not linked anymore)
@Date: 2016-19-05
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
    var dok;
	dok  =app.documents[0];
	
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

function deleteMe(object) {
	if ( object.extractLabel(px.hyperlinkLabel) == "true" || object.extractLabel(px.hyperlinkLabel) == "backlink" ||
		object.name.indexOf("EndnoteBacklink_") == 0 		// Legacy Skript
	) {
		$.writeln(object.constructor.name);
		object.remove();
	}
}