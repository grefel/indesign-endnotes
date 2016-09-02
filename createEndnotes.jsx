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

@Version: 3
@Date: 2016-08-29
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
		emptyEndnotePar:{en:"%1 empty Pargraph(s) with endnote format [%2]. Please delete or assign another format.", de:"%1 Absätze ohne Inhalt sind mit dem Format [%2] ausgezeichnet. Bitte weisen Sie ein anderes Format zu oder löschen Sie die Absätze."},	
		// createEndnotes.jsx		
		menuTitle:{en:"Convert footnotes to endnotes v%1", de:"Fußnoten zu Endnoten konvertieren v%1"},		
		resultInfo:{en:"[%1] footnotes converted to endnotes!", de:"Es wurden [%1] Fußnoten zu Endnoten konvertiert!"},
		resultInfoConvert:{en:"[%1] backlinks created.\nDo not update the crossreferences!", de:"Es wurden [%1] Backlinks erstellt.\nDie Querverweise dürfen jetzt nicht mehr aktualisiert werden."},
		
		noTextInDoc:{en:"No text in document", de:"Es ist kein Text im Dokument enthalten"},
		noFootnoteInDoc:{en:"No footnote in document", de:"Es gibt keine Fußnote im Dokument"},
		multipleEndnoteLinks:{en:"More than one story with endnotes, cannot process this document.", de:"In mehr ale einem Textabschnitt befinden sich Endnoten, dieses Dokument kann nicht verarbeitet werden."},
		willProcessCurrentSelection:{en:"More than one story with footnotes, will process the current story (cursor position)", de:"Mehr als ein Textabschnitt enthält Fußnoten, es wird der aktuelle Textabschnitt (Position der Einfügemarke) verarbeitet."},
		createSelection:{en:"More than one story with footnotes, place cursor in story and restart", de:"Mehr als ein Textabschnitt enthält Fußnoten, bitte positionieren Sie die Einfügemarke im gewünschten Textabschnitt"},
		endnoteAndFootnotesAreNotInTheSameStory:{en:"Endnotes and Footnotes are not in the same story", de:"Endnoten und Fußnoten sind nicht im gleichen Textabschnitt!"},
		unknownSelectionError:{en:"Could not determine the footnote story", de:"Der Textabschnitt mit den Fußnoten konnte nicht ermittelt werden!"},
		wrongEndnoteOrder:{en:"Position of endnote [%1] is not in sync with story flow.\nCheck your document.", de:"Die Position der Endnote [%1] entspricht nicht dem Textfluss.\nPrüfen Sie das Dokument."},
		emptyFootnote:{en:"Cannot process footnotes without text.", de:"Fußnoten ohne Text können nicht verarbeitet werden."},
		hyperlinkProblemDestination:{en:"Destinaton of Hyperlink [%1] with source text [%2] was deleted.", de:"Das Ziel des Hyperlinks [%1] mit dem Quelltext [%2] wurde gelöscht."},	
		hyperlinkProblemSource:{en:"Source of Hyperlink [%1] with destination text [%2] was deleted.", de:"Die Quelle des Hyperlinks [%1] mit dem Zieltext [%2] wurde gelöscht."},	
		
		
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
	version:"3.0-2016-08-31"
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

// Environment checking and startup
function startProcessing() {
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

	var endnoteStory = getEndnoteStory(dok);
	if (endnoteStory == null) {
		return;
	}
	
	var logFile = File ( getScriptFolderPath() + "/" + px.logFileName );
	initLog(logFile);

	if (dok.extractLabel(px.scriptVersionLabel) != "" || dok.extractLabel(px.pStyleEndnoteLabel) != "") {
		var dokVersion = "1";
		if (dok.extractLabel(px.scriptVersionLabel) != "") {
			dokVersion = dok.extractLabel(px.scriptVersionLabel);
		} 		
		if (dok.extractLabel(px.scriptVersionLabel) != px.scriptMajorVersion) {
			log.warnAlert(localize (px.ui.scriptVersionWarning, dokVersion), px.debug);
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
				log.warnAlert (localize(px.ui.saveDocFail) + e);
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
			log.warnAlert(localize (px.ui.errorInfo) +  e + "\nLine: " + e.line); 
		}
	}
		
    // Ebenen zurücksetzen
	for (var i = 0; i < dok.layers.length; i++) {
		dok.layers[i].visible = layerState[i][0];
		dok.layers[i].locked = layerState[i][1];
	}
	    
	app.scriptPreferences.userInteractionLevel = userLevel; 
	app.scriptPreferences.enableRedraw = redraw;
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;

	var resultInfo = localize(px.ui.resultInfo, px.foot2EndCounter);
	if (px.showGui && result != 2) {
		log.infoAlert(resultInfo);
	}
	else {
		log.info(resultInfo);
		log.info(" --- ");
	}
}

