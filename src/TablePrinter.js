/**
 * TablePrinter
 * 
 * @author xdevnull
 * @license MIT
 */
var TablePrinter = (function() {

    /**
     * Add space for row values
     * 
     * @param {!Array.<!string>} row
     * @return {!Array.<!string>} 
     */
    function addSpaceForRowValues(row) {
        return row.map(val => ("   " + val + "   "));
    }

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
         * @param {{headers: !Array.<!string>, rows: !Array.<!Array.<!string>>, maskChar: (string|undefined), dividerChar: (string|undefined)}} opts 
         */
        print: function(opts) {

            //Defaults
            opts.maskChar = opts.maskChar || "+";
            opts.dividerChar = opts.dividerChar || "-";
            opts.headers = addSpaceForRowValues(opts.headers);
            opts.rows = opts.rows.map(row => addSpaceForRowValues(row));

            //Calculate Sizes
            const colWidths = calculateWidthSize(opts.headers, opts.rows);

            //Divier, Print Mask
            const divider = createDivier(colWidths, opts.dividerChar, opts.maskChar);

            //Create table to be printed
            //Append divider, header
            let table = [divider, replacePrintMask(colWidths, ...opts.headers), divider];

            //Append rows for table
            opts.rows.forEach(row => table.push(replacePrintMask(colWidths, ...row)));

            //Append divider
            table.push(divider);

            console.log(table.join("\n"));
        }
    };
})();