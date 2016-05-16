#include "idsTest.jsx"
#include "idsHelper.jsx"
#include "../createEndnotes.jsx"
#include "../jumpBetweenMarkerAndNote.jsx"
#include "../deleteEndnotes.jsx"

runTests()

function runTests() {
	idsTesting.logToConsole(false);
	
	// Override Settings in Skripts
	px.debug = true;
	px.showGui = false;
	
	px.ids = idsTools();
	
	px.logFile = File ( getScriptFolderPath() + "/testLog.txt");
	if (px.logFile.exists) {
		px.logFile.remove();
	}
	initLog(px.logFile);
	
	px.log.disableAlerts(true);

	// Run Integration Tests 
	test_01();

	// Show Test results 
	idsTesting.htmlReport();
	
	// Close 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
}




// Do the test_01 Fussnotentest_nachtraeglicheEndnotenAmAnfang.indd  Beim nachträglichen Einfügen von Fußnoten soll die Umwandlung in eine Endnote ohne erneute Generierung des Endnotenverzeichnisses erfolgen. 
function test_01() {
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;

	idsTesting.insertBlock("test_01");
	var testFile = File(getScriptFolderPath() + "/localTestFiles/Fussnotentest_nachtraeglicheEndnotenAmAnfang.indd");
	var dokTest = app.open(testFile);
	getStyleInformation (dokTest);
	
	foot2end(dokTest);
	
	var resultString = readTextFile(px.logFile);
	
	idsTesting.assertStringInFile("Correct Error Message if Endnotes do not reside in the same story", localize(px.ui.endnoteStoryMoved) , px.logFile);

	dokTest.close(SaveOptions.NO);
}


function readTextFile (_file, _encoding) {
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