/* Returns a valid endnote story for processing or null*/
function getEndnoteStory(dok) {
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
		}
	}

	// Die einfachen Fälle 
	if (footnoteStories.length == 0) {
		alert(localize(px.ui.noFootnoteInDoc)); 
		return null;
	}
	if (endnoteStoryMap.length > 1) {
		alert(localize(px.ui.multipleEndnoteLinks)); 
		return null;
	}
	if (footnoteStories.length == 1 && endnoteStoryMap.length == 0) { // New doc
		endnoteStory = footnoteStories[0];
	}
	else if (footnoteStories.length == 1 && endnoteStoryMap.length == 1 && endnoteStoryMap.hasItem(footnoteStories[0].id)) { // Update Doc
		endnoteStory = footnoteStories[0];
	}

	if (footnoteStories.length == 1 && endnoteStoryMap.length == 1 && !endnoteStoryMap.hasItem(footnoteStories[0].id)) { 
		alert(localize(px.ui.endnoteAndFootnotesAreNotInTheSameStory)); 
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
	if (endnoteStory == null) {
		// Darf eigentlich nicht passieren 
		alert(localize(px.ui.unknownSelectionError)); 
		return null;
	}
	return endnoteStory;
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
	log.info("Run footnote to endnote conversion with version " + px.version);
	
	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.findGrepPreferences.findWhat = "^[~m~>~f~|~S~s~<~/~.~3~4~% ]*\r";
	var emptyEndnotes = endnoteStory.findGrep();
	if (emptyEndnotes.length > 0) {
		log.warnAlert(localize(px.ui.emptyEndnotePar, emptyEndnotes.length, px.pStyleEndnote.name));
		emptyEndnotes[0].select();
		return;
	}

	// Sicherheitskopie anlegen? 
	if (px.createBackupCopy && !px.debug) {
		var date = new Date();
		var day = idsTools.pad(date.getDate(), 2);
		var month = idsTools.pad(date.getMonth() + 1, 2);
		var year = date.getYear() + 1900;
		var year = date.getYear() + 1900;
		
		var backupFile = File( dok.fullName.toString().replace(/.indd$/, "") + "__" + year + month + day + "_" + date.getTime() + "_" + px.backupCopySuffix);
		dok.saveACopy(backupFile);
	}

	fixHyperlinks(dok); // Fix broken Links before processing

	checkStyles(dok);
										
	var hLinksPerStory = getCurrentEndnotes(dok, endnoteStory);
	if (!hLinksPerStory) {
		return;
	}
	
	// Fußnoten zu Endnoten konvertieren 
	var firstHlink, firstHlinkIndex, headingParagraph, footnote, endnote, endnote_link, cue, hlink, nextHlink,  hyperLinkID;	
	var oldPages = dok.pages.length;

	// EndnotenTitel einfügen  					
	hyperLinkID =  hLinksPerStory[1][0];
	
	if (hyperLinkID == "last") { // --> There is no Endnote Hyperlink in the story.
		log.info("Create new endnote block");
		endnoteStory.insertionPoints[-1].contents = "\r" + px.endnoteHeadingString;
		endnoteStory.insertionPoints[-1].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteHeading;
	}
	else {
		log.info("Update exisiting endnote block");
		firstHlink = dok.hyperlinks.itemByID(hyperLinkID);
		firstHlinkIndex = firstHlink.destination.destinationText.paragraphs[0].insertionPoints[0].index;
		if (firstHlink.destination.destinationText.parentStory.id != endnoteStory.id) {
			log.warnAlert( localize(px.ui.endnoteStoryMoved) );
			return;
		}
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
			log.warnAlert (localize (px.ui.headingStyleFail , px.endnoteHeadingString, headingParagraph.contents.replace(/\r/g,'') ));
			headingParagraph.insertionPoints[0].contents = px.endnoteHeadingString + "\r";
		}
		headingParagraph.appliedParagraphStyle = px.pStyleEndnoteHeading;
		firstEndnote.appliedParagraphStyle = px.pStyleEndnote;
	}

	// Fußnoten konvertieren 
	var footn = endnoteStory.footnotes;
	if (px.showGui) {
		var pBar = idsTools.getProgressBar(localize(px.ui.menuTitle, px.version));
		pBar.reset("Verarbeite Endnoten", footn.length);
	}

	if (px.footnoteIgnore) {
		footNoteIgnoreCondition = dok.conditions.add();
		footNoteIgnoreCondition.visible = false;
		footnoteLoop : for (var i = footn.length-1; i >=0 ; i--) {
			footnote = footn[i];
			for (var f = 0; f < footnote.paragraphs.length; f++) {
				if (footnote.paragraphs[f].appliedParagraphStyle.id == px.pStyleFootnoteIgnore.id ) {
					log.info("Footnote " +footnote.contents.substring(0,20) + " ignored by PargraphStyle ");
					endnoteStory.characters[footnote.storyOffset.index].applyConditions ([footNoteIgnoreCondition]);					
					continue footnoteLoop;
				}
			}
		}
	}

	endnoteStory.insertionPoints[-1].contents = "\r";
	einfuegeIndex = endnoteStory.insertionPoints[-1].index;

	footnoteLoop : for (var i = footn.length-1; i >=0 ; i--) {
		if (px.showGui) {
			pBar.hit();
		}
	
		footnote = footn[i];
		
		trimFootnoteSpace(footnote);
		if (footnote.contents.replace(//, '').replace(/\s/g, '') == "") {
			log.warnAlert(localize(px.ui.emptyFootnote));
			continue;
		}
			
		// Formatieren 				
		footnote.paragraphs[0].applyParagraphStyle (px.pStyleEndnote, false);
		if(footnote.paragraphs.length > 1) {
			footnote.paragraphs.itemByRange(1,footnote.paragraphs.length-1).applyParagraphStyle (px.pStyleEndnoteFollow, false);
		}				
		
		var fnIndex = footnote.storyOffset.index;
		hyperLinkID = getPosition(fnIndex, hLinksPerStory); // Find the next existing Hyperlink in the story
		if (hyperLinkID == null) {
			// Fehler bei getPosition();
			return;
		}
		if (hyperLinkID == "first") {
			log.warnAlert( localize(px.ui.statusFail) ); 
			continue;
		}
		else if (hyperLinkID == "last") {
			endnote = footnote.texts[0].move (LocationOptions.after, endnoteStory.insertionPoints[einfuegeIndex]);
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
		einfuegeIndex++;
		cue.insertLabel(px.hyperlinkLabel, "true");
		hlink = dok.hyperlinks.add (cue, endnote_link, {visible: false});
		hlink.insertLabel(px.hyperlinkLabel, "true");

		pushHLink ( hLinksPerStory, hyperLinkID, hlink);		
				
		px.foot2EndCounter++;
	} // footnoteLoop : for

	var endnoteBlock = getEndnoteBlock(endnoteStory, dok, true);
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
	
	// Wenn wir nach Section splitten müssen, werden jetzt die Positionen der Sections ausgewertet die ggf. zugeordnent werden müssen
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
		var endnotenStartEndPositions = getEndnotenStartEndPositions(dok, endnoteStory)
		
		// In length -1 steckt nur der leere String für den letzten Insertion Point der Story
		sectionCounter = sectionIndexArray.length-2;
		
		var currentSection, nextSection, endnotenIndex, endnotenTextIndex;
		
		for (var i =  endnotenStartEndPositions.length-1; i >= 0; i--) {
			// Endnoten
			endnotenTextIndex = endnotenStartEndPositions[i][1];
			endnotenIndex = endnotenStartEndPositions[i][0];
			if (i > 0) {
				previousEndnotenTextIndex = endnotenStartEndPositions[i-1][1];
			}
			else {
				previousEndnotenTextIndex = -1;
			}
			
			if (i ==  endnotenStartEndPositions.length-1) {
				nextEndnotenIndex = endnotenIndex;
			}
			else {
				nextEndnotenIndex = endnotenStartEndPositions[i+1][0];
			}
			
			// Abschnitte 
			currentSection = sectionIndexArray[sectionCounter];
			currentSectionStartIndex = currentSection[1];
			nextSection = sectionIndexArray[sectionCounter+1];
			nextSectionStartIndex = nextSection[1];
			
			if (previousEndnotenTextIndex < currentSectionStartIndex && endnotenTextIndex > currentSectionStartIndex && endnotenTextIndex < nextSectionStartIndex) {
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
					log.warnAlert(localize(px.ui.numberingFail));
				}

				if (px.pStyleEndnoteSplitHeadingPrecedingCopy && currentSection[3] != "") {
					endnoteStory.insertionPoints[endnotenIndex].contents = currentSection[3];
					endnoteStory.insertionPoints[endnotenIndex].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteSplitHeadingPrecedingRepeat;
				}		

				sectionCounter--;
			}
			else if (endnotenTextIndex < currentSectionStartIndex && sectionCounter > 0) {
				i++; // endnote zurücksetzen , weil wir gucken müssen ob es in der nächsten Section steht.
				sectionCounter--;						
			}
		}
	}		


	deleteNotemarkers (endnoteStory);
	endnoteStory.characters[-1].contents = "";
	
	if (px.footnoteIgnore) {
		app.findGrepPreferences = NothingEnum.NOTHING;
		app.changeGrepPreferences = NothingEnum.NOTHING;
		app.findGrepPreferences.appliedParagraphStyle = px.pStyleFootnoteIgnore;
		app.findGrepPreferences.findWhat = "\\r\\Z";
		endnoteStory.changeGrep();
		
		footNoteIgnoreCondition.remove();
	}

	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
	app.findGrepPreferences.findWhat = "^\\t";
	endnoteBlock.changeGrep();		
	
	// Seiten auflösen 
	idsTools.checkOverflow(endnoteStory);
	dok.crossReferenceSources.everyItem().update();
		
	if (px.showGui) {
		var newPages = dok.pages.length - oldPages ;
		if (dok.pages.length != oldPages ) {
			log.warnAlert (localize (px.ui.newPagesAdded, newPages));
		}
		pBar.close();
	}
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
	var sectionIndexArray = [[0,story.characters[0].index, ""]];
	for (var ps = 0; ps < px.dokParagraphStylePrefixStyles[px.pStylePrefix].length; ps++) {
		var pStyle = px.dokParagraphStylePrefixStyles[px.pStylePrefix][ps];
		app.findGrepPreferences = NothingEnum.NOTHING;
		app.changeGrepPreferences = NothingEnum.NOTHING;
		app.findGrepPreferences.appliedParagraphStyle = pStyle;
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
	var h, source, destination, destinationTextPar, hlink;
	
	for (h = 0; h < dok.hyperlinks.length; h++) {
		hlink = dok.hyperlinks[h];
		source = hlink.source;
		destination = hlink.destination;
		if (hlink.extractLabel(px.hyperlinkLabel) == "true" && destination != null && source != null) {
			if (source.sourceText.parentStory.id == endnoteStory.id) {
				destinationTextPar = hlink.destination.destinationText.paragraphs[0];
				endnotenStartEndPositions.push([destinationTextPar.characters[0].index, source.sourceText.index, destinationTextPar.contents]);
			}
		}
	}
	endnotenStartEndPositions.sort(sortSecondEntry);
	return endnotenStartEndPositions;
}

