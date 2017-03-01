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
//DESCRIPTION: Convert Footnotes to Endnotes  ( Uses the cross-reference function from InDesign )
## Acknowledgements
I derived the idea of using InDesign cross references for endnotes from Peter Kahrel. Peters solution is still a good source of inspiration and can be found here [http://www.kahrel.plus.com/indesign/footnotes.html](http://www.kahrel.plus.com/indesign/footnotes.html)

@Version: 3.2
@Date: 2017-02-27
@Author Gregor Fellenz http://www.publishingx.de/
*/

//~ #include config.jsx 

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
Shared configuration settings 
@Version: 3
@Date: 2016-08-29
@Author Gregor Fellenz http://www.publishingx.de/
Typos and GUI Texts by Maren Pufe 
*/

var px = {
	// Configurations settings for style names -- changes is save 
	pStyleEndnoteName:"Anm", // Absatzformat der Endnote. Das Format sollte automatisch nummeriert sein. Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	pStyleEndnoteFollowName:"Anm~folge", // Absatzformat für Endnoten mit mehr als einem Absatz. Das Format sollte automatisch nummeriert sein. Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	
	// Endnote block structure 
	pStyleEndnoteHeadingName:"endnote_block_title", // Absatzformat der Endnotenüberschrift
	pStyleEndnoteSplitHeadingName:"endnote_block_section", // Absatzformat für die wiederholten Überschriften (wdh von: pStylePrefix) 
	pStyleEndnoteSplitHeadingPrecedingRepeatName:"endnote_block_section_preceding", // Absatzformat für Absätze vor wiederholten Überschriften (wdh von: pStyleEndnoteSplitHeadingPrecedingName)
	pStyleEndnoteSplitHeadingFollowingRepeatName:"endnote_block_section_following", // Absatzformat für Absätze vor wiederholten Überschriften (wdh von: pStyleEndnoteSplitHeadingPrecedingName)
	
	cStyleEndnoteMarkerName:"Endnotenzähler", // Zeichenformat des Endnotenmarkers. Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	crossRefStyleEndnoteName:"EndnotenMarker", // Querverweisformat. Kann nicht in der GUI ausgewählt werden.
	
	endnoteHeadingString:"Endnoten", // Default Text für die Entnotenüberschrift

	// Section Structure
	pStylePrefix:"u1", // Präfix der Überschriften an denen die Endnotenzählung geteilt wird.
	pStyleEndnoteSplitHeadingPrecedingName:"U1_Pre", // Absatzformat für Absätze, die kopiert werden sollen
	pStyleEndnoteSplitHeadingFollowingName:"U1_Follow", //  Absatzformat für Absätze, die kopiert werden sollen

	// Ignore Footnote Style
	pStyleFootnoteIgnoreName:"footnote_keep", // Absatzformate für Fußnoten, die nicht konvertiert werden sollen

	// User interface strings -- translation and changes are save
	ui:{
		// all scripts 
		saveDoc:{en:"Document is not saved", de:"Dokument ist nicht gespeichert"},
		saveDocInfo:{en:"Save your document first!\rSave and continue?", de:"Das Dokument muss zuerst gespeichert werden!\rSpeichern und fortfahren?"},
		saveDocFail:{en:"Could not save file.\n", de:"Die Datei konnte nicht gespeichert werden.\n"},
		errorInfo:{en:"Error during execution: ", de:"Fehler bei der Ausführung: "},		
		versionWarning:{en:"To run this script InDesign CS5 is required", de:"Für dieses Skript wird mindestens InDesign CS5 benötigt"},
		scriptVersionWarning:{en:"The document has been created with Version (v%1). Compatibility can not be guaranteed.\nPlease check carefully.", de:"Das Dokument wurde mit Version (v%1) erstellt. Die Kompatibilität kann nicht garantiert werden.\nBitte prüfen Sie genau."},
		emptyEndnotePar:{en:"%1 empty Pargraph(s) with endnote format [%2]. Please delete or assign another format.\nSee log file for more information.", de:"%1 Absätze ohne Inhalt sind mit dem Format [%2] ausgezeichnet. Bitte weisen Sie ein anderes Format zu oder löschen Sie die Absätze.\nIn der Log-Datei finden sie weitere Informationen."},	
		emptyEndnoteParContent:{en:"Preceeding Paragraph: ", de:"Absatz vor leerem Anmerkungsabsatz zur Fehlersuche: "},	
		// createEndnotes.jsx		
		menuTitle:{en:"Convert footnotes to endnotes v%1", de:"Fußnoten zu Endnoten konvertieren v%1"},		
		resultInfo:{en:"[%1] footnotes converted to endnotes!", de:"Es wurden [%1] Fußnoten zu Endnoten konvertiert!"},
		resultInfoConvert:{en:"[%1] backlinks created.\nDo not update the crossreferences!", de:"Es wurden [%1] Backlinks erstellt.\nDie Querverweise dürfen jetzt nicht mehr aktualisiert werden."},
		couldNotCreateBacklink:{en:"Could not create backlink for [%1]", de:"Konnte Backlink für [%1] nicht erstellen"},
		
		noTextInDoc:{en:"No text in document", de:"Es ist kein Text im Dokument enthalten"},
		noFootnoteInDoc:{en:"No footnote in document", de:"Es gibt keine Fußnote im Dokument"},
		multipleEndnoteLinks:{en:"More than one story with endnotes, cannot process this document.", de:"In mehr ale einem Textabschnitt befinden sich Endnoten, dieses Dokument kann nicht verarbeitet werden."},
		willProcessCurrentSelection:{en:"More than one story with footnotes, will process the current story (cursor position)", de:"Mehr als ein Textabschnitt enthält Fußnoten, es wird der aktuelle Textabschnitt (Position der Einfügemarke) verarbeitet."},
		createSelection:{en:"More than one story with footnotes, place cursor in story and restart", de:"Mehr als ein Textabschnitt enthält Fußnoten, bitte positionieren Sie die Einfügemarke im gewünschten Textabschnitt"},
		endnoteAndFootnotesAreNotInTheSameStory:{en:"Endnotes and Footnotes are not in the same story", de:"Endnoten und Fußnoten sind nicht im gleichen Textabschnitt!"},
		unknownSelectionError:{en:"Could not determine the footnote story", de:"Der Textabschnitt mit den Fußnoten konnte nicht ermittelt werden!"},
		wrongEndnoteOrder:{en:"Position of endnote [%1] is not in sync with story flow.\nCheck your document.", de:"Die Position der Endnote [%1] entspricht nicht dem Textfluss.\nPrüfen Sie das Dokument."},
		emptyFootnote:{en:"Cannot process footnotes without text.", de:"Fußnoten ohne Text können nicht verarbeitet werden."},
		hyperlinkAlreadyExists:{en:"Endnote %1 has already a hyperlink, cannot create Backlink.", de:"Endnote %1 enthält bereits einen Hyperlink. Es kann kein Backlink erstellt werden."},
		hyperlinkProblemDestination:{en:"Destinaton of Hyperlink [%1] with source text [%2] was deleted.", de:"Das Ziel des Hyperlinks [%1] mit dem Quelltext [%2] wurde gelöscht."},	
		hyperlinkProblemSource:{en:"Source of Hyperlink [%1] with destination text [%2] was deleted.", de:"Die Quelle des Hyperlinks [%1] mit dem Zieltext [%2] wurde gelöscht."},	
		parDestProblemDestination:{en:"On page [%1] in paragraph [%2] is a Textanchor [%3] without Hyperlink.\nEndnote marker was accidentally deleted?", de:"Auf Seite [%1] im Absatz [%2] steht ein Zielanker [%3], auf den kein Hyperlink zeigt.\nVielleicht wurde der Endnotemarker versehentlich gelöscht?"},	
		missingHyperlinkDestination:{en:"Hyperlink [%1] has no destination. Endnote is probably deleted!", de:"Ein Hyperlink [ID: %1] hat kein Ziel (Endnote) mehr. Die Endnote wurde vermutlich gelöscht!"},
		NumberOfHLinksNotParDest:{en:"Number of Hyperlinks (Endnote marker)  [%1] does not equal Number of destinations (endnotes) [%2]", de:"Die Anzahl der Hyperlinks (Endnoten marker) [%1] entspricht nicht der Anzahl Destinations (Endnoten) [%2]"},
		hyperlinkInWrongStory:{en:"Hyperlink with ID [%1] isn't located in the endnote story, instead in story with ID [%2]", de:"Der Hyperlink mit der ID [%1] ist nicht in der Endnoten-Story, sondern in der Story mit der ID  [%2]"},
		
		methodPanel:{en:"Mode",de:"Verarbeitungsmodus"},
		splitByHeading:{en:"Split by paragraph style",de:"Anhand von Absatzformat trennen (Bildet Abschnitte für Kapitel)"},
		continuousNumbering:{en:"Continuous numbering",de:"Fortlaufend nummerieren (Alle Endnoten in einem Abschnitt)"},
		ignoreFootnotesByStyle:{en:"Ignore footnotes with paragraph style",de:"Ignoriere Fußnote mit dem Absatzformat"},		
		
		splitFormatPanel:{en:"Split endnote configuration",de:"Formatpräfix an dem die Endnoten geteilt werden"},
		splitByHeadingStyle:{en:"Split paragraph style/heading",de:"Format zur Aufteilung in Abschnitte"},
		endNoteSplitHeadingParagraphStyle:{en:"Paragraph style for repeated headings",de:"Absatzformat wiederholte Überschriften"},

		endNoteSplitHeadingParagraphStylePreceding:{en:"Copy preceding paragraph formated by:",de:"Vorherigen Absatz kopieren, Formatvorgabe:"},
		endNoteSplitHeadingParagraphStyleFollowing:{en:"Copy following paragraph formated by:",de:"Folgenden Absatz kopieren, Formatvorgabe:"},		
		endNoteSplitHeadingParagraphStylePrecedingFollowingRepeat:{en:"Paragraph style for repeated paragraphs:",de:"Wiederholten Absatz formatieren:"},
		
		formatWarnung:{en:"Caution: Any Text formatted in paragraph style for repeated headings will be deleted. Use only in endnote area!",de:"Achtung: Texte, die mit den Absatzformaten für wiederholte (Über)schriften formatiert sind, werden gelöscht. Verwenden Sie diese Formate nur im Bereich der Endnoten."},
		
		formatPanel:{en:"Endnote styling",de:"Formate der Endnoten"},
		endnoteParagraphStyle:{en:"Paragraph style endnote",de:"Absatzformat Endnote"},
		endnoteFollowParagraphStyle:{en:"Paragraph Style followup paragraph",de:"Absatzformat Folgeabsatz"},
		endnoteMarkerCharacterStyle:{en:"Character style endnote marker",de:"Zeichenformat Endnotenmarker"},
		
		endNoteHeadingPanel:{en:"Endnote Block",de:"Endnotentitel"},
		endNoteHeading:{en:"Heading",de:"Titelzeile"},
		endNoteHeadingParagraphStyle:{en:"Paragraph style heading",de:"Absatzformat Endnotentitel"},
		cancelButton:{en:"Cancel",de:"Abbrechen"},
		okButton:{en:"Convert footnotes",de:"Konvertiere Fußnoten"},
		saveButton:{en:"Save Settings in document",de:"Einstellungen im Dokument speichern"},
		
		
		invalidSelection:{en:"Invalid Selection", de:"Ungültige Auswahl"},
		headingStyleFail:{en:"The choosen heading [%1] does not match the heading text [%2] in your document. \n\Please check the result!", de:"Die von Ihnen gewünschte Überschrift [%1] stimmt nicht mit dem Überschriftentext [%2] im Dokument überein. \n\nBitte prüfen Sie das Ergebnis!"},
		headingStyleFailBlock:{en:"The chosen heading [%1] in format [%1] cannot be found in the document. \n\Please check the result!", de:"Die von Ihnen gewünschte Überschrift [%1] mit dem Format [%2] kann nicht gefunden werden. \n\nBitte prüfen Sie das Ergebnis!"},
		headingStyleFailBlockMoreThanOne:{en:"The chosen heading [%1] in format [%1] is on more than one location in the document. \n\Please check the result!", de:"Die von Ihnen gewünschte Überschrift [%1] mit dem Format [%2] ist an mehreren Stellen im Dokument gefunden worden.\n\nBitte prüfen Sie das Ergebnis!"},
		statusFail:{en:"Undocumented Error! - Please send the document to the support!", de:"Unklarer Status! - Bitte senden Sie das Dokument an den Support!"},
		numberingFail:{en:"Followup paragraph not found! Numbering may be faulty!", de:"Folgeabsatz nicht gefunden! Nummerierung ggf. fehlerhaft!"},
		endnoteLinkInCell:{en:"Endnote marker must not reside in a cell wihtin another Table or anchored Frame", de:"Der Endnotenmaker darf nicht in einer Tabellenzelle, die zu einer anderen Tabelle oder einem verankerten Rahmen gehört, platziert sein!"},		
		endnoteLinkInAnchoredFrame:{en:"Endnote marker must not reside in a anchored Frame wihtin another anchored Frame or Table", de:"Der Endnotenmaker darf nicht in einem verankerten Rahmen, der zu einem verankerten Rahmen  oder einer anderen Tabelle gehört, platziert sein!"},
		
		sectionIsEmpty:{en:"Section is empty! Numbering may be faulty!", de:"Abschnitt ist leer! Nummerierung ggf. fehlerhaft!"},
		newPagesAdded:{en:"There were %1 pages added. Please check the document", de:"Es wurden %1 Seiten hinzugefügt. Bitte prüfen Sie den Umfang"},
		positionFail:{en:"There was an error in the endnote position analysis!\Please contact support!", de:"Es ist ein Fehler bei der Endnotenpositionsanalyse aufgetreten!\nBitte kontaktieren Sie den Support!"},		
		samePStyle:{en:"The paragraph format [%1] was also selected for the followup paragraphs, this could lead to numbering errors! The format has been duplicated.", de:"Das Absatzformat [%1] wurde auch für die Folgeabsätze ausgewählt, dies führt ggf. zu Nummerierungsfehlern! Das Format wurde dupliziert."},
		crossrefFormatFail:{en:"The cross-reference format [%1] already exists.\nThe selected different character style [%2] was set!", de:"Das Querverweisformat [%1] ist bereits vorhanden.\nDas ausgewählte aber abweichende Zeichenformat [%2] wurde eingestellt!"},
		endnoteStyleNumberingDeactivate:{en:"In Paragraph Style [%1] the option \n[Bullets and Numbering] -> [List Type : Numbes ] was deactivated.", de:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] deaktiviert."},
		headingFail:{en:"For the title at least one character must be entered.",de:"Für den Titel muss mindestens ein Zeichen eingegeben werden."},
		styleSelectionFail:{en:"Error in the format selection", de:"Fehler bei der Formatauswahl"},
		styleSelectionFailSection:{en:"Error in the format selection of the section creation.", de:"Fehler bei der Formatauswahl für die Abschnittsbildung"},
		endnoteStoryMoved:{en:"Text and endnotes must be in the same Story\nPlease copy the endnote text to the end of the text portion", de:"Text und Endnoten müssen sich im gleichen InDesign Textabschnitt befinden!\nBitte kopieren Sie den Endnoten-Text an das Ende des Textabschnitts."},

		// deleteEndnotes.jsx
		noEndnoteOrMarker:{en:"The insertion point must be placed within an endnote or before the endnote marker.", de:"Die Einfügemarke muss innerhalb einer Endnote oder vor dem Endnotenmarker platziert sein."},
		deleteEndnoteName:{en:"Remove endnote",de:"Endnote entfernen"},
		confirmEndnoteDelete:{en:"Remove Endnote %1 \n\n%2",de:"Endnote löschen %1 \n\n%2"},

	},



	// Careful with changes below, changing options might break the update process of previously converted documents
	createBackupCopy:true,
	backupCopySuffix:"_endnoteBackupt.indd",
	
	numberBySection:true,
	
	hyperlinkLabel:"px:Foot2EndnoteHyperlink", // Markierung der SkriptQuerverweise
	endnoteHeadingStringLabel:"px:Foot2EndnoteHeadingString", 
	
	dokParagraphStyles:[],
	dokParagraphStyleNames:[],
	dokCharacterStyles:[],
	dokCharacterStyleNames:[],
	
	pStyleEndnote:undefined,
	pStyleEndnoteIndex:0,
	pStyleEndnoteLabel:"px:Foot2EndnoteParagraphStyle",
	
	pStyleEndnoteFollow:undefined,
	pStyleEndnoteFollowIndex:0,
	pStyleEndnoteFollowLabel:"px:Foot2EndnoteParagraphStyleFollowing",
	
	pStyleEndnoteHeading:undefined,
	pStyleEndnoteHeadingIndex:0,
	pStyleEndnoteHeadingLabel:"px:Foot2EndnoteParagraphStyleHeading",
	
	pStyleEndnoteSplitHeading:undefined,
	pStyleEndnoteSplitHeadingIndex:0,
	pStyleEndnoteSplitHeadingLabel:"px:Foot2EndnoteParagraphStyleSplitHeading",

	pStyleEndnoteSplitHeadingPreceding:undefined,
	pStyleEndnoteSplitHeadingPrecedingIndex:0,
	pStyleEndnoteSplitHeadingPrecedingLabel:"px:Foot2EndnoteParagraphStyleSplitHeadingPreceding",

	pStyleEndnoteSplitHeadingPrecedingRepeat:undefined,
	pStyleEndnoteSplitHeadingPrecedingRepeatIndex:0,
	pStyleEndnoteSplitHeadingPrecedingRepeatLabel:"px:Foot2EndnoteParagraphStyleSplitHeadingPrecedingRepeat",

	pStyleEndnoteSplitHeadingPrecedingCopy:false,
	pStyleEndnoteSplitHeadingPrecedingCopyLabel:"px:Foot2EndnoteParagraphStyleSplitHeadingPrecedingCopy",
	
	pStyleEndnoteSplitHeadingFollowing:undefined,
	pStyleEndnoteSplitHeadingFollowingIndex:0,
	pStyleEndnoteSplitHeadingFollowingLabel:"px:Foot2EndnoteParagraphStyleSplitHeadingFollowing",

	pStyleEndnoteSplitHeadingFollowingRepeat:undefined,
	pStyleEndnoteSplitHeadingFollowingRepeatIndex:0,
	pStyleEndnoteSplitHeadingFollowingRepeatLabel:"px:Foot2EndnoteParagraphStyleSplitHeadingRepeatFollowing",

	footnoteIgnore:false,
	footnoteIgnoreLabel:"px:Foot2EndnoteFootnoteIgnore",
	
	pStyleFootnoteIgnore:undefined,
	pStyleFootnoteIgnoreIndex:0,
	pStyleFootnoteIgnoreLabel:"px:Foot2EndnoteParagraphStyleFootnoteIgnore",
	

	pStyleEndnoteSplitHeadingFollowingCopy:false,
	pStyleEndnoteSplitHeadingFollowingCopyLabel:"px:Foot2EndnoteParagraphStyleSplitHeadingFollowingCopy",
	
	cStyleEndnoteMarker:undefined,
	cStyleEndnoteMarkerIndex:0,
	cStyleEndnoteMarkerLabel:"px:Foot2EndnoteCharacterStyle",	
	
	dokParagraphStylePrefixes:[],
	dokParagraphStylePrefixStyles:[],
	
	pStylePrefixMarkerLabel:"px:Foot2EndnoteSplitPrefix",
	numberBySectionLabel:"px:numberBySection",
	
	scriptVersionLabel:"px:Foot2EndnoteVersion",
	scriptMajorVersion:"3",
	
	foot2EndCounter:0,
	debug:false,
	showGui:true,
	logFileName:"endnoteLog.txt",
	ids:undefined,
	version:"3.2-2017-02-27",	
	projectName:"InDesign Endnotes"		
	
}

// Debug Einstellungen publishingX 
if (app.extractLabel("px:debugID") == "Jp07qcLlW3aDHuCoNpBK_Gregor-") {
	px.debug = true;
	px.showGui = false;
}

// Libs 
{
/**
* Helper and tools for common InDesign scripting tasks
* @class <b>idsTools</b> contains InDesign JavaScript Extensions. Include this library and use the idsTools object in your script.<br/><br/><code>#include "idsHelper.jsx"<br/>[...]<br/>_ids = idsTools()<br/>_ids.getPageByObject(_pageItem)</code><br/>
*/
var idsTools = idsTools || function () {
	return { 
		/**
		* Returns the <b>Page</b> which contains the Object
		* @param {Object} _object PageItem, Text or Object
		* @return the <b>Page</b> containing the object, if no <b>Page</b> can be determined <b>null</b>
		*/
		getPageByObject : function (_object) {
			if (_object != null) {
				_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in CS5!
				if (_object.hasOwnProperty("baseline")) {
					_object = _object.parentTextFrames[0];
				}
				while (_object != null) {
					if (_object.hasOwnProperty ("parentPage")) return _object.parentPage;
					var whatIsIt = _object.constructor;
					switch (whatIsIt) {
						case Page : return _object;
						case Character : _object = _object.parentTextFrames[0]; break;
						case Footnote :; // drop through
						case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
						case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
						case XMLElement : 
							if (_object.pageItems.length > 0) {									
								_object = _object.pageItems[0];
							}
							else if (_object.insertionPoints[0] != null) {
								if (_object.insertionPoints[0].parentTextFrames.length > 0) {
									_object = _object.insertionPoints[0].parentTextFrames[0]; 
								} 
								else {
									return null;
								}
							}
							break; 
						case Application : return null;
						default: _object = _object.parent;
					}
					if (_object == null) return null;
				}
				return _object;	
			} 
			else {
				return null;
			}
		},
		/**
		* Returns the <b>Spread</b> which contains the Object
		* @param {Object} _object PageItem, Text or Object
		* @return The <b>Spread</b> containing the Object, if no <b>Spread</b> can be determined <b>null</b>
		*/
		getSpreadByObject : function (_object) {
			if (_object != null) {
				_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in CS5!
				if (_object.hasOwnProperty("baseline")) {
					_object = _object.parentTextFrames[0];
				}
				while (_object != null) {
					var whatIsIt = _object.constructor;
					switch (whatIsIt) {
						case Spread : return _object;
						case MasterSpread : return _object;
						case Character : _object = _object.parentTextFrames[0]; break;
						case Footnote :; // drop through
						case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
						case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
						case XMLElement : 
							if (_object.pageItems.length > 0) {									
								_object = _object.pageItems[0];
							}
							else if (_object.insertionPoints[0] != null) {
								if (_object.insertionPoints[0].parentTextFrames.length > 0) {
									_object = _object.insertionPoints[0].parentTextFrames[0]; 
								} 
								else {
									return null;
								}
							}
							break; 
						case Application : return null;
						default: _object = _object.parent;
					}
					if (_object == null) return null;
				}
				return _object;
					} 
			else {
				return null;
			}
		},


		/**
		* Returns the <b>Page name or Spread Index</b> which contains the Object
		* @param {Object} _object PageItem, Text or Object
		* @return the <b>Page name or Spread Index</b> which contains the Object as String
		*/
		getPageNameByObject : function (_object) {
			var page = this.getPageByObject(_object);
			if (page) {
				return page.name;
			}
			var spread = this.getSpreadByObject(_object);
			if (spread) {
				return localize({en:"Spread", de:"Montagefläche"}) + " " +  (spread.index+1);
			}			
			return localize({en:"Overset Text", de:"Text im Übersatz"});
		},

		/**
		* Ungroup recursively 
		* @param {Object} _object Document, Layer, Page or Group... 
		*/
		ungroupAll : function (_object) {
			while (_object.groups.length != 0) {
				_object.groups.everyItem().ungroup();
			}
		},		
		/**
		* Selects the given Object, shows the page and centers the view.
		* @param {Object} _object PageItem, Text or Object to show
		* @return {Bool} Status of execution: <b>true</b> everything ok, <b>false</b> something went wrong
		*/
		showIt : function (_object) {
			if (_object != null) {
		        if (_object.hasOwnProperty ("source")) _object = _object.source;
				if (_object.hasOwnProperty ("sourcePageItem")) _object = _object.sourcePageItem;
				if (_object.hasOwnProperty ("sourceText")) _object = _object.sourceText;
				var _spread = this.getSpreadByObject (_object);
				if (_spread != null) {
					var _dok = _spread.parent;
					if (_dok.layoutWindows.length > 0 && (app.activeWindow.parent != _dok || app.activeWindow.constructor.name == "StoryWindow" )) {
						app.activeWindow = _dok.layoutWindows[0];
					}
					app.activeWindow.activeSpread = _spread;
				}
				app.select(_object);
				var myZoom = app.activeWindow.zoomPercentage; 
				app.activeWindow.zoom(ZoomOptions.showPasteboard); 
				app.activeWindow.zoomPercentage = myZoom;
				return true;
			}
			else {
				return false;
			}
		},


		/**
		* Creates a new Page and TextFrame. The TextFrame fits into the page margins
		* @param {Page} _page The reference page
		* @param {MasterSpread} [_master] The MasterSpread for the new page. If no value is given, the MasterSpread from <code>_page</code> is applied.
		* @param {_newPage} [Boolean]  Create a new page or not?
		* @return {TextFrame} The new TextFrame		
		*/
		addPageTextFrame : function(_page, _master, _newPage) {
			if (_newPage == undefined)  _newPage = true;
			var _dok = _page.parent.parent;
			if (_newPage ) {
				var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
				if (_master == undefined) _newPage.appliedMaster = _page.appliedMaster;
				else _newPage.appliedMaster = _master;
			}
			else {
				var _newPage = _page;
			}
			var _y1 = _newPage.marginPreferences.top;
			var _y2 = _dok.documentPreferences.pageHeight - _newPage.marginPreferences.bottom;
			if (_newPage.side == PageSideOptions.LEFT_HAND) {
				var _x1 = _newPage.marginPreferences.right;
				var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.left;
			} 
			else {
				var _x1 = _newPage.marginPreferences.left;
				var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.right;
			}
			var _tf = _newPage.textFrames.add();
			var oldV = this.resetDefaults();
//~ 			var _breite = _x2 -_x1;
//~ 			_breiteInPunkt = new UnitValue(  _breite+ "mm").as("pt");
//~ 			var _hoehe = _y2 -_y1;
//~ 			_hoeheInPunkt = new UnitValue( _hoehe + "mm").as("pt");	
//~ 			_tf.resize(BoundingBoxLimits.GEOMETRIC_PATH_BOUNDS, AnchorPoint.TOP_LEFT_ANCHOR , ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [_breiteInPunkt, _hoeheInPunkt ]);
//~ 			_tf.move([_tf.geometricBounds[1] + _x1, _tf.geometricBounds[0] + _y1]);
			_tf.geometricBounds = [_y1 , _x1 , _y2 , _x2];
			
			_tf.textFramePreferences.textColumnCount = _newPage.marginPreferences.columnCount;
			_tf.textFramePreferences.textColumnGutter =  _newPage.marginPreferences.columnGutter
			
			this.setDefaults(oldV);
			return _tf;
		},

		/**
		* Get the type area of the page 
		* @param {Page} page The reference page
		* @return {Array} Type area Array [y1,x1,y2,x2]
		*/
		getTypeArea : function (page) {
			var doc = page.parent.parent;
			var y1 = page.marginPreferences.top;
			var y2 = doc.documentPreferences.pageHeight - page.marginPreferences.bottom;
			if (page.side == PageSideOptions.LEFT_HAND) {
				var x1 = page.marginPreferences.right;
				var x2 = doc.documentPreferences.pageWidth - page.marginPreferences.left;
			} 
			else {
				var x1 = page.marginPreferences.left;
				var x2 = doc.documentPreferences.pageWidth - page.marginPreferences.right;
			}			
			return [y1 , x1 , y2 , x2];
		},		
		/** Scales a frame to a given width 
			@param {PageItem} frame The frame to scale
			@param {Number} width The widht in millimeters
			@param {Boolean} maxImageSize is a maximum image size greater 100% allowed?
		*/			
		scaleToWidth : function (frame, width, maxImageSize) {
			if (maxImageSize == undefined) maxImageSize == false;			
			var gb = frame.geometricBounds;
			frame.geometricBounds = [gb[0], gb[1], gb[0] + width, gb[1] + width];
			frame.fit(FitOptions.FILL_PROPORTIONALLY);
			if (frame.graphics != undefined && frame.graphics[0].isValid) {
				var graphic = frame.graphics[0];
				if (maxImageSize && frame.graphics[0].absoluteHorizontalScale > 100) {
					graphic.absoluteHorizontalScale = 100;
					graphic.absoluteVerticalScale = 100;
				}
				if ((frame.geometricBounds[3] - frame.geometricBounds[1]) < (graphic.geometricBounds[3] - graphic.geometricBounds[1]) ) {
					frame.fit(FitOptions.PROPORTIONALLY);
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				} 
				else {
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				}
			}
		},
		/** Scales a frame to a given height 
			@param {PageItem} frame The frame to scale
			@param {Number} height The height in millimeters
			@param {Boolean} maxImageSize is a maximum image size greater 100% allowed?
		*/
			
		scaleToHeight : function (frame, height, maxImageSize) {
			if (maxImageSize == undefined) maxImageSize == false;			
			var gb = frame.geometricBounds;
			frame.geometricBounds = [gb[0], gb[1], gb[0] + height, gb[1] + height];
			frame.fit(FitOptions.FILL_PROPORTIONALLY);
			if (frame.graphics != undefined) {
				var graphic = frame.graphics[0];
				if (maxImageSize && frame.graphics[0].absoluteHorizontalScale > 100) {
					graphic.absoluteHorizontalScale = 100;
					graphic.absoluteVerticalScale = 100;
				}
				if ((frame.geometricBounds[2] - frame.geometricBounds[0]) < (graphic.geometricBounds[2] - graphic.geometricBounds[0]) ) {
					frame.fit(FitOptions.PROPORTIONALLY);
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				} 
				else {
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				}			
			}			
		},

		/**
		* Try to find and override a labeled (CS3/CS4) or named (CS5) MasterPageItem on a Page
		* @param {String} _label The name/label of the PageItem
		* @param {Page} _page The Page 
		* @return {PageItem} The PageItem or <b>null</b>
		*/
		getMasterPageItem : function (_label, _page) {
			if (_page.appliedMaster == null ) return null; // No MasterPage applied 
			var _pi = _page.pageItems.itemByName(_label);
			if (_pi == null ) {
				if (_page.side == PageSideOptions.RIGHT_HAND) {
					var _mPage = _page.appliedMaster.pages[1];
					var _mpi = _mPage.pageItems.itemByName(_label);
					while (_mpi == null && _mPage.appliedMaster != null) {
						_mpi = _mPage.appliedMaster.pages[1].pageItems.itemByName(_label);
						_mPage = _mPage.appliedMaster.pages[1];
					}
					try { // Try to release the object
						var pageItem = _mpi.override(_page);
						var piBounds = pageItem.geometricBounds;
						var mpiBounds = _mpi.geometricBounds;
						if (piBounds[0]  != mpiBounds[0] ||  piBounds[1]  != mpiBounds[1] ) {
							pageItem.geometricBounds = mpiBounds;
						} 						
						return pageItem;
					} catch (e) { // Object was already released but was deleted as it is also included in _pi!
						return null;
					}
				} else { // Left or Single
					var _mPage = _page.appliedMaster.pages[0];
					var _mpi = _mPage.pageItems.itemByName(_label);
					while (_mpi == null && _mPage.appliedMaster != null) {
						_mpi = _mPage.appliedMaster.pages[0].pageItems.itemByName(_label);
						_mPage = _mPage.appliedMaster.pages[0];
					}					
					try {
						var pageItem = _mpi.override(_page);
						var piBounds = pageItem.geometricBounds;
						var mpiBounds = _mpi.geometricBounds;
						if (piBounds[0]  != mpiBounds[0] ||  piBounds[1]  != mpiBounds[1] ) {
							pageItem.geometricBounds = mpiBounds;
						} 						
						return pageItem;
					} catch (e) {
						return null;
					}
				}
			}
			else { // Object has already been released ...
				return _pi;
			}
		},

		/**
		* Resolves the next Paragraph object. Use this function instead of <code>nextItem()</code> 
		* from the collection Paragraphs as this method is much quicker with long Text objects.
		* @param {Paragraph} par The reference Paragraph 
		* @return {Paragraph} The next Paragraph or null
		*/
		nextParagraph : function (par) {
			if ( par == undefined || !par.hasOwnProperty('baseline')) {
				return null;
			}
			var last_ip = null, next_ip = null, next_paragraph = null;
			last_ip = (par.constructor.name == 'Paragraph') ? par.insertionPoints[-1] : par.paragraphs[-1].insertionPoints[-1];
			if (last_ip == last_ip.parentStory.insertionPoints[-1]) {
				return null;
			}
			next_ip = par.parent.insertionPoints.item(last_ip.index);
			if (next_ip.isValid) {
				return next_ip.paragraphs[0];
			}
			else {
				return null;	
			}
		},
		/**
		* Resolves the next Character object. Use this function instead of <code>nextItem()</code> 
		* from the collection Characters as this method is much quicker with long Text objects.
		* @param {Character} _char The reference Character
		* @return {Character} The next Character or null
		*/
		nextChar : function (_char) {
			var _lastCharLetzterIndex = _char.index;
			var _firstCharNaechster = _char.parentStory.characters[_lastCharLetzterIndex + 1];
			if (_firstCharNaechster != null ) return _firstCharNaechster;
			else return null;
		},


		/** 
		* Calculates the cap height 
		* @param {Character} _char A reference character for font style and size
		* @return {Number} The cap height relative to the current MeasurementUnit
		*/
		getCapHeight : function (_char) {
			var _tf = app.activeDocument.textFrames.add();
			_tf.geometricBounds = [0,-100,100,-200];
			_tf.textFramePreferences.insetSpacing = [0,0,0,0];
			var _checkChar = _char.duplicate(LocationOptions.AT_BEGINNING, _tf);
			_checkChar.contents = "H";
			_checkChar.alignToBaseline = false;
			_tf.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT; 
			var _versalHoehe = _checkChar.baseline;
		//~ 	$.writeln("Versahlhˆhe ist: " + _versalHoehe);
			_tf.remove();
			return _versalHoehe;
		},


		/**
		* Checks the last TextFrame of the Story. If there is an overflow new Pages and TextFrames are added.
		* @param {Story} _story The Story to check
		* @return {TextFrame} The last TextFrame
		*/
		checkOverflow : function (_story) {
			_story.insertionPoints[-1].contents = SpecialCharacters.ZERO_WIDTH_NONJOINER;
			var _lastTC = _story.textContainers[_story.textContainers.length - 1];
			var _run = true;
			while (_lastTC.overflows && _run) {
				var _last = _story.textContainers.length -1;
				if (_story.textContainers[_last].characters.length == 0 && _last -1 > -1 && _story.textContainers[_last -1].characters.length == 0 && _last -1 > -2 && _story.textContainers[_last -2].characters.length ==0 ) _run = false;
				var _page = this.getPageByObject(_lastTC);
				var _tf = this.addPageTextFrame(_page);
				_lastTC.nextTextFrame = _tf;
				_lastTC = _tf;
			}
			while (_story.textContainers.length > 1 && _lastTC.characters.length == 0) {
				var _page = this.getPageByObject(_lastTC);
				_page.remove();
				_lastTC = _story.textContainers[_story.textContainers.length - 1];
			}
			_story.characters[-1].contents = "";
		},


		/**
		* Fits a textframe height to its content - use this function if tf.fit(FitOptions.FRAME_TO_CONTENT); does not work
		* Based on Marc Autrets algorithm http://www.indiscripts.com/post/2011/03/indesign-scripting-forum-25-sticky-posts#hd2sb2
		* @param {TextFrame} tf The TextFrame to fit
		* @param {Number} [precision] The precision, defaults to 0.1
		* @param {String} [xRef] Reference point  'left'(default) | 'right' | 'center'*/
		fitTextFrame : function (/*TextFrame*/ tf, /*Number*/ precision, /*String*/xRef) {
			precision = (precision || .1);
			xRef = AnchorPoint['TOP_' + (xRef||'left').toUpperCase() + '_ANCHOR'];

			// Default width multiplier. This value is only used if tf overflows in its initial state. 1.5 is fine, usually.
			var Y_FACTOR = 1.5;

			var ovf = tf.overflows, dx;
		  
			// If tf originally overflows, we need to add height
			while ( tf.overflows ) {
				tf.resize(CoordinateSpaces.INNER_COORDINATES,xRef, ResizeMethods.MULTIPLYING_CURRENT_DIMENSIONS_BY ,[1,Y_FACTOR]);
			}

			// Now, let's compute the maximal height variation (dx)
			dx = tf.resolve(AnchorPoint.BOTTOM_LEFT_ANCHOR, CoordinateSpaces.INNER_COORDINATES)[0][1] - tf.resolve(AnchorPoint.TOP_LEFT_ANCHOR, CoordinateSpaces.INNER_COORDINATES)[0][1];
			if ( ovf ) dx *= (1-1/Y_FACTOR);
		 
			// Dichotomy on dx
			while( dx > precision ) {
				dx*=.5;
				tf.resize(CoordinateSpaces.INNER_COORDINATES,xRef, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [0, dx*(tf.overflows?1:-1)]);
			}
		 
			// Last step, if needed
			if( tf.overflows ) {
				tf.resize(CoordinateSpaces.INNER_COORDINATES,xRef, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO,[0, dx]);
			}
		},	 
	
		/**
		* Removes all TextFrame but the first from a Story.
		* @param {Story} The Story
		* @return {Story} The story
		*/
		removeContainerFromStory : function (story) {
			while (story.textContainers.length > 1) {
				story.textContainers[story.textContainers.length -1].remove();
			}
			return story;
		},		
		/** 
		* Array sort (according to DIN 5007 Variante 1) includes German umlauts. <code>_array.sort(idsTools.sort_DE)</code>
		*/ 	
		sort_DE : function (a, b) {
			a = removeUmlaut (a);
			b = removeUmlaut (b);
			if (a==b) return 0;
			if (a > b) return 1;
			else return -1;
			// Replace german umlauts
			function removeUmlaut (a) {
				a = a.toLowerCase();
				a = a.replace(/‰/g,"a");
				a = a.replace(/ˆ/g,"o");
				a = a.replace(/¸/g,"u");
				a = a.replace(/ﬂ/g,"s");	
				return a;
			}	
		},
		/**
		* Unique an Array 
		* @param {Array} The Array to unique
		* @return {Array} Array
		*/
		unique : function (arr) {
			var hash = {}, result = [];
			for ( var i = 0, l = arr.length; i < l; ++i ) {
				if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
					hash[ arr[i] ] = true;
					result.push(arr[i]);
				}
			}
			return result;
		},
		/**
		* Unique and count  Array 
		* @param {Array} Sorted Array
		* @return {Array} Array
		*/
		uniqueAndCount : function (array) {
			var arr = [], a = [], b = [], prev;
			
			for ( var i = 0; i < array.length; i++ ) {
				if (array[i] != "") arr.push(array[i]);
			}
			

			for ( var i = 0; i < arr.length; i++ ) {
				if ( arr[i] !== prev ) {
					a.push(arr[i]);
					b.push(1);
				} else {
					b[b.length-1]++;
				}
				prev = arr[i];
			}

			return [a, b];
		},
		/**
		* Locate a File   
		* @param {String} name The filename too look after 
		* @param {String} folderName 
		* @param {Boolean} recursive defaults to false
		* @param {Boolean} verbose defaults to false 
		* @return {File|null} The file 
		*/
		/*File */ getFile : function (name, folderName, recursive, verbose) {
			if (recursive == undefined)  recursive = false;
			if (verbose == undefined) verbose = false;
			if (folderName == undefined) {
				try {
					folderName  = app.activeScript.parent;
				} 
				catch (e) { 
					/* We're running from the ESTK*/
					folderName = File(e.fileName).parent;
				}
			}
			
			name =  name.replace (/file:\/\//, "");
			if (name == "") return null;
			var file =  File (folderName  + "/" + name);
			
			if (!file.exists && recursive) {
				var fileArray = this.getFilesRecursively (new Folder (folderName));
				for (var i = 0; i < fileArray.length; i++) {
					if (fileArray[i].name == name ) return fileArray[i];
					if (fileArray[i].displayName == name ) return fileArray[i];
				}
			}
			if (!file.exists &&  verbose) { 
				var file =  File.openDialog ("Bitte w‰hlen Sie die Datei [" + name  + "] aus");
				if (!file || !file.exists) {
					return null;
				}
			}		
			return file;
		},
		/**
		* Get Files Recursively
		* @param folder
		*/
		/* Array */ getFilesRecursively : function (folder, fileArray) {
			if (fileArray == undefined) fileArray = [];
			var children = folder.getFiles();
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child instanceof File) {
					fileArray.push(child);
				}
				else if (child instanceof Folder) {
					fileArray = this.getFilesRecursively (child, fileArray);
				}
				else {
					throw new Error("The object at \"" + child.fullName + "\" is a child of a folder and yet is not a file or folder.");
				}
			}
			return fileArray;
		},	
		/**
		* Reads a File and returns the String
		* @param {File} _file The File to read
		* @return {String} The content of the File or <b>false</b>
		*/
		readTextFile : function (_file, _encoding) {
			if (_file.constructor.name == "File" && _file.exists) {
				try {
					if (_encoding != undefined) _file.encoding = _encoding;
					_file.open("r");
					var _res = _file.read(); 
					_file.close();
					return _res;
				} catch (e) {return e}
			} 
			else {
				return Error ("This is not a File");
			}
		},
		/**
		* Writes a String to a File defaults to UTF-8 encoding
		* @param {File} _file The File
		* @param {String} string The String to write
		* @return {Bool} <b>true</b> everything worked fine, {Error} something went wrong
		*/
		writeTextFile : function (file, string, encoding) {
			if (encoding == undefined) {
				encoding = "UTF-8";
			}
			if (file.constructor.name == "String") {
				file = new File(file);
			}
			if (file.constructor.name == "File") {
				try {
					file.encoding = encoding;
					file.open( "w" );
					file.write (string);
					file.close ();
					return true;
				} catch (e) {
					return e;
				}
			} 
			else {
				return Error ("This is not a File");
			}
		},
		/**
		* Returns a File-Filter for a File-Dialog
		* @param {String} _ext The File Extension
		* @param {String} _string The Information Text 
		* @return {String|Function} The Filter String for Windows, the Filter Function for MacOS
		*/
		getFileFilter : function (_ext, _string) {
			if (File.fs == "Windows") {
				_ext =_ext.replace(/\*/g, "");
				_string =_string.replace(/:/g, "");
				var _filter = _string + ":*"+ _ext;
			} 
			else {
				function _filterFilesMac(file) {
					while (file.alias) {
						file = file.resolve();
						if (file == null) { return false }
					}
					if (file.constructor.name == "Folder") return true;
					var _extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
					if (_extension.indexOf (_ext) > -1 ) return true;
					else return false
				}
				var _filter = _filterFilesMac;
			} 
			return _filter;
		},
		/**
		* Loads XMP Library 
		* @return {Boolean} Result
		*/		
		loadXMPLibrary : function () {
			if ( !ExternalObject.AdobeXMPScript ){
				try {
					ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
				}
				catch (e) {
//~ 					alert("Unable to load the AdobeXMPScript library!"); 
					return false;
				}
			}
			return true;
		},
		/**
		* Unloads XMP Library 
		* @return {Boolean} Result
		*/
		unloadXMPLibrary : function () { 
			if( ExternalObject.AdobeXMPScript ) { 
				try { 
					ExternalObject.AdobeXMPScript.unload(); 
					ExternalObject.AdobeXMPScript = undefined; 
				}
				catch (e) {
//~ 					alert("Unable to unload the AdobeXMPScript library!"); 
					return false;
				}
			}
			return true;
		},
		/** Finds a PageItem By Name via allPageItems ...  
		* 	
		*/
		getPageItemByName : function (page, name) {
			for (var i = 0; i < page.allPageItems.length; i++) {
				if (page.allPageItems[i].name == name) return page.allPageItems[i];
			}
			return null;
		},
		/**
		* Distributes the columns of a table relatively to the available width. TODO add support for borders
		* @param {Table} table The table 
		* @param {Number} width The desired width
		* @return {void} 
		*/		
		distributeColumns  : function (table, width) {
			var tableWidth = table.width;
			for (var i = 0; i < table.columns.length; i++) {
					var col = table.columns[i];
					var ratio = col.width/tableWidth;
					col.width = ratio * width;
			}
		},	
		/**
		* Returns a PageItem by give CoordinateRange
		* @param {Page} page The page to search on
		* @param {Array} x The horizontal range, Array with two values 
		* @param {Array} y The vertical range, Array with two values 
		* @return {PageItem|null} The PageItem
		*/
		/*   */
		getPageItemsByCoord : function (page, x , y ) {
			for (var i = 0; i < page.pageItems.length; i++) {
				var pItem = page.pageItems[i];
				var x1 = pItem.geometricBounds[1];
				var y1 = pItem.geometricBounds[0];		
				if (x1 >= x[0] && x1 <= x[1] && y1 >= y[0] && y1 <= y[1]) {
					return pItem;
				} 
			}
			return null;
		},
	
		/* Finds a ParagraphStyle */
		getParagraphStyle : function  (styleName, groupName, fuzzy) {
			return this.getStyle(app.activeDocument, styleName, groupName, fuzzy, "Paragraph");
		},
		/* Finds a CharacterStyle*/
		getCharacterStyle : function (styleName, groupName, fuzzy) {
			return this.getStyle(app.activeDocument, styleName, groupName, fuzzy, "Character");
		},
		/* Finds an ObjectStyle */
		getObjectStyle : function (styleName, groupName, fuzzy) {
			return this.getStyle(app.activeDocument, styleName, groupName, fuzzy, "Object");
		},
	
		getStyle : function (dok, styleName, groupName, fuzzy, styleType) {
			if (groupName == undefined) groupName = false;
			if (fuzzy == undefined) fuzzy = false;
			
			if (!groupName) {
				// Passt genau
				if (styleType == "Paragraph" && dok.paragraphStyles.itemByName(styleName).isValid )  return dok.paragraphStyles.itemByName(styleName);
				if (styleType == "Character" && dok.characterStyles.itemByName(styleName).isValid )  return dok.characterStyles.itemByName(styleName);
				if (styleType == "Object" && dok.objectStyles.itemByName(styleName).isValid )  return dok.objectStyles.itemByName(styleName);
					if (fuzzy) {
					if (styleType == "Paragraph") var allStyles = dok.allParagraphStyles;
					if (styleType == "Character") var allStyles = dok.allCharacterStyles;
					if (styleType == "Object") var allStyles = dok.allObjectStyles;
					for (i =0; i < allStyles.length; i++) {
						if (compareStyleNames (allStyles[i].name, styleName)) return allStyles[i];
					}
				}
			}
			// Gruppe Ber¸chsichtigen
			else {
				if (styleType == "Paragraph" && dok.paragraphStyleGroups.itemByName(groupName).isValid ) {
					var styleGroup = dok.paragraphStyleGroups.itemByName(groupName);
					if (styleGroup.paragraphStyles.itemByName(styleName).isValid )  return styleGroup.paragraphStyles.itemByName(styleName);
				} 
				if (styleType == "Character" && dok.characterStyleGroups.itemByName(groupName).isValid ) {
					var styleGroup = dok.characterStyleGroups.itemByName(groupName);
					if (styleGroup.characterStyles.itemByName(styleName).isValid )  return styleGroup.characterStyles.itemByName(styleName);
				} 
				if (styleType == "Object" && dok.objectStyleGroups.itemByName(groupName).isValid ) {
					var styleGroup = dok.objectStyleGroups.itemByName(groupName);
					if (styleGroup.objectStyleGroups.itemByName(styleName).isValid )  return styleGroup.objectStyleGroups.itemByName(styleName);
				} 
			
				if (fuzzy) {
					if (styleType == "Paragraph") var allGroups = dok.paragraphStyleGroups;
					if (styleType == "Character") var allGroups = dok.characterStyleGroups;
					if (styleType == "Object") var allGroups = dok.objectStyleGroups;
					for (var i = 0;  i < allGroups.length; i++) {
						if (compareStyleNames (allGroups[i].name, groupName)) {
							if (styleType == "Paragraph") var allStyles = allGroups[i].paragraphStyles;
							if (styleType == "Character") var allStyles = allGroups[i].characterStyles;
							if (styleType == "Object") var allStyles = allGroups[i].objectStyles;

							for (var k = 0;  k < allStyles.length; k++) {
								if (compareStyleNames (allStyles[k].name, styleName)) return allStyles[k];
							}
						}
					}
					// Er war nicht in der Gruppe also gucken wir ob er irgendwo sonst aufzutreiben ist
					if (styleType == "Paragraph") var allStyles = dok.allParagraphStyles;
					if (styleType == "Character") var allStyles = dok.allCharacterStyles;
					if (styleType == "Object") var allStyles = dok.allObjectStyles;
					for (i =0; i < allStyles.length; i++) {
						if (compareStyleNames (allStyles[i].name, styleName)) return allStyles[i];
					}
				}
			}
			// Es konnte kein Format gefunden werden
			return null;
			// Helper 
			function compareStyleNames (name, compareName) {
				var cleanedCurrentStyleName = cleanStyleName(name);
				var cleanedPStyleName = cleanStyleName(compareName);
				if (cleanedCurrentStyleName.indexOf (cleanedPStyleName) > -1) return true;
				else return false;

				function cleanStyleName (stylename) {
					cleanName = stylename.toLowerCase();
					cleanName = cleanName.replace(/\s+/g,"");
					cleanName = cleanName.replace(/\(.+?\)/, "");
					cleanName = cleanName.replace(/_a\*$/, "");
					return cleanName;
				}
			}
		},
		/**
		* Calculate the leading, considers auto leading
		* @param {Text} Text Object
		* @return {Numer} leading in Point 
		*/
		getLeading : function (text) {
			var lineheight = 0;
			var lead = 0;

			if (text.leading == Leading.AUTO) {
				if (text.autoLeading !== 0) {
					lead = text.autoLeading / 100.0;
					lineheight = (text.pointSize * lead);
				}
			} 
			else if (text.leading !== 0) {
				lineheight = text.leading;
			}

			return lineheight;
		},

		/**
		* Pad a number widt leading zero
		* @param {String|Number} number  Startvalue
		* @param {Number} length The length of the String 
		* @param {String} fill The value to fill up, Default is '0'
		* @return {String} 
		*/
		pad : function (number, length, fill) { 
			if (fill == undefined) fill = "0";
				var str = '' + number;
				while (str.length < length) {
					str = fill + str;
				}   
				return str;
		},

		// Thanks @Marc Autret http://forums.adobe.com/message/3152162#3152162
		getProgressBar : function (title) { 
			var windowSUI = new Window('palette', ' '+title, {x:0, y:0, width:340, height:60});
			var  pb = windowSUI.add('progressbar', {x:20, y:12, width:300, height:12}, 0, 100);
			var st = windowSUI.add('statictext', {x:10, y:36, width:320, height:20}, '');
			st.justify = 'center';
			windowSUI.center();
			windowSUI.reset = function (msg, maxValue) {
				st.text = msg;
				pb.value = 0;
				pb.maxvalue = maxValue||0;
				pb.visible = !!maxValue;
				this.show();
			}
			 windowSUI.hit = function() {
				 ++pb.value;
			}
			return windowSUI;
		},
		/**
		* Reset Measurement Units to mm 
		* @return {Object} The old values
		*/
		resetDefaults : function() {
			var dok = app.documents[0];
			var oldValues = {
				horizontalMeasurementUnits:dok.viewPreferences.horizontalMeasurementUnits,
				verticalMeasurementUnits:dok.viewPreferences.verticalMeasurementUnits,
				viewPreferences:dok.viewPreferences.rulerOrigin,
				zeroPoint:dok.zeroPoint,
				textDefaultParStyle:dok.textDefaults.appliedParagraphStyle,
				textDefaultCharStyle:dok.textDefaults.appliedCharacterStyle,
				transformReferencePoint:dok.layoutWindows[0].transformReferencePoint
			}		
			dok.textDefaults.appliedCharacterStyle = dok.characterStyles[0];
			dok.textDefaults.appliedParagraphStyle = dok.paragraphStyles[1];
//~ 	px.idDocument.pageItemDefaults.appliedGraphicObjectStyle
//~ 	px.idDocument.pageItemDefaults..appliedGridObjectStyle
//~ 	px.idDocument.pageItemDefaults..appliedTextObjectStyle		
			dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
			dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
			dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
			dok.zeroPoint = [0,0];
			dok.layoutWindows[0].transformReferencePoint = AnchorPoint.TOP_LEFT_ANCHOR;
			return oldValues;
		},
		/**
		* Set Measurement as given in values
		* @return {Object} The old values
		*/
		setDefaults : function(values) {
			var dok = app.documents[0];
			dok.viewPreferences.horizontalMeasurementUnits = values.horizontalMeasurementUnits;
			dok.viewPreferences.verticalMeasurementUnits = values.verticalMeasurementUnits;
			dok.viewPreferences.rulerOrigin = values.viewPreferences;
			dok.zeroPoint = values.zeroPoint;
			dok.textDefaults.appliedParagraphStyle = values.textDefaultParStyle;
			dok.textDefaults.appliedCharacterStyle = values.textDefaultCharStyle;
			dok.layoutWindows[0].transformReferencePoint = values.transformReferencePoint;

		},
		trim : function (string) {
			string = string.replace(/^\s+/g,"");
			string = string.replace(/\s+$/g,"");
			return string;
		},
		
		/**
		* Rounds to a given Number of decimal, default = 2
		* @param {Number} value Number tor round
		* @param {Number} decimals Number of decimal place
		* @return {Number} The rounded value
		*/
		roundToDecimal : function (value, decimals) {
			if (!decimals) decimals = 2;
			return Math.round( value*Math.pow(10, decimals)) / Math.pow(10, decimals);
		},
		/**
		* Recursively remove XML-Tags 
		* @param {XMLElement} xmlElement The XML-Element to start from 
		*/
		untag : function (xmlElement) {
			while(xmlElement.xmlElements.length > 0) {
				xmlElement.xmlElements[-1].untag();
			}
		}	
	}
}();

