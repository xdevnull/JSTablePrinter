# JSTablePrinter
___


## Example
```
TablePrinter.print({
    
    headers: ["id", "user", "email"],
    rows: [
        ["1", "xdevnull", "devnull@example.com"],
        ["2", "johndoe", "john@microsoft.com"],
        ["3", "systemCrash", "crash@error.com"]
    ],
    maskChar: "+", //Defaults to "+"
    dividerChar: "-", //Defaults to  "-"
});
```

## Output:
```
+-----------+--------------------+----------------------------+
|   id      |   user             |   email                    |
+-----------+--------------------+----------------------------+
|   1       |   xdevnull         |   devnull@example.com      |
|   2       |   johndoe          |   john@microsoft.com       |
|   3       |   systemCrash      |   crash@error.com          |
+-----------+--------------------+----------------------------+
```