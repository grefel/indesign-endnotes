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
//DESCRIPTION: Delete a endnotes 
@Date: 2016-15-01
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
@Version: 2
@Date: 2016-06-21
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
		emptyEndnotePar:{en:"%1 empty Pargraph(s) with endnote format [%2]. Please delete or assign another format.", de:"%1 Absätze ohne Inhalt sind mit dem Format [%2] ausgezeichnet. Bitte weisen Sie ein anderes Format zu oder löschen Sie die Absätze."},	
		// createEndnotes.jsx		
		menuTitle:{en:"Convert footnotes to endnotes v%1", de:"Fußnoten zu Endnoten konvertieren v%1"},		
		resultInfo:{en:"[%1] footnotes converted to endnotes!", de:"Es wurden [%1] Fußnoten zu Endnoten konvertiert!"},
		
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
		
		
		methodPanel:{en:"Mode",de:"Verarbeitungsmodus"},
		splitByHeading:{en:"Split by paragraph style",de:"Anhand von Absatzformat trennen (Bildet Abschnitte für Kapitel)"},
		continuousNumbering:{en:"Continuous numbering",de:"Fortlaufend nummerieren (Alle Endnoten in einem Abschnitt)"},
		manualNumbering:{en:"Manual numbering of endnotes",de:"Manuelle Nummerierung der Endnoten"},
		manualNumberingInfo:{en:"Links only the counter. Use this if you need to process hyperlinks in endnotes. The list function in endnote paragraph style will be disabled.",de:"Verlinkt nur die Ziffer im Endnotenabsatz. Für Hyperlinks in Endnoten sollte diese Option ausgewählt sein. Die Listenfunktion im Absatzformat wird deaktviert."},
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
		newPagesAdded:{en:"There were %1 pages added. Please check the document", de:"Es wurden %1 Seiten hinzugefügt. Bitte prüfen Sie den Umfang"},
		positionFail:{en:"There was an error in the endnote position analysis!\Please contact support!", de:"Es ist ein Fehler bei der Endnotenpositionsanalyse aufgetreten!\nBitte kontaktieren Sie den Support!"},		
		samePStyle:{en:"The paragraph format [%1] was also selected for the followup paragraphs, this could lead to numbering errors! The format has been duplicated.", de:"Das Absatzformat [%1] wurde auch für die Folgeabsätze ausgewählt, dies führt ggf. zu Nummerierungsfehlern! Das Format wurde dupliziert."},
		endnoteStyleNumberingFail:{en:"In paragraph style [%1] the option [Bullets and Numbering] -> [List Type : Numbes ] was activated.", de:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] aktiviert."},
		crossrefFormatFail:{en:"The cross-reference format [%1] already exists.\nThe selected different character style [%2] was set!", de:"Das Querverweisformat [%1] ist bereits vorhanden.\nDas ausgewählte aber abweichende Zeichenformat [%2] wurde eingestellt!"},
		endnoteStyleNumberingDeactivate:{en:"In Paragraph Style [%1] the option \n[Bullets and Numbering] -> [List Type : Numbes ] was deactivated.", de:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] deaktiviert."},
		headingFail:{en:"For the title at least one character must be entered.",de:"Für den Titel muss mindestens ein Zeichen eingegeben werden."},
		styleSelectionFail:{en:"Error in the format selection", de:"Fehler bei der Formatauswahl"},
		styleSelectionFailSection:{en:"Error in the format selection of the section creation.", de:"Fehler bei der Formatauswahl für die Abschnittsbildung"},
		endnoteStoryMoved:{en:"Text and endnotes must be in the same Story\nPlease copy the endnote text to the end of the text portion", de:"Text und Endnoten müssen sich im gleichen InDesign Textabschnitt befinden!\nBitte kopieren Sie den Endnoten-Text an das Ende des Textabschnitts."},
		manualNumberingFail:{en:"Could not create manual numbering, did not find number at start", de:"Konnte die manuelle Nummerierung nicht erstellen. Die Aufzählung zu Beginn konnte nicht ermittelt werden."},       
		wrongNumberingExpression:{en:"Changed numbering format of [%1] to [^#^t].", de:"Das Nummerierungsformat für das Absatzformat [%1] wurde auf [^#^t] geändert."},

		// deleteEndnotes.jsx
		noEndnoteOrMarker:{en:"The insertion point must be placed within an endnote or before the endnote marker.", de:"Die Einfügemarke muss innerhalb einer Endnote oder vor dem Endnotenmarker platziert sein."},
		deleteEndnoteName:{en:"Remove endnote",de:"Endnote entfernen"},
		confirmEndnoteDelete:{en:"Remove Endnote %1 \n\n%2",de:"Endnote löschen %1 \n\n%2"},

	},



	// Careful with changes below, changing options might break the update process of previously converted documents
	createBackupCopy:true,
	backupCopySuffix:"_endnoteBackupt.indd",
	
	numberBySection:true,
	manualNumbering:true,
	manualNumberingLabel:"px:Foot2EndnoteManualNumbering",
	
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
	scriptMajorVersion:"2",
	
	foot2EndCounter:0,
	debug:false,
	showGui:true,
	logFileName:"endnoteLog.txt",
	ids:undefined,
	version:"2.0-2016-06-24"
}