/**
* Hashmap for JavaScript
* @class <b>idsMap</b> implements a straightforward HashMap based on <a href="http://www.mojavelinux.com/articles/javascript_hashes.html">http://www.mojavelinux.com/articles/javascript_hashes.html</a> by Dan Allen.<br/><br/><code>#include "idsHelper.jsx"<br/>[...]<br/>var _map = idsMap();<br/>_map.pushItem ("key1", "value1");<br/>_map.getItem ("key1");</code>
 * @property {number} length The number of items in the map.
*/	 
var idsMap = function () {
	return { 
		length : 0,
		items : [],
		/**
		* Remove an entry
		* @param {String} _key The key 
		* @return {Object} The removed value
		*/		
		removeItem : function(_key) {
			var _previous;
			if (typeof(this.items[_key]) != 'undefined') {
				this.length--;
				var _previous = this.items[_key];
				delete this.items[_key];
			}
			return _previous;
		},

		/**
		* Get an entry
		* @param {String} _key The key 
		* @return {Object} The value
		*/		
		getItem : function(_key) {
			return this.items[_key];
		},

		/**
		* Push an entry
		* @param {String} _key The (new) key 
		* @param {String} _key The new value 
		* @return {Object} The previous value (if any) or undefined
		*/		
		pushItem : function(_key, _value) {
			var _previous;
			if (typeof(_value) != 'undefined') {
				if (typeof(this.items[_key]) == 'undefined') {
					this.length++;
				}
				else {
					_previous = this.items[_key];
				}
				this.items[_key] = _value;
			}
			return _previous;
		},

		/**
		* Test if the map has an entry
		* @param {String} _key The key 
		* @return {Bool} <b>true</b> everything worked fine, <b>false</b> something went wrong
		*/
		hasItem : function(_key) {
			return typeof(this.items[_key]) != 'undefined';
		},

		/**
		* Removes every entry in the map
		*/
		clear : function() {
			for (var i in this.items) {
				delete this.items[i];
			}
			this.length = 0;
		}
	}
}



