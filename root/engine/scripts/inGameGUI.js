
var GUI = {
    canvasTexture: null,
    InitializeCanvas: function() {

        function CreateMultilineText(textToWrite, maxWidth, outTextArr) {
            textToWrite = textToWrite.replace("\n", " ");
            var currentText = textToWrite;
            var futureText;
            var subWidth = 0;
            var maxLineWidth = 0;

            var wordArray = textToWrite.split(" ");
            var wordsInCurrent, wordArrayLength;
            wordsInCurrent = wordArrayLength = wordArray.length;

            // Reduce currentText until it is less than maxWidth or is a single word
            // futureText var keeps track of text not yet written to a text line
            while (TwoD.GetTextWidth(currentText) > maxWidth && wordsInCurrent > 1) {
                wordsInCurrent--;
                var linebreak = false;

                currentText = futureText = "";
                for (var i = 0; i < wordArrayLength; i++) {
                    if (i < wordsInCurrent) {
                        currentText += wordArray[i];
                        if (i + 1 < wordsInCurrent) { currentText += " "; }
                    }
                    else {
                        futureText += wordArray[i];
                        if (i + 1 < wordArrayLength) { futureText += " "; }
                    }
                }
            }
            outTextArr.push(currentText); // Write this line of text to the array
            maxLineWidth = TwoD.GetTextWidth(currentText);

            // If there is any text left to be written call the function again
            if (futureText) {
                subWidth = CreateMultilineText(futureText, maxWidth, outTextArr);
                if (subWidth > maxLineWidth) {
                    maxLineWidth = subWidth;
                }
            }

            // Return the maximum line width
            return maxLineWidth;
        }

        var outText = [];
        var msg = "Test text. Why not just width plus some arbitrary amount??";
        var textSize = 56;
        var maxWidth = 128;

        // Set styles that impact text size before measuring
        TwoD.SetStyles(textSize);

        maxWidth = CreateMultilineText(msg, maxWidth, outText);
        var msgHeight = textSize * (outText.length + 1);

        var canvasWidth = MathUtils.GetGreatestDouble(maxWidth);
        var canvasHeight = MathUtils.GetGreatestDouble(msgHeight);
        (canvasWidth > canvasHeight) ? canvasHeight = canvasWidth : canvasWidth = canvasHeight;

        TwoD.GetCanvas().width = canvasWidth;
        TwoD.GetCanvas().height = canvasHeight;
        // These need to happen again now that the canvas has changed
        TwoD.SetStyles(textSize);
        // Draw text
        var offset = (canvasHeight - msgHeight) * 0.5;
        for (var i = 0; i < outText.length; i++) {
            var textY = (i + 1) * textSize + offset;
            TwoD.DrawText(outText[i], canvasWidth / 2, textY);
        }
    }
};