// Debug Einstellungen publishingX 
if (app.extractLabel("px:debugID") == "Jp07qcLlW3aDHuCoNpBK_Gregor-") {
	px.debug = true;
	px.showGui = true;
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
						case XMLElement : if (_object.insertionPoints[0] != null) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
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
						case XMLElement : if (_object.insertionPoints[0] != null) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
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
			frame.geometricBounds = [gb[0], gb[1], gb[0] + width, gb[1] + width];
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
		//~ 	$.writeln("Versahlhöhe ist: " + _versalHoehe);
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
		* Fits an two or more column TextFrame.
		* @param {Story} _tf The TextFrame
		* @param {Number} [_step] The step size in current MeasurementUnits, defaults to 1
		* @return {Bool} <b>true</b> everything worked fine, <b>false</b> cannot fit the TextFrame - too big?
		*/
		fitTextFrame : function (_tf, _step) {
			try {
				if (_step == undefined) _step = 1
				while (_tf.overflows) {
					var _bounds = _tf.geometricBounds;
					_tf.geometricBounds = [_bounds[0],_bounds[1],_bounds[2] + _step,_bounds[3]];
				}
			} catch (e) {
				return false;		
			}
			return true;
		},

		
		/**
		* Removes all TextFrame but first from a Story.
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
				a = a.replace(/ä/g,"a");
				a = a.replace(/ö/g,"o");
				a = a.replace(/ü/g,"u");
				a = a.replace(/ß/g,"s");	
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
				var file =  File.openDialog ("Bitte wählen Sie die Datei [" + name  + "] aus");
				if (!file || !file.exists) {
					return null;
				}
			}
			else {
				return null;
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
		* Writes a String to a UTF-8 encoded File
		* @param {File} _file The File
		* @param {String} _string The String to write
		* @return {Bool} <b>true</b> everything worked fine, {Error} something went wrong
		*/
		writeTextFile : function (_file, _string) {
			if (_file.constructor.name == "String") {
				_file = new File(_file);
			}
			if (_file.constructor.name == "File") {
				try {
					_file.encoding = "UTF-8";
					_file.open( "w" );
					_file.write (_string);
					_file.close ();
					return true;
				} catch (e) {return e}
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
			// Gruppe Berüchsichtigen
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
* @Version: 0.91
* @Date: 2016-03-30
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
	INNER.version = "2016-03-30--0.91"
	INNER.disableAlerts = false;
	INNER.SEVERITY = [];
	INNER.SEVERITY["OFF"] = 4;
	INNER.SEVERITY["ERROR"] = 3;
	INNER.SEVERITY["WARN"] = 2;
	INNER.SEVERITY["INFO"] = 1;
	INNER.SEVERITY["DEBUG"] = 0;

	INNER.writeLog = function(msg, severity, file) { 
		file.encoding = "UTF-8";
		file.open("a");
		var stack = $.stack.split("\n");
		stack = stack[stack.length - 4];		
		file.writeln(Date() + " [" + severity + "] " + ((severity.length == 4) ? " [" : "[") + msg + "] Function: " + stack);		
		file.close();
	};
	INNER.showAlert = function(msg){
		if (!INNER.disableAlerts) {
			alert(msg) 
		}
	};
	INNER.showMessages = function(title, msgArray) { 
		if (!INNER.disableAlerts) {						
			msg = msgArray.join("\n");			
			var w = new Window ("dialog", title);
			var list = w.add ("edittext", undefined, msg, {multiline: true, scrolling: true});
			list.maximumSize.height = 300;
			list.minimumSize.width = 400;
			w.add ("button", undefined, "Ok", {name: "ok"});
			w.show ();
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
		logLevel = (logLevel == undefined) ? 0 : INNER.SEVERITY[logLevel];

		if (disableAlerts == undefined) {
			INNER.disableAlerts = false;
		}
		else {
			INNER.disableAlerts = disableAlerts;
		}

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
			debug : function (message) {
				if (logLevel <= 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},
			/**
			* Writes a info log message
			* @message {String} message Message to log.
			*/
			info : function (message) {
				if (logLevel <= 1) {
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
				if (logLevel <= 2) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
					INNER.showAlert ("[INFO]\n" + message);
				}
			},
			/**
			* Writes a warn log message
			* @message {String} message Message to log.
			*/
			warn : function (message) {
				if (logLevel <= 2) {
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
				if (logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile); 
					counter.warn++;
					messages.warn.push(message);
					INNER.showAlert ("[WARN]\n" + message + "\n\nPrüfen Sie auch das Logfile:\n" + logFile);
				}
			},
			/**
			* Writes a error log message
			* @message {String} message Message to log.
			*/
			error : function (message) {
				if (logLevel <= 3) {
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
	
	var logFile = File ( getScriptFolderPath() + "/" + px.logFileName );
	initLog(logFile);
	
	
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

	getStyleInformation (dok);
	readStylesSilent (dok) ;
	
	if (!remove()) {
		alert(localize(px.ui.noEndnoteOrMarker));
	}
	else {
		if (px.manualNumbering ) { 
			// Reset manual numbering
			// Nummerierung wieder aktivieren 
			var endnoteStory = app.selection[0].parentStory;
			endnoteBlock = getEndnoteBlock(endnoteStory, dok, false);

			app.findGrepPreferences = NothingEnum.NOTHING;
			app.changeGrepPreferences = NothingEnum.NOTHING;

			for (var h = dok.hyperlinks.length - 1; h >= 0; h--) {
				hlink = dok.hyperlinks[h];
				if (hlink.destination != null && hlink.source != null &&  hlink.extractLabel(px.hyperlinkLabel) == "backlink") {
					if (hlink.source.sourceText.parentStory.id == endnoteStory.id) {					
						// 1. backlink auf den ganzen Absatz legen 
						var endnoteSource = hlink.source.sourceText.paragraphs[0];					
						if (endnoteSource.findHyperlinks().length > 1) {
							var checkIndex = endnoteSource.index;
							while (endnoteStory.characters[checkIndex].isValid &&
							endnoteStory.characters[checkIndex].contents﻿ != SpecialCharacters.END_NESTED_STYLE) {
								checkIndex++;
							}						
							endnoteSource = endnoteStory.characters[checkIndex+1];
						}
						if (endnoteSource.findHyperlinks().length > 1) {
							endnoteSource = hlink.source.sourceText.paragraphs[0];
							endnoteSource = endnoteSource.characters[-1];
							log.warnAlert(localize (px.ui.hyperlinkAlreadyExists, endnoteSource.contents.substring(0,20)))
						}
						try {
							hlink.source.sourceText = endnoteSource;
						}
						catch (e) {
								log.warnAlert(localize (px.ui.hyperlinkAlreadyExists, endnoteSource.contents.substring(0,20)))
						}
						// 2. Nummerierung löschen 
						var st = hlink.source.sourceText.paragraphs[0];
						var deleteIndex = st.index;					
						try {
							while (endnoteStory.characters[deleteIndex].isValid && endnoteStory.characters[deleteIndex].contents﻿ != SpecialCharacters.END_NESTED_STYLE) {
								if (endnoteStory.characters[deleteIndex].contents == "\uFEFF") {
									deleteIndex++;
								}
								else {
									endnoteStory.characters[deleteIndex].contents = "";
								}
							}
							endnoteStory.characters[deleteIndex].contents = "";						
						} catch (e) {}
					}
				}
			}			

			checkStyles(dok);
			
			var endnoteBlock = getEndnoteBlock(endnoteStory, dok, false);
		
			// Marker (End nested style here) insertion for CrossRefFormat
			app.findGrepPreferences = NothingEnum.NOTHING;
			app.changeGrepPreferences = NothingEnum.NOTHING;
			app.findGrepPreferences.findWhat = "(.|\\n)+";
			app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
			app.changeGrepPreferences.changeTo = "~h$0";
			endnoteBlock.changeGrep();

			px.crossRefStyleEndnote.buildingBlocks[0].blockType = BuildingBlockTypes.FULL_PARAGRAPH_BUILDING_BLOCK;
			px.crossRefStyleEndnote.buildingBlocks[0].appliedDelimiter = ""; // ~h End nested style here
			px.crossRefStyleEndnote.buildingBlocks[0].includeDelimiter = false;

			endnoteBlock.convertBulletsAndNumberingToText ();
			px.pStyleEndnote.bulletsAndNumberingListType = ListType.NO_LIST;			
			
			
			app.findGrepPreferences = NothingEnum.NOTHING;
			app.changeGrepPreferences = NothingEnum.NOTHING;
			app.findGrepPreferences.findWhat = "^.+~h";

			// Vorhandene Backlinks wieder zurück auf die Nummerierung legen 
			for (var h = 0; h < dok.hyperlinks.length; h++) {
				hlink = dok.hyperlinks[h];
				if (hlink.destination != null && hlink.source != null &&  hlink.extractLabel(px.hyperlinkLabel) == "backlink") {
					if (hlink.source.sourceText.parentStory.id == endnoteStory.id) {					
						endnoteSource = hlink.source.sourceText.paragraphs[0].findGrep();
						if (endnoteSource.length == 1) {
							hlink.source.sourceText = endnoteSource[0];						
						}
						else {
							log.warnAlert(localize (px.ui.statusFail));
						}
					}
				}
			}
			
			app.findGrepPreferences = NothingEnum.NOTHING;
			app.changeGrepPreferences = NothingEnum.NOTHING;
			app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
			app.findGrepPreferences.findWhat = "(?<=~h)\\t";
			endnoteBlock.changeGrep();
		
			// Seiten auflösen 
			idsTools.checkOverflow(endnoteStory);
			dok.crossReferenceSources.everyItem().update();
			
			
		}
	}

    // Ebenen zurücksetzen
	for (var i = 0; i < dok.layers.length; i++) {
		dok.layers[i].visible = layerState[i][0];
		dok.layers[i].locked = layerState[i][1];
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

/* find the textrange with endnotes */
function getEndnoteBlock (endnoteStory, dok, alertMessage) {
	if (alertMessage == undefined) alertMessage = true;
	var endnotenStartEndPositions = getEndnotenStartEndPositions(dok, endnoteStory)
	var startOfTextRange = endnoteStory.characters[-1].index;
	var endOfTextRange = endnoteStory.characters[-1].index;
	
	if (endnotenStartEndPositions.length > 0) {
		startOfTextRange = endnotenStartEndPositions[0][0];
		endOfTextRange = endnoteStory.characters[endnotenStartEndPositions[endnotenStartEndPositions.length - 1][0]].paragraphs[0].characters[-1].index;
	} 
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.findWhat = px.endnoteHeadingString;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnoteHeading;
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
			log.warnAlert (localize (px.ui.headingStyleFailBlockMoreThanOne, px.endnoteHeadingString, px.pStyleEndnoteHeading.name ));
		}
	}
	else {
		if (alertMessage) {
			log.warnAlert (localize (px.ui.headingStyleFailBlock, px.endnoteHeadingString, px.pStyleEndnoteHeading.name ));
		}
	}
	
	return endnoteStory.characters.itemByRange(startOfTextRange, endOfTextRange).getElements()[0]
}
function getEndnotenStartEndPositions(dok, endnoteStory) {
	// Hyperlinks wieder einsammeln... 
	var endnotenStartEndPositions = [];
	for (var h = 0; h < dok.hyperlinks.length; h++) {
		hlink = dok.hyperlinks[h];
		if (hlink.destination != null && hlink.source != null &&  hlink.extractLabel(px.hyperlinkLabel) == "true") {
			if (hlink.source.sourceText.parentStory.id == endnoteStory.id) {
				endnotenStartEndPositions.push([hlink.destination.destinationText.paragraphs[0].characters[0].index, hlink.source.sourceText.index, hlink.destination.destinationText.paragraphs[0].contents]);
			}
		}
	}
	endnotenStartEndPositions.sort(sortSecondEntry);	
	return endnotenStartEndPositions;
}
/* Array sort function */
function sortSecondEntry(a,b) {
	  return a[1] - b[1];
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
	if (dok.extractLabel(px.manualNumberingLabel) != "") {
		px.manualNumbering = dok.extractLabel(px.manualNumberingLabel) == "true" ? true : false;
		if (px.manualNumbering) {
			px.previousManualNumbering = px.manualNumbering;
		}
		log.debug ("px.manualNumbering" + px.manualNumbering);
	}
	if (dok.extractLabel(px.footnoteIgnoreLabel) != "") {
		px.footnoteIgnore = dok.extractLabel(px.footnoteIgnoreLabel) == "true" ? true : false;
		log.debug ("px.footnoteIgnore" + px.footnoteIgnore);
	}
}

/* Read all silent */
function readStylesSilent (dok) {
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
}


/* Check endnote style and cross ref format for usability in script */
function checkStyles(dok) {
	// Absätze von Endnoten müssen immer nummeriert sein!
	if (px.pStyleEndnote.id == px.pStyleEndnoteFollow.id) {
		px.pStyleEndnoteFollow = px.pStyleEndnote.duplicate();
		dok.insertLabel(px.pStyleEndnoteFollowLabel, px.pStyleEndnoteFollow.name);
		log.warnAlert( localize (px.ui.samePStyle, px.pStyleEndnoteName ) );	
	}		
	if (px.pStyleEndnote.bulletsAndNumberingListType != ListType.numberedList) {
		px.pStyleEndnote.bulletsAndNumberingListType = ListType.numberedList;
		px.pStyleEndnote.numberingFormat = NumberingStyle.ARABIC		
		if (!px.manualNumbering) {
			log.info( localize (px.ui.endnoteStyleNumberingFail, px.pStyleEndnoteName ) );	
		}
	}
	if (px.manualNumbering && px.pStyleEndnote.numberingExpression  != "^#^t") {
		px.pStyleEndnote.numberingExpression  = "^#^t";		
		log.warnAlert(localize (px.ui.wrongNumberingExpression, px.pStyleEndnote.name));
	}

	if (px.pStyleEndnoteFollow.bulletsAndNumberingListType == ListType.numberedList) {
		px.pStyleEndnoteFollow.bulletsAndNumberingListType = ListType.NO_LIST;
		log.warnAlert( localize (px.ui.endnoteStyleNumberingDeactivate, px.pStyleEndnoteFollowName) );	
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
			log.warnAlert(localize (px.ui.crossrefFormatFail, px.crossRefStyleEndnoteName, px.cStyleEndnoteMarkerName));
		} 
	}
}

/* Init Logging, sets global.log  */
function initLog(logFile) {
	if (px.debug) {
		log = idsLog.getLogger (logFile, "DEBUG", true);
	}
	else {
		log = idsLog.getLogger (logFile, "WARN", false);
	} 	
}

/* Get Filepath from current script  */
/*Folder*/ function getScriptFolderPath() {
     try {
          skriptPath  = app.activeScript.parent;
     }
     catch (e) {
          /* We're running from the ESTK*/
          skriptPath = File(e.fileName).parent;
     }
     return skriptPath;
}
