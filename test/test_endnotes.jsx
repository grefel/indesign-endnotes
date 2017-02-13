#include "idsTest.jsx"
#include "idsHelper.jsx"
#include "../createEndnotes.jsx"
#include "../jumpBetweenMarkerAndNote.jsx"
#include "../deleteEndnote.jsx" 



runTests()

function runTests() {
	closeTestDok = false;
	idsTesting.logToConsole(false);
	
	// Override Settings in Skripts
	px.debug = true;
	px.showGui = false;
		
	px.logFile = File ( getScriptFolderPath() + "/testLog.txt");
	if (px.logFile.exists) {
		px.logFile.remove();
	}
	initLog(px.logFile);
	
	log.disableAlerts(true);

	// Run Integration Tests 
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	
	basicIntegrationTest();	

	// Show Test results 
	idsTesting.htmlReport();
	
	// Close 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
}


// Beim nachträglichen Einfügen von Fußnoten muss sich das Endnotenverzeichnis noch in der gleichen Story befinden. 
function basicIntegrationTest() {
	idsTesting.insertBlock("Create Endnotes from Footnotes");
	idsTesting.insertBlock("Check Document");
	var testFile = File(getScriptFolderPath() + "/publicTestFiles/endnoteTest.idml");
	var dokTest = app.open(testFile);
	
	idsTesting.assertEquals("Keine Hyperlinks im Dokument", 0, dokTest.hyperlinks.length );
	idsTesting.assertEquals("Keine paragraphDestinations im Dokument", 0, dokTest.paragraphDestinations.length );
	idsTesting.assertEquals("Keine crossReferenceSources im Dokument", 0, dokTest.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, dokTest.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("Keine hyperlinkTextSources im Dokument", 0, dokTest.hyperlinkTextSources.length );
	
	var endnoteStory = getEndnoteStory(dokTest);
	getStyleInformation (dokTest);
	readStyles(dokTest);
	foot2end(dokTest, endnoteStory);

	idsTesting.insertBlock("Endnotes created?");

	idsTesting.assertEquals("11 Hyperlinks im Dokument", 11, dokTest.hyperlinks.length );
	idsTesting.assertEquals("11 paragraphDestinations im Dokument", 11, dokTest.paragraphDestinations.length );
	idsTesting.assertEquals("11 crossReferenceSources im Dokument", 11, dokTest.crossReferenceSources.length );
	idsTesting.assertEquals("0 hyperlinkTextDestinations im Dokument", 0, dokTest.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("0 hyperlinkTextSources im Dokument", 0, dokTest.hyperlinkTextSources.length );

	idsTesting.insertBlock("Special Test?");

	
	var resultString = idsTools.readTextFile(px.logFile);	
//~ 	idsTesting.assertStringInFile("Correct Error Message if Endnotes do not reside in the same story", localize(px.ui.endnoteStoryMoved) , px.logFile);

	if (closeTestDok) {
		dokTest.close(SaveOptions.NO);
	}
}





/** Get Filepath from current script  */
/*Folder*/ function getScriptFolderPath() {
	var skriptPath;
	
	try {
		skriptPath  = app.activeScript.parent;
	} 
	catch (e) { 
		/* We're running from the ESTK*/
		skriptPath = File(e.fileName).parent;
	}
	if (app.extractLabel("px:debugID") == "Jp07qcLlW3aDHuCoNpBK") {
	   skriptPath = Folder("/Users/hp/oc/publishingX/15-Auftraege/2016-02-29_oew_medienneutral/indd-skript");
	}	
	return skriptPath;
}