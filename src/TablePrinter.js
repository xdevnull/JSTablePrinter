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
        let result = "";
        strArr.forEach((val, index) => {
            if(index !== 0) {
                result += seperator;
            }
            result += val;
        });
        return result;
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
        let sections = [];
        colWidths.forEach(width => {
            sections.push(dividerChar.repeat(width));
        });
        return maskChar + str_join(maskChar, sections) + maskChar;
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
     * @return {!number}
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
         * @param {{headers: !Array.<!string>, rows: !Array.<!string>, maskChar: string|undefined, divider: string|undefined}} opts 
         */
        print: function(opts) {

            //Defaults
            opts.maskChar = opts.maskChar || "+";
            opts.divider = opts.divider || "-";
            opts.headers = addSpaceForRowValues(opts.headers);
            opts.rows = opts.rows.map(row => addSpaceForRowValues(row));

            //Calculate Sizes
            const colWidths = calculateWidthSize(opts.headers, opts.rows);

            //Divier, Print Mask
            const divider = createDivier(colWidths, opts.divider, opts.maskChar);

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