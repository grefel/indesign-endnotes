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
I picked the idea of using InDesign cross references for endnotes from Peter Kahrel. Peters solution is still a good source of inspiration and can be found here [http://www.kahrel.plus.com/indesign/footnotes.html](http://www.kahrel.plus.com/indesign/footnotes.html)

@Version: 1.2
@Date: 2016-01-06
@Author Gregor Fellenz http://www.publishingx.de/
*/

#include config.jsx 
// Debug Einstellungen publishingX 
if (app.extractLabel("px:debugID") == "Jp07qcLlW3aDHuCoNpBK_Gregor") {
     px.debug = true;
}

// idsHelper.jsx
{
	/** 
* License: Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) http://creativecommons.org/licenses/by-sa/3.0/
* @fileoverview InDesign JavaScript Extension Library ...
 * {@link http://gisbert.wikisquare.de/indesignjs/} 
 *
 * @author Gregor Fellenz
 * @version 0.3
 * @date 10.10.2011
 */


/**
* Helper and tools for common InDesign scripting tasks
* @class <b>idsTools</b> contains InDesign JavaScript Extensions. Include this library and use the idsTools object in your script.<br/><br/><code>#include "idsHelper.jsx"<br/>[...]<br/>_ids = idsTools()<br/>_ids.getPageByObject(_pageItem)</code><br/>
*/
var idsTools = function () {
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
		* @param {Paragraph} _par The reference Paragraph 
		* @return {Paragraph} The next Paragraph or null
		*/
		nextParagraph : function (_par) {
			var _lastCharLetzterIndex = _par.characters[-1].index;
			var _firstCharNaechster = _par.parentStory.characters[_lastCharLetzterIndex + 1];
			if (_firstCharNaechster.isValid ) return _firstCharNaechster.paragraphs[0];
			else return null;
		},

		/**
		* Resolves the next Character object. Use this function instead of <code>nextItem()</code> 
		* from the collection Characters as this method is much quicker with long Text objects.
		* @param {Character} _char The reference Character
		* @return {Character} The next Character or null
		*/
		nextChar : function (_char) {
			var _lastCharLetzterIndex = _char.index;
			var _firstfirstCharNaechster = _char.parentStory.characters[_lastCharLetzterIndex + 1];
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
			var _lastTC = _story.textContainers[_story.textContainers.length - 1];
			var _run = true;
			while (_lastTC.overflows && _run) {
				var _last = _story.textContainers.length -1;
				if (_story.textContainers[_last].characters.length == 0 && _story.textContainers[_last -1].characters.length == 0 && _story.textContainers[_last -2].characters.length ==0 ) _run = false;
				var _page = this.getPageByObject(_lastTC);
				var _tf = this.addPageTextFrame(_page);
				_lastTC.nextTextFrame = _tf;
				_lastTC = _tf;
			}
//~ 			while (_story.textContainers.length > 1 && _lastTC.characters.length == 0) {
//~ 				var _page = this.getPageByObject(_lastTC);
//~ 				_page.remove();
//~ 				_lastTC = _story.textContainers[_story.textContainers.length - 1];
//~ 			}
			return _lastTC;
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
				textDefaultCharStyle:dok.textDefaults.appliedCharacterStyle
			}		
			dok.textDefaults.appliedCharacterStyle = dok.characterStyles[0];
			dok.textDefaults.appliedParagraphStyle = dok.paragraphStyles[1];
//~ 	px.idDocument.pageItemDefaults.appliedGraphicObjectStyle
//~ 	px.idDocument.pageItemDefaults..appliedGridObjectStyle
//~ 	px.idDocument.pageItemDefaults..appliedTextObjectStyle		
			dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
			dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
			dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
			dok.zeroPoint = [0,0]
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
		},
		trim : function (string) {
			string = string.replace(/^\s+/g,"");
			string = string.replace(/\s+$/g,"");
			return string;
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
}

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

// By Harbs http://forums.adobe.com/message/2800152#2800152
//~ function GetItemFromCollection(label,collection){
//~   var scriptVersion = app.scriptPreferences.version;
//~   if( parseFloat(scriptVersion) > 6){app.scriptPreferences.version = 6}
//~   var items = collection.item(label).getElements();
//~   app.scriptPreferences.version = scriptVersion;
//~   if(items.length==0){return null}
//~   if(items.length==1){return items[0]}
//~   return items;
//~ }



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
	if (parseInt(app.version) < 6) {
		alert(localize(px.ui.versionWarning));
		return;
	}
	
	if (app.documents.length == 0) {
		return;
	}

	var dok = app.documents[0];
	if (dok.stories.length == 0) {
		alert(localize(px.ui.noTextInDoc)); 
		return;
	}

	// Dokument gespeichert? 
	if ((!dok.saved || dok.modified) && !px.debug) {
		var userLevel = app.scriptPreferences.userInteractionLevel;
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL; 

		if ( confirm ( localize(px.ui.saveDocInfo) , undefined, localize(px.ui.saveDoc))) {
			try {
				dok = dok.save();
			} catch (e) { 
				alert (localize(px.ui.saveDocFail) + e);
				return;
			}		
			app.scriptPreferences.userInteractionLevel = userLevel;
		}
		else { // User does not want to save -> exit;
			app.scriptPreferences.userInteractionLevel = userLevel;
			return; 
		}
	}

	px.ids = idsTools();
	
	// Read Existing Style mapping from document
	getStyleInformation (dok);
	readStyles(dok);

	var logFile = File ( getScriptFolderPath() + "/" + px.logFileName );
	initLog(logFile);
	
	var userLevel = app.scriptPreferences.userInteractionLevel;	
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	var redraw = app.scriptPreferences.enableRedraw;
	app.scriptPreferences.enableRedraw = false;

    //Ebenen entsperren und sichtbar machen
	var layerState = [];
	for (var i = 0; i < dok.layers.length; i++) {
		layerState[i] = [dok.layers[i].visible, dok.layers[i].locked];
		dok.layers[i].visible = true;
		dok.layers[i].locked = false;
	}

	if (px.debug) {		
		foot2end (dok);
	}
	else {
		try {
			foot2end (dok);
		} catch (e) {
			px.log.warnAlert(localize (px.ui.errorInfo) +  e + "\nLine: " + e.line); 
		}
	}
		
    // Ebenen zurücksetzen
	for (var i = 0; i < dok.layers.length; i++) {
		dok.layers[i].visible = layerState[i][0];
		dok.layers[i].locked = layerState[i][1];
	}
	    
	app.scriptPreferences.userInteractionLevel = userLevel; 
	app.scriptPreferences.enableRedraw = redraw;
	
	var resultInfo = localize(px.ui.resultInfo, px.foot2EndCounter);
	if (px.showGui) {
		alert (resultInfo);
	}
	else {
		px.log.debug();
	}
}
	
// Main Script 
function foot2end (dok) {
	if (px.showGui) {
		if ( getConfig() == 2) return;
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
	// Save Style and Heading for Updates 
	dok.insertLabel(px.pStyleEndnoteLabel, px.pStyleEndnoteName);
	dok.insertLabel(px.pStyleEndnoteFollowLabel, px.pStyleEndnoteFollowName);
	dok.insertLabel(px.pStyleEndnoteHeadingLabel, px.pStyleEndnoteHeadingName);
	dok.insertLabel(px.pStyleEndnoteSplitHeadingLabel, px.pStyleEndnoteSplitHeadingName);
	dok.insertLabel(px.cStyleEndnoteMarkerLabel, px.cStyleEndnoteMarkerName);
	dok.insertLabel(px.endnoteHeadingStringLabel, px.endnoteHeadingString);
	dok.insertLabel(px.pStylePrefixMarkerLabel, px.pStylePrefix);
	dok.insertLabel(px.numberBySectionLabel, px.numberBySection +"");
	

	checkStyles (dok);
						
	// Die notwendigen Stories einsammeln
	var stories = [];
	if (px.convertAllStories) {
		stories = dok.stories.everyItem().getElements();
	}
	else {
		try {
			stories.push(app.selection[0].parentStory);
		}
		catch (e) {
			alertMsg (localize(px.ui.invalidSelection));
			return;
		}
	}
	var hLinksPerStory = getCurrentEndnotes(dok, stories);
	// Fußnoten zu Endnoten konvertieren 
	var story, firstHlink, firstHlinkIndex, headingParagraph, footnote, endnote, endnote_link, cue, hlink, nextHlink,  hyperLinkID;	
	var oldPages = dok.pages.length;
	for (var j = 0; j < stories.length; j++) {
		story = stories[j];
		if (story.footnotes.length > 0) {
			if (px.showGui) {
				var pBar = px.ids.getProgressBar(localize(px.ui.menuTitle, px.version));
				pBar.reset("Verarbeite Textabschnitt " + (j+1) + " von " + stories.length, story.footnotes.length);
			}
			// EndnotenTitel einfügen  					hLinksPerStory[storyID].push([hLink.id, hLink.source.sourceText.index]);
			hyperLinkID =  hLinksPerStory[story.id][1][0];
			if (hyperLinkID == "last") {
				story.insertionPoints[-1].contents = "\r" + px.endnoteHeadingString;
				story.insertionPoints[-1].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteHeading;
			}
			else {
				firstHlink = dok.hyperlinks.itemByID(hyperLinkID);
				firstHlinkIndex = firstHlink.destination.destinationText.insertionPoints[0].index;
				if (firstHlink.destination.destinationText.parentStory.id != story.id) {
					px.log.warnAlert( localize(px.ui.endnoteStoryMoved) );
					return;
				}
				firstEndnote = story.insertionPoints[firstHlinkIndex].paragraphs[0];
				headingParagraph = story.insertionPoints[firstHlinkIndex-1].paragraphs[0];
				if (px.numberBySection && headingParagraph.appliedParagraphStyle == px.pStyleEndnoteSplitHeading) {
					headingParagraph = story.insertionPoints[headingParagraph.insertionPoints[0].index-1].paragraphs[0];
				}
				if (headingParagraph.contents != px.endnoteHeadingString + "\r") {
					alert (localize (px.ui.headingStyleFail , px.endnoteHeadingString, headingParagraph.contents.replace(/\r/g,'') ));
					headingParagraph.contents = px.endnoteHeadingString + "\r";
				}
				headingParagraph.appliedParagraphStyle = px.pStyleEndnoteHeading;
				firstEndnote.appliedParagraphStyle = px.pStyleEndnote;
			}
		
			// Fußnoten konvertieren 
			story.insertionPoints[-1].contents = "\r";
			einfuegeIndex = story.insertionPoints[-1].index;

			var footn = story.footnotes;
			for (var i = footn.length-1; i >=0 ; i--) {
				if (px.showGui) {
					pBar.hit();
				}
				footnote = footn[i];
				
				trimFootnoteSpace(footnote);
				// Formatieren 				
				footnote.paragraphs[0].applyParagraphStyle (px.pStyleEndnote, false);
				if(footnote.paragraphs.length > 1) {
					footnote.paragraphs.itemByRange(1,footnote.paragraphs.length-1).applyParagraphStyle (px.pStyleEndnoteFollow, false);
				}				
				
				var fnIndex = footnote.storyOffset.index;
				hyperLinkID = getPosition(fnIndex, hLinksPerStory[story.id]);
				if (hyperLinkID == null) {
					// Fehler bei getPosition();
					return;
				}
				if (hyperLinkID == "first") {
					px.log.warnAlert( localize(px.ui.statusFail) ); 
				}
				else if (hyperLinkID == "last") {
					endnote = footnote.texts[0].move (LocationOptions.after, story.insertionPoints[einfuegeIndex]);
				}
				else {
					// Vor dem Hyperlink mit der ID muss die Endnote eingefügt werden:
					nextHlink = dok.hyperlinks.itemByID(hyperLinkID);					
					endnote = footnote.texts[0].move (LocationOptions.BEFORE, nextHlink.destination.destinationText.insertionPoints[0]);
				}
			
				// Verlinkung herstellen 
				endnote_link = dok.paragraphDestinations.add (endnote.insertionPoints[0]);
				endnote_link.insertLabel(px.hyperlinkLabel, "true");
				cue = dok.crossReferenceSources.add (footn[i].storyOffset, px.crossRefStyleEndnote);
				einfuegeIndex++;
				cue.insertLabel(px.hyperlinkLabel, "true");
				hlink = dok.hyperlinks.add (cue, endnote_link, {visible: false});
				hlink.insertLabel(px.hyperlinkLabel, "true");

				// Rückverlinkung
				endnote_backlink = dok.hyperlinkTextDestinations.add (footn[i].storyOffset);
				endnote_backlink.insertLabel(px.hyperlinkLabel, "backlink");
				hyperlinkTextSource = dok.hyperlinkTextSources.add(endnote);
				hyperlinkTextSource.insertLabel(px.hyperlinkLabel, "backlink");
				hlink = dok.hyperlinks.add (hyperlinkTextSource, endnote_backlink, {visible: false});
				einfuegeIndex++;
				hlink.name = "EndnoteBacklink_" + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + new Date().getTime();
				hlink.insertLabel(px.hyperlinkLabel, "backlink");
				
				
				px.foot2EndCounter++;
			} // for
		
			
			// Wenn wir nach Section splitten müssen, werden jetzt die Positionen der Sections ausgewertet die ggf. zugeordnent werden müssen
			// Problem zweiter Durchlauf, hier muss geprüft werden ob die neue eingefügte Endnote bereits die richtige Überschrift hat.
			if (px.numberBySection) {
				sectionIndexArray = getSections(story);
				
				// Alte Abschnittsüberschriften löschen...
				app.findGrepPreferences = NothingEnum.NOTHING;
				app.changeGrepPreferences = NothingEnum.NOTHING;
				app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnoteSplitHeading;
				story.changeGrep();
				
//~ 				for (var h = 0; h < dok.hyperlinks.length; h++) {
//~ 					hlink = dok.hyperlinks[h];
//~ 					if ( hlink.extractLabel(px.hyperlinkLabel) == "true") {
//~ 						nextPar = px.ids.nextParagraph(hlink.destination.destinationText.paragraphs[0]);
//~ 						while (nextPar && nextPar.appliedParagraphStyle.id == px.pStyleEndnoteSplitHeading.id) {
//~ 							nextPar.contents = "";
//~ 							nextPar = px.ids.nextParagraph(hlink.destination.destinationText.paragraphs[0]);
//~ 						}
//~ 					}
//~ 				}
				
				// Hyperlinks wieder einsammeln... 
				endnotenStartEndPositions = [];
				for (var h = 0; h < dok.hyperlinks.length; h++) {
					hlink = dok.hyperlinks[h];
					if ( hlink.extractLabel(px.hyperlinkLabel) == "true") {
						if (hlink.source.sourceText.parentStory.id == story.id) {
							endnotenStartEndPositions.push([hlink.destination.destinationText.index, hlink.source.sourceText.index, hlink.destination.destinationText.paragraphs[0].contents]);
						}
					}
				}
			
				// Endnoten Nummerierung wieder zurücksetzen... 
				app.findGrepPreferences = NothingEnum.NOTHING;
				app.changeGrepPreferences = NothingEnum.NOTHING;
				app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
				app.changeGrepPreferences.numberingContinue = true;
				var result = story.changeGrep();
				if (result) {
					result[0].paragraphs[0].numberingStartAt = 1;
					result[0].paragraphs[0].numberingContinue = false;
				}			

				endnotenStartEndPositions.sort(sortSecondEntry);
				
				// In length -1 steckt nur der leere String für den letzten Insertion Point der Story
				sectionCounter = sectionIndexArray.length-2;
				
				var currentSection, nextSection, endnotenIndex, endnotenTextIndex;
				
				for (var i =  endnotenStartEndPositions.length-1; i >= 0; i--) {
					// Endnoten
					endnotenTextIndex = endnotenStartEndPositions[i][1];
					endnotenIndex = endnotenStartEndPositions[i][0];
//~ 					$.writeln(endnotenStartEndPositions[i][2]);
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
						story.insertionPoints[endnotenIndex].contents = currentSection[2];
						story.insertionPoints[endnotenIndex].paragraphs[0].appliedParagraphStyle = px.pStyleEndnoteSplitHeading;
						var nextPar = px.ids.nextParagraph (story.insertionPoints[endnotenIndex].paragraphs[0]);
						if (nextPar != null) {
							nextPar.numberingStartAt = 1;
							nextPar.numberingContinue = false;
						}
						else {
							px.log.warnAlert(localize(px.ui.numberingFail));
						}
						sectionCounter--;						
					}
					else if (endnotenTextIndex < currentSectionStartIndex && sectionCounter > 0) {
						i++; // endnote zurücksetzen , weil wir gucken müssen ob es in der nächsten Section steht.
						sectionCounter--;						
					}
				}
			}					
			// Schneller fix wenn fortlaufend nummeriert wird
			else { 
				app.findGrepPreferences = NothingEnum.NOTHING;
				app.changeGrepPreferences = NothingEnum.NOTHING;
				app.findGrepPreferences.appliedParagraphStyle = px.pStyleEndnote;
				app.changeGrepPreferences.numberingContinue = true;
				var result = story.changeGrep();
				if (result) {
					result[0].paragraphs[0].numberingStartAt = 1;
					result[0].paragraphs[0].numberingContinue = false;
				}			
			}
		
			story.characters[-1].contents = "";
			deleteNotemarkers (story);
			
			// Seiten auflösen 
			px.ids.checkOverflow(story);
		} //if
	} // for

		
	if (pBar) {
		var newPages = dok.pages.length - oldPages ;
		if (dok.pages.length != oldPages ) {
			alertMsg (localize (px.ui.newPagesAdded, newPages));
		}
		dok.crossReferenceSources.everyItem().update();
		pBar.close();
	}
}

function getSections (story) {
	// die performanteste Lösung ist vermutlich nach allen AF zu suchen die mit dem Präfix anfangen und dann den SectionArray zu bauen.
	var sectionIndexArray = [[0,story.characters[0].index, ""]];
	for (var ps = 0; ps < px.dokParagraphStylePrefixStyles[px.pStylePrefix].length; ps++) {
		var pStyle = px.dokParagraphStylePrefixStyles[px.pStylePrefix][ps];
		app.findGrepPreferences = NothingEnum.NOTHING;
		app.changeGrepPreferences = NothingEnum.NOTHING;
		app.findGrepPreferences.findWhat = "^.+\\r";
		app.findGrepPreferences.appliedParagraphStyle = pStyle;
		var results = story.findGrep();
		for (var i = 0; i < results.length; i++) {
			var result = results[i];
			sectionIndexArray.push([sectionIndexArray.length,result.index+1, result.paragraphs[0].contents]);
		}
	}

	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	
	sectionIndexArray.push([sectionIndexArray.length,story.characters[-1].index, ""]);			
	sectionIndexArray.sort(sortSecondEntry);

	return sectionIndexArray;
}

function getCurrentEndnotes (dok, stories) {
	// Die aktuellen Endnoten einsammeln
	var hLink, storyID, story;	
	var hLinksPerStory = [];
	for (var j = 0; j < dok.hyperlinks.length; j++) {
		hLink = dok.hyperlinks[j];
		if (hLink.extractLabel(px.hyperlinkLabel) == "true") {
			try {
				if(hLink.destination != null) {
					storyID = hLink.source.sourceText.parentStory.id;
					if (hLinksPerStory[storyID] == undefined) {
						hLinksPerStory[storyID] = [];
						hLinksPerStory[storyID].push(["first", -1]);
					}
					px.log.debug("Ausgelesener hLink.id : " + hLink.id + " -> " + hLink.source.sourceText.index + "sourceText: " + hLink.source.sourceText.contents + " destination: " +  hLink.destination.destinationText.paragraphs[0].contents);
					hLinksPerStory[storyID].push([hLink.id, hLink.source.sourceText.index]);
				}
				else {
					px.log.warn("Ein Hyperlink [ID: " + hLink.id + "] hat kein Ziel mehr. Der Ursprungstext vermutlich gelöscht!");
				}
			} catch (e) {
				px.log.warn("Fehler bei der Verarbeitung der Hyperlinks, Hyperlinks sind eventuell nicht mehr gültig?\n" + e);
			}
		}
	}

	// Endnoten nach Position in der Story sortieren 
	for (var j = 0; j < stories.length; j++) {
		story = stories[j];
		storyID = story.id;
		px.log.debug("Endnoten für "+ storyID);

		if (hLinksPerStory[storyID]) {
			hLinksPerStory[storyID].sort(sortSecondEntry);
			hLinksPerStory[storyID].push(["last", story.insertionPoints[-1].index]);
		}
		else {
			hLinksPerStory[storyID] = [];
			hLinksPerStory[storyID].push(["first", -1]);
			hLinksPerStory[storyID].push(["last", story.insertionPoints[-1].index]);
		}
		if (px.debug) {
			for (var m =0; m < hLinksPerStory[storyID].length; m++) {
				px.log.debug(hLinksPerStory[storyID][m]);
			}
		}
	}
	
	// TODO prüfen ob die Reihenfolge in den Stories noch stimmt - Copy & Paste Bugs könnten so auffalen. 
	// Wenn ja, dann sollte erstmal nach Korrektur gefragt werden und automatisch korrigiert werden. 
	return hLinksPerStory;
}

function getPosition(index, endNoteArray) {
	for (var m =1; m < endNoteArray.length; m++) {
		if (index <= endNoteArray[m][1] && index > endNoteArray[m-1][1]) {
			return endNoteArray[m][0]; 
		} 
	}
	px.log.warnAlert(localize (px.ui.positionFail));
	return null; 
}

function deleteNotemarkers (scope) {
//~ 	// Es gibt Abstürze bei wenn der Footnote Marker am Ende des Textabschnitts steht Suche Ersetze Kombinationen in CS6
	scope.insertionPoints[-1].contents = " ";
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findChangeGrepOptions.includeFootnotes = true;
	app.findGrepPreferences.findWhat = '~F';
	var results = scope.changeGrep(true);
//~ 	for (var i = 0; i < results.length; i++) {
//~ 		results[i].contents = "";
//~ 	}
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
		if (px.debug) $.writeln ("px.pStyleEndnoteName" + px.pStyleEndnoteName);
	}	
	if (dok.extractLabel(px.pStyleEndnoteFollowLabel) != "") {
		px.pStyleEndnoteFollowName = dok.extractLabel(px.pStyleEndnoteFollowLabel);
		if (px.debug) $.writeln ("px.pStyleEndnoteFollowName" + px.pStyleEndnoteFollowName);
	}	
	if (dok.extractLabel(px.pStyleEndnoteHeadingLabel) != "") {
		px.pStyleEndnoteHeadingName = dok.extractLabel(px.pStyleEndnoteHeadingLabel);
		if (px.debug) $.writeln ("px.pStyleEndnoteHeadingName" + px.pStyleEndnoteHeadingName);
	}
	if (dok.extractLabel(px.pStyleEndnoteSplitHeadingLabel) != "") {
		px.pStyleEndnoteSplitHeadingName = dok.extractLabel(px.pStyleEndnoteSplitHeadingLabel);
		if (px.debug) $.writeln ("px.pStyleEndnoteSplitHeadingName" + px.pStyleEndnoteSplitHeadingName);
	}
	if (dok.extractLabel(px.cStyleEndnoteMarkerLabel) != "") {
		px.cStyleEndnoteMarkerName = dok.extractLabel(px.cStyleEndnoteMarkerLabel);
		if (px.debug) $.writeln ("px.cStyleEndnoteMarkerName" + px.cStyleEndnoteMarkerName);
	}
	if (dok.extractLabel(px.endnoteHeadingStringLabel) != "") {
		px.endnoteHeadingString = dok.extractLabel(px.endnoteHeadingStringLabel);
		if (px.debug) $.writeln ("px.endnoteHeadingString" + px.endnoteHeadingString);
	}
	if (dok.extractLabel(px.pStylePrefixMarkerLabel) != "") {
		px.pStylePrefix = dok.extractLabel(px.pStylePrefixMarkerLabel);
		if (px.debug) $.writeln ("px.pStylePrefix" + px.pStylePrefix);
	}
	if (dok.extractLabel(px.numberBySectionLabel) != "") {
		px.numberBySection = dok.extractLabel(px.numberBySectionLabel) == "true" ? true : false;
		if (px.debug) $.writeln ("px.numberBySection" + px.numberBySection);
	}
}

