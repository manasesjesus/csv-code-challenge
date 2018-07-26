"use strict";

function loadCSVFile (event) {
    var csvfile = event.target.files[0];

    if (csvfile) {
        var ta_original   = document.getElementById("original");
        var ta_proccessed = document.getElementById("processed");
        var reader        = new FileReader();

        reader.onloadstart = function () {
            ta_original.value   = "";
            ta_proccessed.value = "";
        }

        reader.onload = function () {
            var lines = reader.result.split("\n");
            var delim = lines[0].indexOf(",") == -1 ? " " : ",";

            // Get the headings
            document.getElementById("head-text-div").innerHTML = lines[0];

            // Start from row 1 to ignore the headings
            for (var row=1; row<lines.length; row++) {
                var values = lines[row].split(delim);

                for (var i=0; i<values.length; i++) {
                    ta_original.value += values[i];
                    ta_original.value += i+1 < values.length ? delim : "";
                }
                ta_original.value += row+1 < lines.length ? "\n" : "";
            }
        }

        reader.onloadend = function() {
            if (reader.error) {
                alert("The file was not loaded successfully. Please try again.");
                console.error("Unsuccessful load of " + csvfile.name + ": " + reader.error.message);
            }
            else {
                // Get the textarea's value and create the html content of the text-div
                // and style all "bad" values
                var html = ta_original.value.replace(/\n/g,"<br>").replace(/0/g,"<b>0</b>");
                document.getElementById("text-div").innerHTML = html;

                // TODO: process the csv
                ta_proccessed.value = "done";

                // Show the elements
                document.getElementsByClassName("hidden")[0].className = "";
            }
        }

        reader.onerror = function () {
            console.error("Error while loading " + csvfile.name + ": " + reader.error.message);
        }

        reader.readAsText(csvfile);
    }
    else {
        alert("Oops! Something unexpected happened... Please try again.");
    }
}