function getCurrentEndnotes (dok, endnoteStory) {
	// Die aktuellen Endnoten einsammeln
	var hLink;	
	var hLinksPerStory = [];
	hLinksPerStory[0] = ["first", -1, -1,  "Dummy Endnote Postion Start"];
	
	for (var j = 0; j < dok.hyperlinks.length; j++) {
		hLink = dok.hyperlinks[j];
		if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
			try {
				if(hLink.destination != null) {
					if (hLink.source.sourceText.parentStory.id == endnoteStory.id) {
						log.debug("Ausgelesener hLink.id : " + hLink.id + " -> " + hLink.source.sourceText.index + "sourceText: " + hLink.source.sourceText.contents + " destination: " +  hLink.destination.destinationText.paragraphs[0].contents);
						hLinksPerStory.push([hLink.id, hLink.source.sourceText.index,  hLink.destination.destinationText.paragraphs[0].index, hLink.destination.destinationText.paragraphs[0].contents]);
					}
				}
				else {
					log.warn("Ein Hyperlink [ID: " + hLink.id + "] hat kein Ziel mehr. Der Ursprungstext vermutlich gelöscht!");
				}
			} catch (e) {
				log.warn("Fehler bei der Verarbeitung der Hyperlinks, Hyperlinks sind eventuell nicht mehr gültig?\n" + e);
			}
		}
	}

	// Endnoten nach Position in der Story sortieren 
	hLinksPerStory.sort(sortSecondEntry);
	hLinksPerStory.push(["last", endnoteStory.insertionPoints[-1].index, endnoteStory.insertionPoints[-1].index, "Dummy Endnote Postion End"]);

	// Prüfen ob die Reihenfolge in den Stories noch stimmt - Copy & Paste Bugs könnten so auffalen. 
	var lastPosition = -2;
	for (var m =0; m < hLinksPerStory.length; m++) {
		log.debug(hLinksPerStory[m]);
		if (hLinksPerStory[m][2] > lastPosition) {
			lastPosition = hLinksPerStory[m][2];
		}
		else {
			log.warnAlert(localize (px.ui.wrongEndnoteOrder, hLinksPerStory[m][3].replace(/\r/g, ' ').substring(0,40) ))
//~ 			return null;
		}
	}
	
	return hLinksPerStory;
}


