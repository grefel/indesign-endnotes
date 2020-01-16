//@include "idsTest.jsx"
//@include "../Scripts Panel/lib/idEndnotes.jsx"

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
	var testFile = File(getScriptFolderPath() + "/publicTestFiles/01_endnoteTest.idml");
	var testDok = app.open(testFile);
	
	idsTesting.insertBlock("Document Infos before run ... ");
	idsTesting.assertEquals("Keine Hyperlinks im Dokument", 0, testDok.hyperlinks.length );
	idsTesting.assertEquals("Keine paragraphDestinations im Dokument", 0, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("Keine crossReferenceSources im Dokument", 0, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("Keine hyperlinkTextSources im Dokument", 0, testDok.hyperlinkTextSources.length );
	
	createEndnotes(testDok);
	
	idsTesting.insertBlock("Document infos after run ...");
	idsTesting.assertEquals("11 Hyperlinks im Dokument", 11, testDok.hyperlinks.length );
	idsTesting.assertEquals("11 paragraphDestinations im Dokument", 11, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("11 crossReferenceSources im Dokument", 11, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("Keine hyperlinkTextSources im Dokument", 0, testDok.hyperlinkTextSources.length );
	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}

	idsTesting.insertBlock("Test createEndnotes() with anchored frame");
	var testFile = File(getScriptFolderPath() + "/publicTestFiles/01_endnoteTestAnchoredFrame.idml");
	var testDok = app.open(testFile);
	
	idsTesting.insertBlock("Document Infos before run ... ");
	idsTesting.assertEquals("Keine Hyperlinks im Dokument", 0, testDok.hyperlinks.length );
	idsTesting.assertEquals("Keine paragraphDestinations im Dokument", 0, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("Keine crossReferenceSources im Dokument", 0, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("Keine hyperlinkTextSources im Dokument", 0, testDok.hyperlinkTextSources.length );
	
	createEndnotes(testDok);
	
	idsTesting.insertBlock("Document infos after run ...");
	idsTesting.assertEquals("11 Hyperlinks im Dokument", 12, testDok.hyperlinks.length );
	idsTesting.assertEquals("11 paragraphDestinations im Dokument", 12, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("11 crossReferenceSources im Dokument", 12, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("Keine hyperlinkTextSources im Dokument", 0, testDok.hyperlinkTextSources.length );
	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}


	idsTesting.insertBlock("Test createBacklinks()");
	log.clearLog();	

	var testDok = app.open(File (getScriptFolderPath() + "/publicTestFiles/01_brokenBacklink.idml"));

	testDok.save(File (getScriptFolderPath() + "/publicTestFiles/num-Formate-kaputteBacklinks" + new Date().getTime() +  ".indd"));

	addBacklinks(testDok);
	
	idsTesting.assertRegExInFile("Das Ziel des Hyperlinks [Querverweis 5] mit dem Quelltext [1] wurde gelöscht.",  /Das Ziel des Hyperlinks \[Querverweis 5\] mit dem Quelltext \[1\] wurde gelöscht./ , logFile);

	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}

	idsTesting.insertBlock("Update existing Endnote Block");
	var testDok = app.open(File (getScriptFolderPath() + "/publicTestFiles/01_update.idml"));
	
	
	createEndnotes(testDok);
	idsTesting.assertStringNotInFile("Keine Fehlermeldung für leeren Absatz", "empty Pargraph(s) with endnote format", logFile);
	idsTesting.assertGREPInDoc("Endnote wurde in der korrekten Position eingfügt", "wird\\n\\rDie Birne\\rnachträglich hinzugefügte Fußnote\\rDer Brom", testDok);

	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}

}

// Test for edge cases and tickets
function specialTests() {
	idsTesting.insertBlock("Fußnoten in Tabellen/Rahmen #3327");
	log.clearLog();	

	var testDok = app.open(File (getScriptFolderPath() + "/publicTestFiles/02_endnoteInAnchoredFrameAndTable.idml"));
	
	idsTesting.insertBlock("Document Infos before run ... ");
	idsTesting.assertEquals("5 Hyperlinks im Dokument", 5, testDok.hyperlinks.length );
	idsTesting.assertEquals("4 paragraphDestinations im Dokument", 4, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("4 crossReferenceSources im Dokument", 4, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("1 hyperlinkTextSources im Dokument", 1, testDok.hyperlinkTextSources.length );
	
	createEndnotes(testDok);
	
	idsTesting.insertBlock("Document infos after run ...");
	idsTesting.assertEquals("8 Hyperlinks im Dokument", 8, testDok.hyperlinks.length );
	idsTesting.assertEquals("7 paragraphDestinations im Dokument", 7, testDok.paragraphDestinations.length );
	idsTesting.assertEquals("7 crossReferenceSources im Dokument", 7, testDok.crossReferenceSources.length );
	idsTesting.assertEquals("Keine hyperlinkTextDestinations im Dokument", 0, testDok.hyperlinkTextDestinations.length );
	idsTesting.assertEquals("1 hyperlinkTextSources im Dokument", 1, testDok.hyperlinkTextSources.length );	
		
	if (closeTestDok) {
		testDok.close(SaveOptions.NO);
	}

	idsTesting.insertBlock("Verschiedene Stories gehen nicht #3327");
	var testDok = app.open(File (getScriptFolderPath() + "/publicTestFiles/02_endnotesInDifferentStories.idml"));
	createEndnotes(testDok);
	idsTesting.assertRegExInFile("Endnoten in verschiedenen Stories.",  /In mehr ale einem Textabschnitt befinden sich Endnoten/ , logFile);


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