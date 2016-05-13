#include "idsTest.jsx"
#include "idsHelper.jsx"
#include "../createEndnotes.jsx"
#include "../jumpBetweenMarkerAndNote.jsx"
#include "../deleteEndnotes.jsx"

runTests()

function runTests() {

	idsTesting.logToConsole(false);

	test_01();

	idsTesting.htmlReport();

	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;

}




// Do the test_01
function test_01() {
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;

	idsTesting.insertBlock("test_01");
	var testFile = File(getScriptFolderPath() + "/publicTestFiles/endnoteTest.idml");
	var dokTest = app.open(testFile);
	
	idsTesting.assertEquals("This is a test ", true, "test" == "test");

	dokTest.close(SaveOptions.NO);
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