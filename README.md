## JavaScript / HTML :: CSV File Code Challenge

Write a JavaScript / HTML program that lets the user open a CSV file from disk, displays it in a text box, processes it, and displays the output in another text box.

To read the input: The CSV file basically contains a 2D matrix of numbers, where each line holds a single row, e.g.: `2<delim>4<delim>99<delim>\n`. The delimiter can be either space or a single comma (‘,’). Write the output in the same format as the input.

Once the input data is read, your application should perform filtering of “bad” values. Any entry of the matrix is “bad” when it has a value of 0 (zero). The application should now replace these bad values and compute the true value by interpolating it from the surrounding values, i.e., from the spatial neighbors of the entry in the matrix.
Write the matrix with the replaced values to the output text field.

## Solution