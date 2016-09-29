#Dokumentation Endnotenskript v2

Die Skriptsammlung ermöglicht die Verwendung von **Endnoten** in InDesign mit Hife der Fußnoten- und der Querverweisfunktion. Es können nachträglich Endnoten hinzugefügt werden und Endnoten und deren Verweise gelöscht werden. Die Skripte funktionieren ab InDesign CS 5.5 und wurden bis CC 2015 getestet. 


## Installation

Kopiere alle  `.jsx` Dateien in der Ornder `Script Panel` der InDesign Installation. Eine detaillierte Anleitung findest du hier [[DE] Skripte in InDesign installieren](http://www.publishingx.de/skripte-installieren/) oder hier [EN] How to Install a Typical InDesign Script](http://www.danrodney.com/scripts/directions-installingscripts.html).


## Wie funktioniert das?
Grundsätzlich kann immer nur ein Textabschnitt mit Endnoten verarbeitet werden. 

This script converts InDesign footnotes into linked endnotes using InDesign cross references. So you need footnotes first. Endnotes are only possible within stories (single or linked textframes), you'll find your endnotes at the end of the story. The script should run from InDesign CS4 onwards but was only tested with CS6 and CC 2015.


Create or update Endnotes

Start createEndnotes.jsx

I hope the user interface is quite self explaining.

GUI of createEndnotes.jsx

Basically there are two modes:

    Split by Parargaph Style (Restart Numbering after a Heading)
    Continuous Numbering

Jump between note and marker

Place your cursor in a marker or endnote and start jumpBetweenMarkerAndNote.jsx. If you want to go back, simply run the script again.
Delete Endnotes

Start deleteEndnotes.jsx. This script will delete a single endnote including there cross reference. Do not delete endnotes paragraphs or markers manually, this will break the update process of the current document.
Default configuration

All default configuration parameters can be changed in config.jsx. Configurations settings for style names are save to change. Same for User interface strings. Be careful with the other options, changing them might break the update process of previously converted documents. 
