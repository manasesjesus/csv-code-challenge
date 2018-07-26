"use strict";

function loadCSVFile (event) {
    var csvfile = event.target.files[0];

    if (csvfile) {
        var ta_original   = document.getElementById("original");
        var ta_proccessed = document.getElementById("processed");
        var only_zeros    = true;
        var reader        = new FileReader();

        // Called after starting a read operation to initialize the textareas and the matrix
        reader.onloadstart = function () {
            ta_original.value   = "";
            ta_proccessed.value = "";
        }

        // Called when a read operation successfully completes. It separates the CSV headings
        // from the values and process them. Everything gets stored in the textareas and the matrix.
        reader.onload  = function () {
            var lines  = reader.result.split(reader.result.indexOf("\r") > 0 ? "\r\n" : "\n");
            var delim  = lines[0].indexOf(",") == -1 ? " " : ",";

            // Get & set the headings
            document.getElementById("head-text-div").innerHTML = lines[0];

            // Create a dynamic two-dimensional array (matrix) and store all values
            var matrix    = new Array(lines.length - 1);
            var bad_lines = [];

            for (var row=1; row<lines.length; row++) {
                var values  = lines[row].split(delim);

                matrix[row-1] = new Array(values.length);
                for (var col=0; col<values.length; col++) {
                    matrix[row-1][col] = parseInt(values[col]);
                    ta_original.value += values[col];
                    ta_original.value += col+1 < values.length ? delim : "";

                    // There should be at least one number different than zero
                    if (only_zeros && matrix[row-1][col] != 0) {
                        only_zeros = false;
                    }
                }
                ta_original.value += row+1 < lines.length ? "\n" : "";

                // Store a bad line index
                if (matrix[row-1].includes(0)) {
                    bad_lines.push(row-1);
                }
            }

            // Process the bad values
            while (bad_lines.length > 0 && !only_zeros) {
                var bad_l = bad_lines[bad_lines.length - 1];
                var lgtv  = matrix.length;

                while (matrix[bad_l].includes(0)) {
                    var col  = matrix[bad_l].indexOf(0);
                    var good = 0;
                    var lgth = matrix[bad_l].length;

                    // Search neighbors
                    for (var x=1, y=1; (x<lgth || y<lgtv) && good==0; x++, y++) {
                        if (col - x >= 0) {                     // west
                            good = matrix[bad_l][col - x];
                        }
                        if (col + x < lgth && good == 0) {      // east
                            good = matrix[bad_l][col + x];
                        }
                        if (bad_l - y >= 0 && good == 0) {      // north
                            good = matrix[bad_l - y][col];
                        }
                        if (bad_l + y < lgtv && good == 0) {    // south
                            good = matrix[bad_l + y][col];
                        }
                    }

                    if (good != 0) {
                        matrix[bad_l][col] = good;
                    }
                    else {
                        console.log("No close neighbors! Using the Tesseract to find a further neighbor...");

                        while (matrix[bad_l][col] == 0) {
                            var tx = Math.floor(Math.random() * matrix[0].length);
                            var ty = Math.floor(Math.random() * matrix.length);

                            matrix[bad_l][col] = matrix[ty][tx];
                        }
                    }
                }
                bad_lines.pop();
            }

            // Set the value of the second textarea
            for (var my=0; my<matrix.length; my++) {
                for (var mx=0; mx<matrix[my].length; mx++) {
                    ta_proccessed.value += matrix[my][mx];
                    ta_proccessed.value += mx+1 < matrix[my].length ? delim : "";
                }
                ta_proccessed.value += my+1 < matrix.length ? "\n" : "";
            }
        }

        // Called after a read completes (either successfully or unsuccessfully)
        reader.onloadend = function() {
            if (reader.error) {
                alert("The file was not loaded successfully. Please try again.");
                console.error("Unsuccessful load of " + csvfile.name + ": " + reader.error.message);
            }
            else {
                // Get the textarea's value and create the html content of the text-div
                // and style all "bad" values.
                var html = ta_original.value.replace(/\n/g,"<br>").replace(/0/g,"<b>0</b>");
                document.getElementById("text-div").innerHTML = html;

                // and similar for the processed textarea
                html = only_zeros ? "<br>&nbsp; ¯\\_(ツ)_/¯ <br><br>" : ta_proccessed.value.replace(/\n/g,"<br>");
                document.getElementById("pro-text-div").innerHTML = html;

                // Show the elements
                var hidden = document.getElementsByClassName("csv-details");
                if (hidden.length > 0) {
                    hidden[0].className = "";
                }
            }
        }

        // Called when there is an error during the load
        reader.onerror = function () {
            console.error("Error while loading " + csvfile.name + ": " + reader.error.message);
        }

        // Read from blob as a string and the result will be stored on this.result after the 'load' event fires
        reader.readAsText(csvfile);
    }
    else {
        alert("Oops! Something unexpected happened... Please try again.");
    }
}
