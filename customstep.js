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
    htmlText = htmlText.slice(0, htmlText.indexOf("</table>") + 8);

    console.log('HTML text body: ' + htmlText);

    //grab copy of HTML output
    var plainText = htmlText;

    // remove all HTML tags and anything inside of them
    plainText = plainText.replace(/(<([^>]+)>)/gi, '');
    //remove all carriage returns
    plainText = plainText.replace(/\r/g, "");
    //replace 4 line breaks with single
    plainText = plainText.replace(/\n{4,}/g, '\n');
    //replace 3 line breaks with single
    plainText = plainText.replace(/\n{3,}/g, '\n');
    //replace 2 line breaks with null
    plainText = plainText.replace(/\n{2,}/g, '');
    //trim ending newline
    plainText = plainText.trim();

    console.log('Plain text body: ' + plainText);

    var recipients = input.recipients;

    if (recipients == "argus") {

        var textArray = plainText.split("\n");
        var hits = 0;
        console.log('Text Array length: ' + textArray.length);

        for (var i = 0; i < textArray.length; i++) {
            if (textArray[i].toLowerCase().includes("dig")
                 || textArray[i].toLowerCase().includes("septic")
                 || textArray[i].toLowerCase().includes("solar")
                 || textArray[i].toLowerCase().includes("silent")
                 || textArray[i].toLowerCase().includes("had an alarm")) {
                hits++;
                console.log('Number of hits: ' + hits);
            }

        }

        if (hits < (textArray.length - 1)) {

            recipients = "greenhouse";

        } else {

            throw new Error("No group should receive this alarm");
            //recipients = "technicalservices";

        }
    }
}

output.targetGroup = recipients;
output.modhtmlBody = htmlText;
output.modBody = plainText;
