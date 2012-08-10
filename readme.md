# Lookback

## Version

0.1

## About

Lookback is a MediaWiki Gadget used to look at a wiki the way it was at any given point in time.

Lookback is the sister project to UTurn which is used to revert the wiki to that point in time.

## Implementation details

Lookback is implemented as a MediaWiki Gadget. It consists of 1 javascript file.

## Installation

1. Enable [MediaWiki Gadgets](http://www.mediawiki.org/wiki/Extension:Gadgets).

2. Navigate to http://{YOUR-WIKI-PATH}/MediaWiki:Gadget-lookback.js

3. Create/edit the page and set its contents to the contents of lookback.js *(Yes, the page's contents should be the raw javascript, and NOTHING ELSE)*

4. When you look at the page it will have a header starting with "Note: After saving..." ignore that

5. Navigate to http://{YOUR-WIKI-PATH}/MediaWiki:Gadgets-definition

6. Append the follow line to the page: `* LookBack|lookback.js`

## Use

### Enabling the gadget

1. Login 

2. Navigate to http://{YOUR-WIKI-PATH}/Special:Preferences#mw-prefsection-gadgets

3. Check the checkbox next to <gadget-LookBack>

4. Hit Save

### Turning back time

*If you successfully installed and enabled the gadget, you will see a yellow box at the bottom right of each **article**.*

Lookback will only show you past articles in the global namespace, meaning that pages like Special:version or User:JohnDoe will NOT have the yellow box.

In the textbox at the bottom right fill in the date/time you would like to see, in the format: `MM/DD/YYYY HH:mm:SS`

* **MM**: One or two digit month
* **DD**: One or two digit day of the month
* **YYYY**: A four digit day of the month
* **HH**: The hour in 24 hour format in UTC
* **mm**: The minute in UTC
* **MM**: The second in UTC

*If the hour, minute, or second aren't important to you, simply fill in their value as 0 (i.e. 0:0:0)*

Examples:

* `8/9/2012 12:0:0`
* `11/11/2011 11:11:11`
* `3/14/2000 15:9:26`
* `1/1/1970 0:0:0`

*Note: The time you choose will persist accross pages*

### Back to the future

Simply remove the contents of the textbox and press enter.

### The Red Border

If the box has a red border, the date is either formatted incorrectly or represents a time in the future.

### Disable

1. Navigate to a page that has the yellow box

2. Click '[disable]' in the lookback box (the yellow thing, bottom right). It will take you to the Gadget Preferences page.

3. Uncheck the Gadget checkbox, and then click save.

## Copyright & License

Copyright President and Fellows of Harvard College, 2012

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.