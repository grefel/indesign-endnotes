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
@Version: 1.2
@Date: 2016-01-06
@Author Gregor Fellenz http://www.publishingx.de/
*/

var px = {
	// Configurations settings for style names -- changes is save 
	pStyleEndnoteName:"Endnote", // Absatzformat der Endnote. Das Format sollte automatisch nummeriert sein. Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	pStyleEndnoteFollowName:"Anm~folge", // Absatzformat für Endnoten mit mehr als einem Absatz. Das Format sollte automatisch nummeriert sein. Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	pStyleEndnoteHeadingName:"EndnotenTitel", // Absatzformat der Endnotenüberschrift
	pStyleEndnoteSplitHeadingName:"EndnotenAbschnitt", // Absatzformat für die wiederholten Überschriften
	cStyleEndnoteMarkerName:"Endnotenzähler", // Zeichenformat des Endnotenmarkers.Wenn es im Dokument vorhanden ist, wird es in der GUI vorausgewählt.
	crossRefStyleEndnoteName:"EndnotenMarker", // Querverweisformat. Kann nicht in der GUI ausgewählt werden.
	endnoteHeadingString:"Endnoten", // Default Text für die Entnotenüberschrift
	pStylePrefix:"u1", // Präfix der Überschriften an denen die Endnotenzählung geteilt wird.

	// User interface strings -- translation and changes are save
	ui:{
		// all scripts 
		saveDoc:{en:"Dokument ist nicht gespeichert", de:"Dokument ist nicht gespeichert"},
		saveDocInfo:{en:"Das Dokument muss zuerst gespeichert werden!\rSpeichern und fortfahren?", de:"Das Dokument muss zuerst gespeichert werden!\rSpeichern und fortfahren?"},
		saveDocFail:{en:"Die Datei konnte nicht gespeichert werden.\n", de:"Die Datei konnte nicht gespeichert werden.\n"},
		errorInfo:{en:"Fehler bei der Ausführung: ", de:"Fehler bei der Ausführung: "},		
		versionWarning:{en:"To run this script InDesign CS4 is required", de:"Für dieses Skript wird mindestens InDesign CS4 benötigt"},
		
		// createEndnotes.jsx		
		menuTitle:{en:"Convert Footnotes to Endnotes v%1", de:"Fußnoten zu Endnoten konvertieren v%1"},		
		resultInfo:{en:"Es wurden [%1] Fußnoten zu Endnoten konvertiert!", de:"Es wurden [%1] Fußnoten zu Endnoten konvertiert!"},
		noTextInDoc:{en:"No text in document", de:"Es ist kein Text im Dokument enthalten"},
		
		methodPanel:{en:"Mode",de:"Verarbeitungsmodus"},
		splitByHeading:{en:"Split by Parargaph Style",de:"Anhand von Absatzformat trennen"},
		continuousNumbering:{en:"Continuous Numbering",de:"Fortlaufend nummerieren"},		
		
		scopePanel:{en:"Area",de:"Bereich"},
		scopeDoc:{en:"Document",de:"Gesamtes Dokument"},
		scopeStory:{en:"Selected Story",de:"Ausgewählten Textabschnitt"},
		
		splitFormatPanel:{en:"Split endnote configuration",de:"Formatpräfix an dem die Endnoten geteilt werden"},
		splitByHeadingStyle:{en:"Split Parargaph Style/Heading",de:"Format zur Aufteilung in Abschnitte"},
		endNoteSplitHeadingParagraphStyle:{en:"Parargaph Style for repeated Headings",de:"Absatzformat wiederholte Überschriften"},
		formatWarnung:{en:"Caution: Any Text formatted in Parargaph Style for repeated Headings will be deleted. Use only for splitting Endnotes!",de:"Texte mit diesem Absatzformat werden gelöscht, verwenden Sie dieses Format nur für den Endnotenblock!"},
		
		formatPanel:{en:"Endnote styling",de:"Formate der Endnoten"},
		endnoteParagraphStyle:{en:"Parargaph Style endnote",de:"Absatzformat Endnote"},
		endnoteFollowParagraphStyle:{en:"Parargaph Style followup paragraph",de:"Absatzformat Folgeabsatz"},
		endnoteMarkerCharacterStyle:{en:"Characater Style endnote marker",de:"Zeichenformat Endnotenmarker"},
		
		endNoteHeadingPanel:{en:"Endnote Block",de:"Endnotentitel"},
		endNoteHeading:{en:"Heading",de:"Titelzeile"},
		endNoteHeadingParagraphStyle:{en:"Parargaph Style Heading",de:"Absatzformat Endnotentitel"},
		cancelButton:{en:"Cancel",de:"Abbrechen"},
		okButton:{en:"Convert",de:"Konvertieren"},
		
		
		invalidSelection:{en:"Invalid Selection", de:"Ungültige Auswahl"},
		headingStyleFail :{en:"Die von Ihnen gewünschte Überschrift [%1] stimmt nicht mit dem Überschriftentext [%2] im Dokument überein. \n\nBitte prüfen Sie das Ergebnis!", de:"Die von Ihnen gewünschte Überschrift [%1] stimmt nicht mit dem Überschriftentext [%2] im Dokument überein. \n\nBitte prüfen Sie das Ergebnis!"},
		statusFail:{en:"Unklarer Status! - Bitte senden Sie das Dokument an den Support!", de:"Unklarer Status! - Bitte senden Sie das Dokument an den Support!"},
		numberingFail:{en:"Folgeabsatz nicht gefunden! Nummerierung ggf. fehlerhaft!", de:"Folgeabsatz nicht gefunden! Nummerierung ggf. fehlerhaft!"},
		newPagesAdded:{en:"Es wurden %1 Seiten hinzugefügt. Bitte prüfen Sie den Umfang", de:"Es wurden %1 Seiten hinzugefügt. Bitte prüfen Sie den Umfang"},
		positionFail:{en:"Es ist ein Fehler bei der Endnotenpositionsanalyse aufgetreten!\nBitte kontaktieren Sie den Support!", de:"Es ist ein Fehler bei der Endnotenpositionsanalyse aufgetreten!\nBitte kontaktieren Sie den Support!"},		
		samePStyle:{en:"Das Absatzformat [%1] wurde auch für die Folgeabsätze ausgewählt, dies führt ggf. zu Nummerierungsfehlern! Das Format wurde dupliziert.", de:"Das Absatzformat [%1] wurde auch für die Folgeabsätze ausgewählt, dies führt ggf. zu Nummerierungsfehlern! Das Format wurde dupliziert."},
		endnoteStyleNumberingFail:{en:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] aktiviert.", de:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] aktiviert."},
		crossrefFormatFail:{en:"Das Querverweisformat [%1] ist bereits vorhanden.\nDas ausgewählte aber abweichende Zeichenformat [%2] wurde eingestellt!", de:"Das Querverweisformat [%1] ist bereits vorhanden.\nDas ausgewählte aber abweichende Zeichenformat [%2] wurde eingestellt!"},
		endnoteStyleNumberingDeactivate:{en:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] deaktiviert.", de:"Im Absatzformat [%1] wurde die Option \n[Aufzählungszeichen und Nummerierung] -> [Listentyp: Nummerierung] deaktiviert."},
		headingFail:{en:"Für den Titel muss mindestens ein Zeichen eingegeben werden.",de:"Für den Titel muss mindestens ein Zeichen eingegeben werden."},
		styleSelectionFail:{en:"Fehler bei der Formatauswahl", de:"Fehler bei der Formatauswahl"},
		styleSelectionFailSection:{en:"Fehler bei der Formatauswahl für die Abschnittsbildung", de:"Fehler bei der Formatauswahl für die Abschnittsbildung"},
		

		// deleteEndnotes.jsx
		noEndnoteOrMarker:{en:"Die Einfügemarke muss innerhalb einer Endnote oder vor dem Endnotenmarker platziert sein.", de:"Die Einfügemarke muss innerhalb einer Endnote oder vor dem Endnotenmarker platziert sein."},
		deleteEndnoteName:{en:"Remove endnote",de:"Endnote entfernen"},
		confirmEndnoteDelete:{en:"Remove Endnote %1 \n\n%2",de:"Endnote löschen %1 \n\n%2"},

	},


	// Careful with changes below, changing options might break the update process of previously converted documents
	convertAllStories:true,
	convertSelection:false,
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
	
	cStyleEndnoteMarker:undefined,
	cStyleEndnoteMarkerIndex:0,
	cStyleEndnoteMarkerLabel:"px:Foot2EndnoteCharacterStyle",	
	
	dokParagraphStylePrefixes:[],
	dokParagraphStylePrefixStyles:[],
	
	pStylePrefixMarkerLabel:"px:Foot2EndnoteSplitPrefix",
	numberBySectionLabel:"px:numberBySection",
	
	foot2EndCounter:0,
	debug:false,
	showGui:true,
	logFileName:"endnoteLog.txt",
	ids:undefined,
	version:"1.2-2016-01-15"
}