/****************
* Logging Class 
* @Version: 0.96
* @Date: 2017-02-24
* @Author: Gregor Fellenz, http://www.publishingx.de
* Acknowledgments: Library design pattern from Marc Aturet https://forums.adobe.com/thread/1111415

* Usage: 

log = idsLog.getLogger("~/Desktop/testLog.txt", "INFO");
log.warnAlert("Warn message");

*/
$.global.hasOwnProperty('idsLog') || ( function (HOST, SELF) {
	HOST[SELF] = SELF;

	/****************
	* PRIVATE
	*/
	var INNER = {};
	INNER.version = "2017-02-24-0.96"
	INNER.disableAlerts = false;
	INNER.logLevel = 0;
	INNER.SEVERITY = [];
	INNER.SEVERITY["OFF"] = 4;
	INNER.SEVERITY["ERROR"] = 3;
	INNER.SEVERITY["WARN"] = 2;
	INNER.SEVERITY["INFO"] = 1;
	INNER.SEVERITY["DEBUG"] = 0;

	INNER.writeLog = function(msg, severity, file) { 
		if (msg == undefined) {
			msg = ""; // return ?
		}
		if (( msg instanceof Error) ) {
			msg =  msg + " -> " + msg.line
		}
		if (msg.constructor.name != String) {
			msg = msg.toString();
		}	
		var date = new Date();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();		
		var dateString = (date.getYear() + 1900) + "-" + ((month < 10)  ? "0" : "") + month + "-" + ((day < 10)  ? "0" : "") + day + " " +  ((hour < 10)  ? "0" : "") + hour+ ":" +  ((minute < 10)  ? "0" : "") + minute+ ":" + ((second < 10)  ? "0" : "") + second;
		var padString = (severity.length == 4) ? " " : ""
		msg = msg.replace(/\r|\n/g, '<br/>');
		file.encoding = "UTF-8";
		file.open("a");
		if (INNER.logLevel == 0) {
			var stack = $.stack.split("\n");
			stack = stack[stack.length - 4];		
			file.writeln(dateString + " [" + severity + "] " +  padString + "[" + msg + "] Function: " + stack.substr (0, 100));		
		} else {
			file.writeln(dateString + " [" + severity + "] " + padString + "[" + msg + "]");					
		}
		file.close();
	};
	INNER.showAlert = function(title, msg){
		if (!INNER.disableAlerts) {
			if (msg.length < 300) {
				alert(msg, title) 
			}
			else {
				INNER.showMessages(title, [msg]);
			}
		}
	};
	INNER.showMessages = function(title, msgArray) { 
		if (!INNER.disableAlerts && msgArray.length > 0) {
			var callingScriptVersion = "    ";
			if ($.global.hasOwnProperty ("px") && $.global.px.hasOwnProperty ("projectName")  ){
				callingScriptVersion += px.projectName;
			} 
			if ($.global.hasOwnProperty ("px") && $.global.px.hasOwnProperty ("version")  ){
				callingScriptVersion += " v" + px.version;
			} 
			var msg = msgArray.join("\n\n");
			var dialogWin = new Window ("dialog", title + callingScriptVersion);
			dialogWin.etMsg = dialogWin.add ("edittext", undefined, msg, {multiline: true, scrolling: true});
			dialogWin.etMsg.maximumSize.height = 300;
			dialogWin.etMsg.minimumSize.width = 400;
						
			dialogWin.gControl = dialogWin.add("group");
			dialogWin.gControl.preferredSize.width = 400;
			dialogWin.gControl.alignChildren = ['right', 'center'];
			dialogWin.gControl.margins = 0;								
			dialogWin.gControl.btSave = null;
			dialogWin.gControl.btSave = dialogWin.gControl.add ("button", undefined, localize({en:"Save",de:"Speichern"}));
			dialogWin.gControl.btSave.onClick = function () {
				var texFile = File.openDialog();
				if (texFile) {
					if (! texFile.name.match (/\.txt$/)) {
						texFile = File(texFile.fullName + ".txt");
					}
					texFile.encoding = "UTF-8";
					texFile.open("e");
					texFile.writeln(msg);					
					texFile.close();
					dialogWin.close();
				}
			}
			dialogWin.gControl.add ("button", undefined, "Ok", {name: "ok"});
			
			dialogWin.show ();			
			
		}
	};

    /****************
    * API 
    */

    /**
    * Returns a log Object
    * @logFile {File|String} Path to logfile as File Object or String.
    * @logLevel {String} Log Threshold  "OFF", "ERROR", "WARN", "INFO", "DEBUG"
    * @disableAlerts {Boolean} Show alerts
    */
	SELF.getLogger = function(logFile, logLevel, disableAlerts) {
		if (logFile == undefined) {
			throw Error("Cannot instantiate Log without Logfile. Please provide a File");
		}
		if (logFile instanceof String) {
			logFile = File(logFile);
		}
		if (! (logFile instanceof File)) {
			throw Error("Cannot instantiate Log. Please provide a File");
		}
		if (logLevel == undefined) {
			logLevel = "INFO";			
		}
		if (disableAlerts == undefined) {
			disableAlerts = false;
		}

		INNER.logLevel = INNER.SEVERITY[logLevel];
		INNER.disableAlerts = disableAlerts;
	
		var counter = {
			debug:0,
			info:0,
			warn:0,
			error:0
		}
		var messages = {
			info:[],
			warn:[],
			error:[],
		}

		return {
			/**
			* Writes a debug log message
			* @message {String} message Message to log.
			*/
			writeln : function (message) {
				if (px && px.hasOwnProperty ("debug") && px.debug) {
					$.writeln(message);
				}
				if (INNER.logLevel == 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},			
			/**
			* Writes a debug log message
			* @message {String} message Message to log.
			*/
			debug : function (message) {
				if (INNER.logLevel == 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},
			/**
			* Writes a info log message
			* @message {String} message Message to log.
			*/
			info : function (message) {
				if (INNER.logLevel <= 1) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
				}
			},
			/**
			* Writes a info log message und displays an Alert-Window
			* @message {String} message Message to log.
			*/
			infoAlert : function (message) {
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
					INNER.showAlert ("[INFO]", message);
				}
			},
			/**
			* Writes a warn log message
			* @message {String} message Message to log.
			*/
			warn : function (message) {
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile);
					counter.warn++;
					messages.warn.push(message);
				} 
			},
			/**
			* Writes a warn log message und displays an Alert-Window
			* @message {String} message Message to log.
			*/
			warnAlert : function (message) {
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile); 
					counter.warn++;
					messages.warn.push(message);
					INNER.showAlert ("[WARN]", message + "\n\nPrüfen Sie auch das Logfile:\n" + logFile);
				}
			},
			/**
			* Writes a error log message
			* @message {String} message Message to log.
			*/
			error : function (message) {
				if (INNER.logLevel <= 3) {
					INNER.writeLog(message, "ERROR", logFile); 
					counter.error++;
					messages.error.push(message);
				}
			},

			/**
			* Shows all warnings
			*/
			showWarnings : function () {
				INNER.showMessages("Es gab " + counter.warn + " Warnmeldungen", messages.warn);
			},
			/**
			* Returns all warnings
			*/
			getWarnings : function () {
				return messages.warn.join("\n");
			},
			/**
			* Shows all infos
			*/
			showInfos : function () {
				INNER.showMessages("Es gab " + counter.info + " Infos", messages.info);
			},
			/**
			* Returns all infos
			*/
			getInfos : function () {
				return messages.info.join("\n");
			},
			/**
			* Shows all errors
			*/
			showErrors : function () {
				INNER.showMessages("Es gab " + counter.error + " Fehler", messages.error);
			},
			/**
			* Returns all errors
			*/
			getErrors : function () {
				return messages.error.join("\n");
			},
			/**
			* Returns the counter Object
			*/
			getCounters : function () {
				return counter;
			},


			/**
			* Set silent Mode
			* @message {Boolean} true will not show alerts!
			*/
			disableAlerts : function (mode) {
				INNER.disableAlerts = mode;
			},

			/**
			* Clear Logfile and counters
			*/
			clearLog : function () {                
				logFile.open("w");
				logFile.write("");
				logFile.close();
				counter.debug = 0;
				counter.info = 0;
				counter.warn = 0;
				counter.error = 0;
				messages.info = [];
				messages.warn = [];
				messages.error = [];
			},

			/**
			* Shows the log file in the system editor
			*/
			showLog : function () {
				logFile.execute();
			}
		} 
	};
}) ( $.global, { toString : function() {return 'idsLog';} } );
}


