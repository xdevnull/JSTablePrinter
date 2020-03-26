/**
 * RowsData Type Definition
 * 
 * @typedef {!Array<!Array<!string>>} RowsData
 */
var RowsData;

/**
 * TablePrinter Options Type Definition
 * 
 * @typedef {Object} TablePrinterOptions
 * @property {!Array<!string>} headers
 * @property {RowsData|function(function(RowsData):void):void|Promise<RowsData>}
 * @property {string|undefined} maskChar
 * @property {string|undefined} dividerChar
 * @property {boolean|undefined} dividerBetweenRows
 */
var TablePrinterOptions;

/**
 * TablePrinter
 * 
 * @author xdevnull
 * @license MIT
 */
var TablePrinter = (function() {

    /**
     * Join String
     * 
     * @param {!string} seperator 
     * @param {!Array.<!string>} strArr 
     */
    function str_join(seperator, strArr) {
        return strArr.map((val, index) => (index !== 0 ? (seperator + val) : val)).join("");
    }


    /**
     * Create Table Divider
     * 
     * @param {!Array.<!number>} colWidths 
     * @param {!string} dividerChar
     * @param {!string} maskChar
     * @return {!string} 
     */
    function createDivier(colWidths, dividerChar, maskChar) {
        return maskChar + str_join(maskChar, colWidths.map(width => dividerChar.repeat(width))) + maskChar;
    }

    /**
     * Replace Values in PrintMask
     * 
     * @param {!Array.<!number>} printMask 
     * @param  {...!string} values 
     * @return {!string}
     */
    function replacePrintMask(printMask, ...values) {
        return printMask.map((width, index) => ("|" + values[index] + " ".repeat(width - values[index].length) + (index + 1 < printMask.length ? "" : "|"))).join("");
    } 

    /**
     * Calculate Width sizes
     * 
     * @param {!Array.<!string>} headers 
     * @param {!Array.<!Array.<!string>>} rows 
     * @return {!Array.<!number>}
     */
    function calculateWidthSize(headers, rows) {
        return headers.map((header, index) => {
            let max = header.length;
            rows.forEach(row => (max = Math.max(max, row[index].length)));
            return max + 3;
        });
    }

    /**
     * Build Table and Print
     * 
     * @param {TablePrinterOptions} opts 
     * @param {RowsData} rows_data 
     */
    function buildTableAndPrint(opts, rows_data) {

            //Defaults
            opts.maskChar = opts.maskChar || "+";
            opts.dividerChar = opts.dividerChar || "-";
            opts.headers = opts.headers.map(val => ("   " + val + "   "));

            const rows = rows_data.map(row => row.map(val => ("   " + val + "   ")));

            //Calculate Sizes
            const colWidths = calculateWidthSize(opts.headers, rows_data);

            //Divier, Print Mask
            const divider = createDivier(colWidths, opts.dividerChar, opts.maskChar);

            //Create table to be printed
            //Append divider, header
            let table = [divider, replacePrintMask(colWidths, ...opts.headers), divider];

            //Append rows for table
            rows_data.forEach((row, index) => {
                table.push(replacePrintMask(colWidths, ...row));
                if(opts.dividerBetweenRows && index + 1 < rows_data.length) {
                    table.push(divider);
                }
            });


            //Append divider
            table.push(divider);

            //Print
            opts.onOutput(table.join("\n"));
    }

    return {

        /**
         * Print table
         * 
         * @param {!TablePrinterOptions} opts 
         */
        print: function(opts) {

            // call callback
            if(typeof opts.rows === "function") {
                return opts.rows(rowsData => buildTableAndPrint(opts, rowsData));
            }

            // call promise
            Promise.resolve(opts.rows).then(rowsData => buildTableAndPrint(opts, rowsData));

        }
    }

})();