if (input.htmlBody !== null) {
    //skip execution if "Heartbeat Missed" message received
    if (input.htmlBody.indexOf("Heartbeat Missed") !== -1) {
        throw new Error("Heartbeat Missed - skip alarm creation");
    }

    //grab copy of body vefore stripping
    var htmlText = input.htmlBody;
    //strip all before start of relevant info
    htmlText = htmlText.slice(htmlText.indexOf("Current Alarm States"));
    //remove everything after relevant table close tag
    htmlText = htmlText.slice(0, htmlText.indexOf("</table>")+8);

    console.log('HTML text body: ' + htmlText);
    
    //grab copy of HTML output
    var plainText = htmlText;
    // remove all HTML tags and anything inside of them
    plainText = plainText.replace(/(<([^>]+)>)/gi, '');
    //remove all carriage returns
    plainText = plainText.replace(/\r/g, "");
    //replace multiple line breaks with single
    plainText = plainText.replace(/\n{2,}/g, '\n');
    //trim ending newline
    plainText = plainText.trim();

    console.log('Plain text body: ' + plainText);

    //add code to shunt to different teams. 
    //if contains "dig or Dig" route to tech services
    //if not route to greenhouse
    
    var recipients = input.recipients;
    
    //can't do this because argus can't differentiate alerts
    //if (recipients !== "greenhouse" && recipients !== "technicalservices"){
    //we'll catch all messages sent to argus@alert.bayview.xmatters.com and shunt them to correct groups
    //if (recipients == "argus"){
    //    
    //    if (plainText.toLowerCase().includes("dig")){
    //        
    //        recipients = "technicalservices";
    //        
    //    } else {
    //        
    //        recipients = "greenhouse";
    //        
    //    }
    //}
    if (recipients == "argus") {
	
        var textArray = plainText.split("\n");
		var hits=0;
		
		for (var i = 0; i < textArray.length; i++) { 
		
           if (textArray[i].toLowerCase().includes("dig")) {
		   
		     hits++;
			 
		   }
		   
        }

        if (hits < (textArray.length - 2)) {
		
		  recipients = "greenhouse";
		  
		} else {
            
          recipients = "technicalservices";
            
        }
    }    
}

output.targetGroup = recipients;
output.modhtmlBody = htmlText;
output.modBody = plainText;

/*
 Inputs for the script step appear as properties
 of the input object.
 This example shows how to access Inputs named
 'APIKey' and 'Application Host'.
*/
//var department = input.APIKey;
//var address = input['Application Host'];

/*
 If an input is not required, it may not be
 present on the input object. Check that it
 is present before using it.
*/
//if (input.priorityLevel != null) {
//     var priority = input.priorityLevel.toUpperCase();
//}

/*
 If the script step has declared outputs, their
 values should be set on the output object.
 This example shows how to emit outputs named
 'Priority' and 'Server Name'.
*/
//output.Priority = priority;
//output['Server Name'] = input['Application Host'];

/*
 To use a library in this script, include the following statements, replacing
 'My Library' with the reference name you give the library when you select to
 include it in the script.
 */
// var helloWorld = require('hello world')
// output['Message'] = helloWorld.createGreeting('sample message') // "Hello, sample message"

/*
If the script step has an endpoint, it can
be used to make HTTP requests.
This example shows how to make a request using
an endpoint named 'ExampleAPI' and an input
named 'personId', then set the output property
'User Name' using the result.
*/
//var apiRequest = http.request({
//    'endpoint': 'ExampleAPI',
//    'path': '/api/1/persons/' + input.personId,
//    'method': 'GET'
//});
//var apiResponse = apiRequest.write();
//if (apiResponse.statusCode == 200) {
//    var person = JSON.parse(apiResponse.body);
//    output['User Name'] = person.username
//}