if ( ! $.global.hasOwnProperty('idsTesting') ) {
	createBacklinks();
}

// Environment checking and startup
function createBacklinks() {
	if (app.documents.length == 0) {
		return;
	}

	if (parseInt(app.version) < 7) {
		alert(localize(px.ui.versionWarning));
		return;
	}
	
	var dok = app.documents[0];
	if (dok.stories.length == 0) {
		alert(localize(px.ui.noTextInDoc)); 
		return;
	}

	initLog();

	var endnoteStory = getEndnoteStoryForBacklinkCreation(dok);
	if (endnoteStory == null) {
		return;
	}

	if (px.showGui) {
		if ( !confirm ("Nach der Konvertierung können die Endnoten nicht mehr per Skript erweitert/verändert werden!\nFortfahren?") ) {
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

	var newFileName = File (dok.fullName.parent + "/" + dok.name.replace(/\.indd/, "") + "_MANUELL_NUMMERIERT.indd");
	dok.save (newFileName);
	    
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

/* Returns a valid endnote story for processing or null*/
function getEndnoteStoryForBacklinkCreation(dok) {
	// Check for valid stories
	var endnoteStory = null;
	var footnoteStories = [];
	var endnoteStoryMap = idsMap();
	var hlinkStoryMap = idsMap();
	for (var k = 0; k < dok.hyperlinks.length; k++) {
		var hlink = dok.hyperlinks[k];
		if ( hlink.extractLabel(px.hyperlinkLabel) == "true" && hlink.destination && hlink.destination.destinationText.parentStory.isValid ) {
			hlinkStoryMap.pushItem(hlink.destination.destinationText.parentStory.id, "true");
		}
	}
	
	for (var i = 0; i < dok.stories.length; i++) {
		story = dok.stories[i];
		if (story.footnotes.length > 0 ) {
			footnoteStories.push(story);
		}
		if ( hlinkStoryMap.getItem(story.id) == "true") {
			endnoteStoryMap.pushItem(story.id, story);
			endnoteStory = story;
		}
	}

	// Die einfachen Fälle 
	if (endnoteStoryMap.length > 1) {
		alert(localize(px.ui.multipleEndnoteLinks)); 
		return null;
	}
	if (endnoteStoryMap.length != 1) {
		alert(localize(px.ui.unknownSelectionError)); 
		return null;
	}
	return endnoteStory;
} 


// Main Script 
function foot2manual (dok, endnoteStory) {
	log.info("Run footnote to manual numbering conversion with version " + px.version);
	// Styles einsammeln 
	for (var i = 0; i < dok.allParagraphStyles.length; i++) {
		var style = dok.allParagraphStyles[i];
		if (style.name == px.pStyleEndnoteName)  {
			px.pStyleEndnote = style;			
		}
		else if (style.name == px.pStyleEndnoteFollowName)  {
			px.pStyleEndnoteFollow = style;
		}
		else if (style.name == px.pStyleEndnoteSplitHeadingName) {
			px.pStyleEndnoteSplitHeading = style;			
		}				
		else if (style.name == px.pStyleEndnoteSplitHeadingPrecedingName) {
			px.pStyleEndnoteSplitHeadingPreceding = style;			
		}				
		else if (style.name == px.pStyleEndnoteSplitHeadingFollowingName) {
			px.pStyleEndnoteSplitHeadingFollowing = style;			
		}	
		else if (style.name == px.pStyleFootnoteIgnoreName) {
			px.pStyleFootnoteIgnore = style;			
		}
		else if (style.name == px.pStyleEndnoteSplitHeadingPrecedingRepeatName) {
			px.pStyleEndnoteSplitHeadingPrecedingRepeat = style;			
		}				
		else if (style.name == px.pStyleEndnoteSplitHeadingFollowingRepeatName) {
			px.pStyleEndnoteSplitHeadingFollowingRepeat = style;
		}	
		else if (style.name == px.pStyleEndnoteHeadingName) {
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


	fixHyperlinks(dok); // Fix broken Links before processing

	checkStyles(dok);

	var hLinksPerStory = getCurrentEndnotes(dok, endnoteStory);
	if (!hLinksPerStory) {
		return;
	}

	var endnoteBlock = getEndnoteBlock(endnoteStory, dok, true);
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
	app.findGrepPreferences.findWhat = "^.+?\\t";

	var createList = []

	for (var i = dok.hyperlinks.length - 1; i >= 0; i--) {
		var hlink = dok.hyperlinks[i];
		if (hlink.extractLabel(px.hyperlinkLabel) == "true" && hlink.destination && hlink.destination.destinationText) {
			if (! hlink.destination instanceof ParagraphDestination ) {
				log.warn(localize (px.ui.couldNotCreateBacklink, hlink.name) ); 
				continue;
			}
			var hlinkPar = hlink.destination.destinationText.paragraphs[0];
			var numberingText = hlinkPar.findGrep()[0];
			if (numberingText) {
				numberingText = numberingText.characters.itemByRange(1,numberingText.characters.length-1);
				
				var endnote_backlink = dok.hyperlinkTextDestinations.add (hlink.source.sourceText.insertionPoints[0]);
				endnote_backlink.insertLabel(px.hyperlinkLabel, "backlink");			
				
				hyperlinkTextSource = dok.hyperlinkTextSources.add(numberingText);			
				hyperlinkTextSource.insertLabel(px.hyperlinkLabel, "backlink");
				createList.push([hyperlinkTextSource, endnote_backlink]);
			}
			else  {
				log.warn(localize (px.ui.couldNotCreateBacklink, hlink.name) ); 
			}
		}
	}
	
	for (var x = 0; x < createList.length; x++) {
		var hlink = dok.hyperlinks.add (createList[x][0], createList[x][1], {visible: false});
		hlink.name = "EndnoteBacklink_" + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + new Date().getTime();
		hlink.insertLabel(px.hyperlinkLabel, "backlink");
		px.foot2EndCounter++;
	}




}

/* find the textrange with endnotes */
function getEndnoteBlock (endnoteStory, dok, alertMessage) {
	if (alertMessage == undefined) alertMessage = true;
	var endnotenStartEndPositions = getCurrentEndnotes(dok, endnoteStory);
	var startOfTextRange = endnoteStory.characters[-1].index;
	var endOfTextRange = endnoteStory.characters[-1].index;
	
	if (endnotenStartEndPositions.length > 0) {
		startOfTextRange = endnotenStartEndPositions[1].destinationIndexArray[0];
		// In -1 befindet sich die Dummy Endnote!
		var endBlockIndex = endnotenStartEndPositions[endnotenStartEndPositions.length - 2].destinationIndexArray[0];
		endOfTextRange = endnoteStory.characters[endBlockIndex].paragraphs[0].characters[-1].index;
	} 
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.findWhat = px.endnoteHeadingString;
	app.findGrepPreferences.appliedParagraphStyle =px.pStyleEndnoteHeading	
	if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
		app.findChangeGrepOptions.searchBackwards = false;
	}	
	var results = endnoteStory.findGrep();
	
	if (results.length == 1) {
		startOfTextRange = results[0].index;
	}
	else if (results.length > 1) {
		startOfTextRange = results[0].index;
		if (alertMessage) {
			log.warn (localize (px.ui.headingStyleFailBlockMoreThanOne, px.endnoteHeadingString, px.pStyleEndnoteHeading.name ));
		}
	}
	else {
		if (alertMessage) {
			log.warn (localize (px.ui.headingStyleFailBlock, px.endnoteHeadingString, px.pStyleEndnoteHeading.name ));
		}
	}
	
	return endnoteStory.characters.itemByRange(startOfTextRange, endOfTextRange).getElements()[0]
}

function getCurrentEndnotes(dok, endnoteStory) {
	// Die aktuellen Endnoten einsammeln
	var hLink, j, sourceText, destinationText;
	var hLinksPerStory = [{
						hLink:null,
						hLinkID:"first",
						sourceIndexArray:[-1],
						destinationIndexArray:[-1],
						destinationContents:"Dummy Endnote Postion Start"
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
					log.info( localize(px.ui.missingHyperlinkDestination, hLink.id) );
					continue;
				}
			
				sourceText = hLink.source.sourceText;
				sourceIndex =  getIndexInStory(sourceText);
				
				destinationText = hLink.destination.destinationText;
				destIndex = getIndexInStory(destinationText);
				destinationTextContents = getShortText(destinationText);				
				log.debug("hLink.id : " + hLink.id + " -> " + sourceIndex + " sourceText: " + sourceText.contents + " destinationText: " +  destinationTextContents);
				// [hLink.id, sourceIndex, destIndex, destPar.contents]
				hLinksPerStory.push( {
					hLink:hLink,
					hLinkID:hLink.id,
					sourceIndexArray:sourceIndex,
					destinationIndexArray:destIndex,
					destinationContents: destinationTextContents
				});
			} catch (e) {
				log.warn("Fehler bei der Verarbeitung der Hyperlinks, Hyperlinks sind eventuell nicht mehr gültig?\n" + e);
			}
		}
	}
	// Endnoten nach Position in der Story sortieren	
	hLinksPerStory.sort(sortSourceIndexArray);

	hLinksPerStory.push({
						hLink:null,
						hLinkID:"last",
						sourceIndexArray:[endnoteStory.insertionPoints[-1].index],
						destinationIndexArray:[endnoteStory.insertionPoints[-1].index],
						destinationContents:"Dummy Endnote Postion End"
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
			log.warn(localize (px.ui.wrongEndnoteOrder, hLinksPerStory[m].destinationContents));
			idsTools.showIt(hLinksPerStory[m].hLink.destination.destinationText);
			return null;
		}
	}
	
	return hLinksPerStory;
}


function getIndexInStory(sourceText) {
	var indexArray = []
	indexArray[0] = sourceText.index;
	while ( sourceText.parent instanceof Cell || 
				( sourceText.parentTextFrames.length > 0 && sourceText.parentTextFrames[0].parent instanceof Character ) ) {
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
		if (hLink.destination == null) {
			if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
				log.warn(localize (px.ui.hyperlinkProblemDestination, hLink.name, hLink.source.sourceText.contents, idsTools.getPageNameByObject(hLink.source.sourceText)));
			}
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
function sortFootnotesByIndexArray(a,b) {
	var a = getIndexInStory(a.storyOffset);
	var b = getIndexInStory(b.storyOffset);
	var c = 0;
	while ( a[c+1]  != undefined && b[c+1]  != undefined && a[c] == b[c]) {
		c++;
	}
	return b[c] - a[c] ;
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