// Read all Styles for GUI and Prefix Mapping
function readStyles (dok) {
	for (var i = 1; i < dok.allParagraphStyles.length; i++) {
		var style = dok.allParagraphStyles[i];
		if (style.name == px.pStyleEndnoteName)  px.pStyleEndnoteIndex = i;
		if (style.name == px.pStyleEndnoteFollowName)  px.pStyleEndnoteFollowIndex = i;
		if (style.name == px.pStyleEndnoteHeadingName)  px.pStyleEndnoteHeadingIndex = i;
		if (style.name == px.pStyleEndnoteSplitHeadingName)  px.pStyleEndnoteSplitHeadingIndex = i;
		px.dokParagraphStyleNames[i] = style.name;
		px.dokParagraphStyles[i] = style;
		prefix = style.name.match(/^[^~]+/);
		if (prefix) {
			prefix = prefix[0];
			px.dokParagraphStylePrefixes.push(prefix);
			if (px.dokParagraphStylePrefixStyles[prefix]) px.dokParagraphStylePrefixStyles[prefix].push(style);
			else  px.dokParagraphStylePrefixStyles[prefix] = [style];
		}		
	}
	px.dokParagraphStylePrefixes = px.ids.unique(px.dokParagraphStylePrefixes);
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

// Prüft ob die Styles im Dokument sinnvoll angelegt sind
function checkStyles (dok) {
	// Absätze von Endnoten müssen immer nummeriert sein!
	if (px.pStyleEndnote.id == px.pStyleEndnoteFollow.id) {
		px.pStyleEndnoteFollow = px.pStyleEndnote.duplicate();
		dok.insertLabel(px.pStyleEndnoteFollowLabel, px.pStyleEndnoteFollow.name);
		alertMsg( localize (px.ui.samePStyle, px.pStyleEndnoteName ) );	
	}		
	if (px.pStyleEndnote.bulletsAndNumberingListType != ListType.numberedList) {
		px.pStyleEndnote.bulletsAndNumberingListType = ListType.numberedList;
		alertMsg( localize (px.ui.endnoteStyleNumberingFail, px.pStyleEndnoteName ) );	
	}
	if (px.pStyleEndnoteFollow.bulletsAndNumberingListType == ListType.numberedList) {
		px.pStyleEndnoteFollow.bulletsAndNumberingListType = ListType.NO_LIST;
		alertMsg( localize (px.ui.endnoteStyleNumberingDeactivate, px.pStyleEndnoteFollowName) );	
	}
	// Check CrossRef Format 
	px.crossRefStyleEndnote = dok.crossReferenceFormats.item (px.crossRefStyleEndnoteName);
	if (!px.crossRefStyleEndnote.isValid) {
		px.crossRefStyleEndnote = dok.crossReferenceFormats.add ({name: px.crossRefStyleEndnoteName});
		px.crossRefStyleEndnote.appliedCharacterStyle = px.cStyleEndnoteMarker;
		px.crossRefStyleEndnote.buildingBlocks.add (BuildingBlockTypes.paragraphNumberBuildingBlock);
	}
	else {
		if (px.crossRefStyleEndnote.appliedCharacterStyle == null || (px.cStyleEndnoteMarker != null &&  px.crossRefStyleEndnote.appliedCharacterStyle.id != px.cStyleEndnoteMarker.id)) {
			px.crossRefStyleEndnote.appliedCharacterStyle = px.cStyleEndnoteMarker;
			alertMsg(localize (px.ui.crossrefFormatFail, px.crossRefStyleEndnoteName, px.cStyleEndnoteMarkerName));
		} 
	}
}

// GUI für die Konfiguration
function getConfig() {
	var win = new Window("dialog", localize(px.ui.menuTitle, px.version));  
	with (win) {
		// Welcher Bereich soll verarbeitet werden?
		win.pScope = add( "panel", undefined, localize(px.ui.scopePanel));
		win.pScope.preferredSize.width = 450;
		win.pScope.alignChildren = ['left', 'top'];
		win.pScope.spacing = 10;
		with (win.pScope) {
			win.pScope.gScope = add( "group");
			win.pScope.gScope.margins = [0,10,0,0];
			win.pScope.gScope.spacing = 10;
			win.pScope.gScope.alignChildren = ['left', 'top'];
			win.pScope.gScope.orientation = 'column';
			with (win.pScope.gScope) {
				win.pScope.gScope.radioAll = add( "radiobutton", undefined, localize(px.ui.scopeDoc) ); 
				win.pScope.gScope.radioAll.value = px.convertAllStories ;
				win.pScope.gScope.radioStory = add( "radiobutton", undefined, localize(px.ui.scopeStory) ); 
				win.pScope.gScope.radioStory.enabled = checkSelection();
			}
		}
		// Art der Verarbeitung 
		win.pMethod = add( "panel", undefined, localize(px.ui.methodPanel) );
		win.pMethod.preferredSize.width = 450;
		win.pMethod.alignChildren = ['left', 'top'];
		win.pMethod.spacing = 10;
		with (win.pMethod) {
			win.pMethod.gMethod = add( "group");
			win.pMethod.gMethod.margins = [0,10,0,0];
			win.pMethod.gMethod.spacing = 10;
			win.pMethod.gMethod.alignChildren = ['left', 'top'];
			win.pMethod.gMethod.orientation = 'column';
			with (win.pMethod.gMethod) {
				win.pMethod.gMethod.radioSplit = add( "radiobutton", undefined, localize(px.ui.splitByHeading) );
				win.pMethod.gMethod.radioSplit.value = px.numberBySection;
				win.pMethod.gMethod.radioCont = add( "radiobutton", undefined, localize(px.ui.continuousNumbering) );
				win.pMethod.gMethod.radioCont.value = !px.numberBySection;
			}
		}

		// Auswahl des Splitformats 
		win.pSplit = add( "panel", undefined, localize(px.ui.splitFormatPanel) );
		win.pSplit.preferredSize.width = 450;
		win.pSplit.orientation = 'column';
		win.pSplit.alignChildren = ['left', 'top'];
		win.pSplit.spacing = 10;
		with (win.pSplit) {
			win.pSplit.gInfo = add("group");
			win.pSplit.gInfo.orientation = 'column';
			win.pSplit.gInfo.alignChildren = ['left', 'top'];
			win.pSplit.gInfo.margins = [0,10,0,0];
			win.pSplit.gInfo.spacing = 5;
			with(win.pSplit.gInfo){
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
			win.pSplit.gFormat.xsText = add( "statictext", undefined, localize(px.ui.formatWarnung) , {multiline:true});
			win.pSplit.gFormat.xsText.preferredSize.width = 415;
			win.pSplit.gFormat.xsText.preferredSize.height = 35;
		}
		win.pSplit.enabled = px.numberBySection;
		// Formatierung der Endnote
		win.pInfo = add( "panel", undefined, localize(px.ui.formatPanel) );
		win.pInfo.preferredSize.width = 450;
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
		win.pTitle.preferredSize.width = 450;
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
		win.groupStart.preferredSize.width = 450;
		win.groupStart.alignChildren = ['right', 'center'];
		win.groupStart.margins = 0;
		with (win.groupStart) {
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

	// Ok / Set Values 
	win.groupStart.butOk.onClick = function() {
		// Set Values ... 
		px.convertAllStories = win.pScope.gScope.radioAll.value;
		px.convertSelection = win.pScope.gScope.radioStory.value;
		px.numberBySection = win.pMethod.gMethod.radioSplit.value;
		px.pStylePrefix = px.dokParagraphStylePrefixes[win.pSplit.gInfo.gEndnoteStyle.ddList.selection.index];
		px.pStyleEndnoteName = px.dokParagraphStyleNames[win.pInfo.gInfo.gEndnoteStyle.ddList.selection.index];
		px.pStyleEndnote = px.dokParagraphStyles[win.pInfo.gInfo.gEndnoteStyle.ddList.selection.index];
		px.pStyleEndnoteFollowName = px.dokParagraphStyleNames[win.pInfo.gInfo.gEndnoteStyleFF.ddList.selection.index];
		px.pStyleEndnoteFollow = px.dokParagraphStyles[win.pInfo.gInfo.gEndnoteStyleFF.ddList.selection.index];
		px.pStyleEndnoteHeadingName = px.dokParagraphStyleNames[win.pTitle.gFormat.gEndnoteStyle.ddList.selection.index];
		px.pStyleEndnoteHeading = px.dokParagraphStyles[win.pTitle.gFormat.gEndnoteStyle.ddList.selection.index];
		
		px.pStyleEndnoteSplitHeadingName = px.dokParagraphStyleNames[win.pSplit.gFormat.gEndnoteStyle.ddList.selection.index];
		if(!px.pStyleEndnoteSplitHeadingName) px.pStyleEndnoteSplitHeadingName = "";
		px.pStyleEndnoteSplitHeading = px.dokParagraphStyles[win.pSplit.gFormat.gEndnoteStyle.ddList.selection.index];
		
		px.endnoteHeadingString = win.pTitle.gInfo.eTextendNoteHeading.text.replace (/\r|\n/g,'');
		if (px.endnoteHeadingString == "") {
			alert (localize (px.ui.headingFail));
			return;
		}
		px.cStyleEndnoteMarkerName = px.dokCharacterStyleNames[win.pInfo.gInfo.gEndnoteCStyle.ddList.selection.index];
		px.cStyleEndnoteMarker = px.dokCharacterStyles[win.pInfo.gInfo.gEndnoteCStyle.ddList.selection.index];
		if (!(px.pStyleEndnoteName && px.pStyleEndnote && px.pStyleEndnoteFollowName && px.pStyleEndnoteFollow && px.pStyleEndnoteHeadingName && px.pStyleEndnoteHeading && px.endnoteHeadingString && px.cStyleEndnoteMarkerName && px.cStyleEndnoteMarker)) {
			alert (localize (px.ui.styleSelectionFail) );
			return;
		}
		if (px.numberBySection && !(px.pStylePrefix && px.pStyleEndnoteSplitHeading) ) {
			alert (localize (px.ui.styleSelectionFailSection) );
			return;
		}
			win.close(1);
	}
	win.groupStart.butCancel.onClick = function(){
		win.close (2);
	}

	// -
	win.center();
	return win.show();
	
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
}

function sortSecondEntry (a,b) {
	  return a[1] - b[1];
}

/*  Creates a log Message and Alert-Window */ 
function alertMsg(_msg) {	
	px.log.warn(_msg);
	if (!px.debug) { 
		if (_msg instanceof Array) _msg = _msg.join ("\r");		
		var w = new Window ("dialog", "Fehler");
		var list = w.add ("edittext", undefined, _msg, {multiline: true, scrolling: true});
		list.maximumSize.height = w.maximumSize.height-100;
		list.minimumSize.width = 550;
		w.add ("button", undefined, "Ok", {name: "ok"});
		w.show ();
	}
}

/* Init Logging, sets global px.log  */
function initLog(logFile) {
	if (px.debug) {
		px.log = idsLog.getLogger (logFile, "DEBUG", true);
	}
	else {
		px.log = idsLog.getLogger (logFile, "WARN", false);
	} 	
}

/*     Get Filepath from current script  */
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
