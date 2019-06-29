/**
 * TablePrinterOptions
 * 
 * @typedef {{
 *  headers: !Array.<!string>,
 *  rows: !Array.<!Array.<!string>>,
 *  onOutput: function(string):void,
 *  maskChar: (string|undefined),
 *  dividerChar: (string|undefined),
 *  dividerBetweenRows: (boolean|undefined)
 * }}
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

    return {

        /**
         * Print table
         * 
         * @param {!TablePrinterOptions} opts 
         */
        print: function(opts) {

            //Defaults
            opts.maskChar = opts.maskChar || "+";
            opts.dividerChar = opts.dividerChar || "-";
            opts.headers = opts.headers.map(val => ("   " + val + "   "));
            opts.rows = opts.rows.map(row => row.map(val => ("   " + val + "   ")));

            //Calculate Sizes
            const colWidths = calculateWidthSize(opts.headers, opts.rows);

            //Divier, Print Mask
            const divider = createDivier(colWidths, opts.dividerChar, opts.maskChar);

            //Create table to be printed
            //Append divider, header
            let table = [divider, replacePrintMask(colWidths, ...opts.headers), divider];

            //Append rows for table
            opts.rows.forEach((row, index) => {
                table.push(replacePrintMask(colWidths, ...row));
                if(opts.dividerBetweenRows && index + 1 < opts.rows.length) {
                    table.push(divider);
                }
            });


            //Append divider
            table.push(divider);

            //Print
            opts.onOutput(table.join("\n"));
        }
    };
})();
