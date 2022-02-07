const { google } = require('googleapis');
const path = require('path')
const fs = require('fs')
const downloadsFolder = require('downloads-folder');
console.log(downloadsFolder());


const CLIENT_ID = '307087679981-jmf3j1uj59oar4ngljuc17i6tj78kgai.apps.googleusercontent.com'
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground/';

const REFRESH_TOKEN = 
'1//04_El3Jj_V_vLCgYIARAAGAQSNwF-L9Ir1bbl4PiXzfHniT5-J5Mw44zEXTPwWwXVNjgwHtq83qkCChpB8Yd0MjTwLDIEOvY_rN4'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI

);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

const filePath = path.join (downloadsFolder(),'wrewer - 2022-01-31 - Data.csv')

async function uploadFile() {
    try{

const response = await drive.files.create({
    requestBody: {
        name: 'EKUANT.csv',
        mimeType: 'text/csv'
    },
    media: {

    mimeType: 'text/csv',
    body: fs.createReadStream(filePath)
},
})
console.log(response.data);

    } catch (error) {
        console.log(error.message);
    }
}


//This file needs some refactoring to tidy it up a little.

//Takes the data as a multidimensional array and builds it into a nice CSV string, with an optional newline character.  It is recommended to just use \r\n, as it should produce a newline on every platform, but if you want to include code to detect the platform you can do that, and pass in the appropriate newline string.
function dataCSV(data,newline) {
	csv = "";					//Start with an empty string
	for (dataRow in data) {		//Iterate through the rows
		//We then iterate through every column but the last one, since the last doesn't need a comma
		for (dataCell=0;(dataCell<((data[dataRow].length)-1));dataCell++) {
			csv += data[dataRow][dataCell]+",";
		}
		csv += data[dataRow][dataCell];		//Finalize the row with the last column
		if (newline != null) {				//Use a specific newline, if given
			csv += newline;
		} else {
			csv += '\r\n';
		}
	}
	return csv;
}

//Generates the data URI, which contains the contents of the test.  This can be linked to so that, in the event that a user doesn't have flash 10, the user may still download/open the data in a new window
//Takes the data in CSV string format
function dataURI(csvData,mimeType) {
	return "data:"+mimeType+";charset=utf-8,"+csvData;
}

//Generates the download link to download the data as .csv
function createDownloadLink(divName,exportFilename,data,downloadLinkText) {
	document.getElementById(divName).innerHTML = '<a href="'+dataURI(dataCSV(data,'%0D%0A'),'text/plain')+'" download="'+exportFilename+'" target="_blank">'+downloadLinkText+'</a>';
}

//Generates the flash links and the textual new-window links from the data.
function generateExportLink(data) {
	setupData[8] = new Date();
	fileName = setupData[0]+' - '+(setupData[8].getFullYear())+'-'+pad((setupData[8].getMonth()+1),2)+'-'+pad((setupData[8].getDate()),2);
	
	var csvData = generateData(setupData,data)
	var csvSummary = generateSummary(setupData,data)

	//To create the download link
	createDownloadLink('summaryDownloadLink','EKUANTSummary.csv',csvSummary,"Export Summary");
	createDownloadLink('dataDownloadLink','EKUANTData.csv',csvData,"Export Raw Data");
}