// Fixes Hyperlink Labels lost thru Copy&Paste and shows deleted/orphaned Hyperlinks
function fixHyperlinks(dok) {
	var hLink;
	for (var i = 0; i  < dok.hyperlinks.length; i++) {
		hLink = dok.hyperlinks[i];
		if (hLink.destination == null) {
			if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
				log.warnAlert(localize (px.ui.hyperlinkProblemDestination, hLink.name, hLink.source.sourceText.contents));
			}
			continue;
		}
		if (hLink.source == null) {
			if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
				log.warnAlert(localize (px.ui.hyperlinkProblemSource, hLink.name, hLink.destination.destinationText.contents));
			}
			continue;
		}	
		if (hLink.destination && hLink.destination.extractLabel(px.hyperlinkLabel) == "true") {
			hLink.insertLabel(px.hyperlinkLabel, "true");
		}
	}
}

function getPosition(index, endNoteArray) {
	for (var m =1; m < endNoteArray.length; m++) {
		if (index <= endNoteArray[m][1] && index > endNoteArray[m-1][1]) {
			return endNoteArray[m][0]; 
		} 
	}
	log.warnAlert(localize (px.ui.positionFail));
	return null; 
}

function pushHLink ( endNoteArray, hyperLinkID, hLink) {
	for (var m =1; m < endNoteArray.length; m++) {
		if (endNoteArray[m][0] == hyperLinkID) {
			endNoteArray.splice(m,0, [hLink.id, hLink.source.sourceText.index]);
			return;
		} 
	}
	log.warnAlert(localize (px.ui.positionFail));
	return null; 
}

function deleteNotemarkers (endnoteStory) {
//~ 	// Es gibt Abstürze bei wenn der Footnote Marker am Ende des Textabschnitts steht Suche Ersetze Kombinationen in CS6
	endnoteStory.insertionPoints[-1].contents = " ";
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findChangeGrepOptions.includeFootnotes = true;
	app.findGrepPreferences.findWhat = "~F";
	endnoteStory.changeGrep();
	endnoteStory.characters[-1].contents = "";
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
		log.warnAlert( localize (px.ui.samePStyle, px.pStyleEndnoteName ) );	
	}		
	if (px.pStyleEndnote.bulletsAndNumberingListType != ListType.numberedList) {
		px.pStyleEndnote.bulletsAndNumberingListType = ListType.numberedList;
		px.pStyleEndnote.numberingFormat = NumberingStyle.ARABIC;
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
