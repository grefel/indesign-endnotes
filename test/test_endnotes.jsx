#include "idsTest.jsx"
#include "../createEndnotes.jsx"
#include "../jumpBetweenMarkerAndNote.jsx"
#include "../deleteEndnote.jsx" 
#include "../createBacklinks.jsx" 


runTests()

function runTests() {
	closeTestDok = false;
	idsTesting.logToConsole(false);
	
	// Override Settings in Skripts
	px.debug = true;
	px.showGui = false;
	
	logFile = initLog()
	log.clearLog();	
	log.disableAlerts(true);

	// Run Tests 
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	
	basicIntegrationTest();
	specialTests();	

	// Show Test results 
	idsTesting.htmlReport();
	
}


// Test main function 
function basicIntegrationTest() {
	idsTesting.insertBlock("Create Endnotes from Footnotes");
	idsTesting.insertBlock("Test createEndnotes()");
	var testFile = File(getScriptFolderPath() + "/publicTestFiles/endnoteTest.idml");
	var testDok = app.open(testFile);
	
	idsTesting.insertBlock("Document Infos before run ... ");
	idsTesting.assertEquals("Keine Hyperlinks im Dokument", 0, testDok.hyperlinks.length );
	idsTesting.assertEquals("Keine paragraphDestinations im Dokument", 0, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("Keine crossReferenceSources im Dokument", 0, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("Keine hyperlinkTextSources im Dokument", 0, testDok.hyperlinkTextSources.length );
	
	createEndnotes();
	
	idsTesting.insertBlock("Document infos after run ...");
	idsTesting.assertEquals("11 Hyperlinks im Dokument", 11, testDok.hyperlinks.length );
	idsTesting.assertEquals("11 paragraphDestinations im Dokument", 11, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("11 crossReferenceSources im Dokument", 11, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("0 hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("0 hyperlinkTextSources im Dokument", 0, testDok.hyperlinkTextSources.length );
	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}


	idsTesting.insertBlock("Test createBacklinks()");
	log.clearLog();	

	var testDok = app.open(File (getScriptFolderPath() + "/publicTestFiles/num-Formate-kaputteBacklinks.idml"));
	testDok.save(File (getScriptFolderPath() + "/publicTestFiles/num-Formate-kaputteBacklinks.indd"));

	createBacklinks();
	
	idsTesting.assertRegExInFile("Ein Hyperlink [ID: 351] hat kein Ziel mehr",  /Ein Hyperlink \[ID: 351\] hat kein Ziel mehr/ , logFile);
	
	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}
}

// Test for edge cases and tickets
function specialTests() {
	idsTesting.insertBlock("Fußnoten in Tabellen/Rahmen #3327");
	log.clearLog();	

	var testDok = app.open(File (getScriptFolderPath() + "/publicTestFiles/num-Formate-AnmerkunginTabelle.idml"));
		
	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}
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