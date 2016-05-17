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
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
//~ 	test_01();
//~ 	test_02();
//~ 	test_03();
	test_04();

	// Show Test results 
	idsTesting.htmlReport();
	
	// Close 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
}




// Beim nachträglichen Einfügen von Fußnoten muss sich das Endnotenverzeichnis noch in der gleichen Story befinden. 
function test_01() {
	idsTesting.insertBlock("With subsequent insertion of footnotes the endnote directory must still be in the same story");
	var testFile = File(getScriptFolderPath() + "/localTestFiles/Fussnotentest_nachtraeglicheEndnotenAmAnfang.indd");
	var dokTest = app.open(testFile);
	getStyleInformation (dokTest);
	readStyles(dokTest);
	
	foot2end(dokTest);
	
	var resultString = readTextFile(px.logFile);
	
	idsTesting.assertStringInFile("Correct Error Message if Endnotes do not reside in the same story", localize(px.ui.endnoteStoryMoved) , px.logFile);

	dokTest.close(SaveOptions.NO);
}


// U_Backmatter_Num-Formate mit umsetzen ... 
function test_02() {
	idsTesting.insertBlock("Problems with U_Backmatter_Num-Formate");
	var testFile = File(getScriptFolderPath() + "/localTestFiles/num-Formate.indd");
	var dokTest = app.open(testFile);
	getStyleInformation (dokTest);
	readStyles(dokTest);
	
	foot2end(dokTest);
	
	var resultString = readTextFile(px.logFile);
	
	idsTesting.assertStringInFile("Correct Error Message if Endnotes do not reside in the same story", localize(px.ui.endnoteStoryMoved) , px.logFile);

	dokTest.close(SaveOptions.NO);
}

// alte Endnoten werden entfernt, Vor Kapitel 4 wird Inhalt merkwürdig zerpflückt, die Überschrift der neu generierten Endnoten ist inkorrekt. 
function test_03() {
	idsTesting.insertBlock("Alte Endnoten werden entfernt, Vor Kapitel 4 wird Inhalt merkwürdig zerpflückt, die Überschrift der neu generierten Endnoten ist inkorrekt.");
	var testFile = File(getScriptFolderPath() + "/localTestFiles/Fußnotentest_vor_neuen_Kap.indd");
	var dokTest = app.open(testFile);
	getStyleInformation (dokTest);
	readStyles(dokTest);
	
	foot2end(dokTest);
	
	var resultString = readTextFile(px.logFile);
	
	idsTesting.assertStringInFile("Correct Error Message if Endnotes do not reside in the same story", localize(px.ui.endnoteStoryMoved) , px.logFile);

	dokTest.close(SaveOptions.NO);
}


// 
// Endnotenverweis in (Kapitel-)Überschriften 
function test_04() {
	idsTesting.insertBlock("Endnotenverweis in (Kapitel-)Überschriften werden nicht verarbeitet.");
	var testFile = File(getScriptFolderPath() + "/localTestFiles/Fussnotentest_FN_in_Ueberschrift.indd");
	var dokTest = app.open(testFile);
	getStyleInformation (dokTest);
	readStyles(dokTest);
	
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