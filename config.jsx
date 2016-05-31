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
@Date: 2016-05-31
@Author Gregor Fellenz http://www.publishingx.de/
*/

var px = {
	// Configurations settings for style names -- changes is save 
	pStyleEndnoteName:"Endnote", // Absatzformat der Endnote. Das Format sollte automatisch nummeriert sein. Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	pStyleEndnoteFollowName:"Anm~folge", // Absatzformat für Endnoten mit mehr als einem Absatz. Das Format sollte automatisch nummeriert sein. Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	pStyleEndnoteHeadingName:"EndnotenTitel", // Absatzformat der Endnotenüberschrift
	
	pStyleEndnoteSplitHeadingName:"EndnotenAbschnitt", // Absatzformat für die wiederholten Überschriften	
	pStyleEndnoteSplitHeadingPrecedingRepeatName:"EndnotenAbschnittVor", // Absatzformat für Absätze vor wiederholten Überschriften
	pStyleEndnoteSplitHeadingFollowingName:"EndnotenAbschnittNach", //  Absatzformat für Absätze nach wiederholten Überschriften
	
	cStyleEndnoteMarkerName:"Endnotenzähler", // Zeichenformat des Endnotenmarkers.Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	crossRefStyleEndnoteName:"EndnotenMarker", // Querverweisformat. Kann nicht in der GUI ausgewählt werden.
	endnoteHeadingString:"Endnoten", // Default Text für die Entnotenüberschrift
	
	pStylePrefix:"u1", // Präfix der Überschriften an denen die Endnotenzählung geteilt wird.
	pStyleEndnoteSplitHeadingPrecedingName:"U1_Pre", // Absatzformat für Absätze die kopiert werden sollen
	pStyleEndnoteSplitHeadingFollowingName:"U1_Follow", //  Absatzformat für Absätze die kopiert werden sollen


	// User interface strings -- translation and changes are save
	ui:{
		// all scripts 
		saveDoc:{en:"Document is not saved", de:"Dokument ist nicht gespeichert"},
		saveDocInfo:{en:"Save your document first!\rSave and continue?", de:"Das Dokument muss zuerst gespeichert werden!\rSpeichern und fortfahren?"},
		saveDocFail:{en:"Could not save File.\n", de:"Die Datei konnte nicht gespeichert werden.\n"},
		errorInfo:{en:"Error during execution: ", de:"Fehler bei der Ausführung: "},		
		versionWarning:{en:"To run this script InDesign CS5 is required", de:"Für dieses Skript wird mindestens InDesign CS5 benötigt"},
		scriptVersionWarning:{en:"The document has been created with Version (v%1). Compatibility can not be guaranteed.\nPlease check carefully.", de:"Das Dokument wurde mit Version (v%1) erstellt. Die Kompatibilität kann nicht garantiert werden.\nBitte prüfen Sie genau."},
		
		// createEndnotes.jsx		
		menuTitle:{en:"Convert Footnotes to Endnotes v%1", de:"Fußnoten zu Endnoten konvertieren v%1"},		
		resultInfo:{en:"[%1] footnotes converted to endnotes!", de:"Es wurden [%1] Fußnoten zu Endnoten konvertiert!"},
		
		noTextInDoc:{en:"No text in document", de:"Es ist kein Text im Dokument enthalten"},
		noFootnoteInDoc:{en:"No footnote in document", de:"Es gibt keine Fußnote im Dokument"},
		multipleEndnoteLinks:{en:"More than one story with endnotes, cannot process this document.", de:"In mehr ale einem Textabschnitt befinden sich Endnoten, dieses Dokument kann nicht verarbeitet werden."},
		willProcessCurrentSelection:{en:"More than one story with footnotes, will process the current story (cursor position)", de:"Mehr als ein Textabschnitt enthält Fußnoten, es wird der aktuelle Textabschnitt (Position der Einfügemarke) verarbeitet."},
		createSelection:{en:"More than one story with footnotes, place cursor in story and restart", de:"Mehr als ein Textabschnitt enthält Fußnoten, bitte positionieren Sie die Einfügemarke im gewünschten Textabschnitt"},
		endnoteAndFootnotesAreNotInTheSameStory:{en:"Endnotes and Footnotes are not in the same story", de:"Endnoten und Fußnoten sind nicht im gleichen Textabschnitt!"},
		unknownSelectionError:{en:"Could not determine the footnote story", de:"Der Textabschnitt mit den Fußnoten konnte nicht ermittelt werden!"},
		wrongEndnoteOrder:{en:"Position of Endnote [%1] is not in sync with story flow.\nCheck your document.", de:"Die Position der Endnote [%1] entspricht nicht dem Textfluss.\nPrüfen Sie das Dokument."},
		emptyFootnote:{en:"Cannot process Footnotes without text.", de:"Fußnoten ohne Text können nicht verarbeitet werden."},
		
		methodPanel:{en:"Mode",de:"Verarbeitungsmodus"},
		splitByHeading:{en:"Split by Parargaph Style",de:"Anhand von Absatzformat trennen"},
		continuousNumbering:{en:"Continuous Numbering",de:"Fortlaufend nummerieren"},
		manualNumbering:{en:"Manual numbering of endnotes (list function in paragraph style will be disabled )",de:"Manuelle Nummerierung der Endnoten (Listenfunktion im Absatzformat wird ggfs. deaktiviert)"},
		
		splitFormatPanel:{en:"Split endnote configuration",de:"Formatpräfix an dem die Endnoten geteilt werden"},
		splitByHeadingStyle:{en:"Split Parargaph Style/Heading",de:"Format zur Aufteilung in Abschnitte"},
		endNoteSplitHeadingParagraphStyle:{en:"Parargaph Style for repeated Headings",de:"Absatzformat wiederholte Überschriften"},

		endNoteSplitHeadingParagraphStylePreceding:{en:"Copy preceding Parargaph formated by:",de:"Vorherigen Absatz kopieren, Formatvorgabe:"},
		endNoteSplitHeadingParagraphStyleFollowing:{en:"Copy following Parargaph formated by:",de:"Folgenden Absatz kopieren, Formatvorgabe:"},		
		endNoteSplitHeadingParagraphStylePrecedingFollowingRepeat:{en:"Parargaph Style for repeated Paragraphs:",de:"Wiederholten Absatz formatieren:"},
		
		formatWarnung:{en:"Caution: Any Text formatted in Parargaph Style for repeated Headings will be deleted. Use only in Endnote Area!",de:"Achtung: Texte, die mit den Absatzformaten für wiederholte Schriften formatiert sind, werden gelöscht. Verwenden Sie dies nur im Bereich Endnoten."},
		
		formatPanel:{en:"Endnote styling",de:"Formate der Endnoten"},
		endnoteParagraphStyle:{en:"Parargaph Style endnote",de:"Absatzformat Endnote"},
		endnoteFollowParagraphStyle:{en:"Parargaph Style followup paragraph",de:"Absatzformat Folgeabsatz"},
		endnoteMarkerCharacterStyle:{en:"Characater Style endnote marker",de:"Zeichenformat Endnotenmarker"},
		
		endNoteHeadingPanel:{en:"Endnote Block",de:"Endnotentitel"},
		endNoteHeading:{en:"Heading",de:"Titelzeile"},
		endNoteHeadingParagraphStyle:{en:"Parargaph Style Heading",de:"Absatzformat Endnotentitel"},
		cancelButton:{en:"Cancel",de:"Abbrechen"},
		okButton:{en:"Convert Footnotes",de:"Konvertiere Fußnoten"},
		saveButton:{en:"Save Settings in Document",de:"Einstellungen im Dokument speichern"},
		
		
		invalidSelection:{en:"Invalid Selection", de:"Ungültige Auswahl"},
		headingStyleFail:{en:"The choosen heading [%1] does not match the heading text [%2] in your document. \n\Please check the result!", de:"Die von Ihnen gewünschte Überschrift [%1] stimmt nicht mit dem Überschriftentext [%2] im Dokument überein. \n\nBitte prüfen Sie das Ergebnis!"},
		headingStyleFailBlock:{en:"The choosen heading [%1] in format [%1] cannot be found in the document. \n\Please check the result!", de:"Die von Ihnen gewünschte Überschrift [%1] mit dem Format [%2] kann nicht gefunden werden. \n\nBitte prüfen Sie das Ergebnis!"},
		headingStyleFailBlockMoreThanOne:{en:"The choosen heading [%1] in format [%1] is on more than one location in the document. \n\Please check the result!", de:"Die von Ihnen gewünschte Überschrift [%1] mit dem Format [%2] ist an mehreren Stellen im Dokument gefuden worden.\n\nBitte prüfen Sie das Ergebnis!"},
		statusFail:{en:"Undocumented Error! - Please send the document to the support!", de:"Unklarer Status! - Bitte senden Sie das Dokument an den Support!"},
		numberingFail:{en:"Followup paragraph not found! Numbering may be faulty!", de:"Folgeabsatz nicht gefunden! Nummerierung ggf. fehlerhaft!"},
		newPagesAdded:{en:"There were added %1 pages . Please check the document", de:"Es wurden %1 Seiten hinzugefügt. Bitte prüfen Sie den Umfang"},
		positionFail:{en:"There was an error in the endnote position analysis!\Please contact Support!", de:"Es ist ein Fehler bei der Endnotenpositionsanalyse aufgetreten!\nBitte kontaktieren Sie den Support!"},		
		samePStyle:{en:"The paragraph format [%1] was also selected for the followup paragraphs , this could lead to numbering errors! The format has been duplicated.", de:"Das Absatzformat [%1] wurde auch für die Folgeabsätze ausgewählt, dies führt ggf. zu Nummerierungsfehlern! Das Format wurde dupliziert."},
		endnoteStyleNumberingFail:{en:"In paragraph style [%1] the option [Bullets and Numbering] -> [List Type : Numbes ] was activated.", de:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] aktiviert."},
		crossrefFormatFail:{en:"The cross-reference format [%1] already exists.\nThe selected different Character Style [%2] was set!", de:"Das Querverweisformat [%1] ist bereits vorhanden.\nDas ausgewählte aber abweichende Zeichenformat [%2] wurde eingestellt!"},
		endnoteStyleNumberingDeactivate:{en:"In Paragraph Style [%1] the option \n[Bullets and Numbering] -> [List Type : Numbes ] was deactivated.", de:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] deaktiviert."},
		headingFail:{en:"For the title of at least one character must be entered .",de:"Für den Titel muss mindestens ein Zeichen eingegeben werden."},
		styleSelectionFail:{en:"Error in the format selection", de:"Fehler bei der Formatauswahl"},
		styleSelectionFailSection:{en:"Error in the format selection of selections", de:"Fehler bei der Formatauswahl für die Abschnittsbildung"},
		endnoteStoryMoved:{en:"Text and Endnotes must be in the same Story\nPlease copy the endnote text to the end of the text portion", de:"Text und Endnoten müssen sich im gleichen InDesign Textabschnitt befinden!\nBitte kopieren Sie den Endnoten-Text an das Ende des Textabschnitts."},
		

		// deleteEndnotes.jsx
		noEndnoteOrMarker:{en:"The insertion point must be placed within an endnote or before the endnote marker.", de:"Die Einfügemarke muss innerhalb einer Endnote oder vor dem Endnotenmarker platziert sein."},
		deleteEndnoteName:{en:"Remove endnote",de:"Endnote entfernen"},
		confirmEndnoteDelete:{en:"Remove Endnote %1 \n\n%2",de:"Endnote löschen %1 \n\n%2"},

	},



	// Careful with changes below, changing options might break the update process of previously converted documents
	createBackupCopy:true,
	backupCopySuffix:"_endnoteBackupt.indd",
	
	numberBySection:true,
	manualNumbering:false,
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
	version:"2.0-2016-05-31"
}
