// 用于在控制台中显示颜色
var colors = {
    black: "\x1b[0;30m",
    dkgray: "\x1b[1;30m",
    brick: "\x1b[0;31m",
    red: "\x1b[1;31m",
    green: "\x1b[0;32m",
    lime: "\x1b[1;32m",
    brown: "\x1b[0;33m",
    yellow: "\x1b[1;33m",
    navy: "\x1b[0;34m",
    blue: "\x1b[1;34m",
    violet: "\x1b[0;35m",
    magenta: "\x1b[1;35m",
    teal: "\x1b[0;36m",
    cyan: "\x1b[1;36m",
    ltgray: "\x1b[0;37m",
    white: "\x1b[1;37m",
    reset: "\x1b[0m"
};

// Response Status Codes
var errorCodes = {
    "0": {id: "Success", message:	"The command executed successfully."},
    "7": {id: "NoSuchElement", message: "An element could not be located on the page using the given search parameters."},
    "8": {id: "NoSuchFrame", message: "A request to switch to a frame could not be satisfied because the frame could not be found."},
    "9": {id: "UnknownCommand", message: "The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource."},
    "10": {id: "StaleElementReference", message: "An element command failed because the referenced element is no longer attached to the DOM."},
    "11": {id: "ElementNotVisible", message: "An element command could not be completed because the element is not visible on the page."},
    "12": {id: "InvalidElementState", message: "An element command could not be completed because the element is in an invalid state (e.g. attempting to click a disabled element)."},
    "13": {id: "UnknownError", message: "An unknown server-side error occurred while processing the command."},
    "15": {id: "ElementIsNotSelectable", message: "An attempt was made to select an element that cannot be selected."},
    "17": {id: "JavaScriptError", message: "An error occurred while executing user supplied JavaScript."},
    "19": {id: "XPathLookupError", message: "An error occurred while searching for an element by XPath."},
    "21": {id: "Timeout", message: "An operation did not complete before its timeout expired."},
    "23": {id: "NoSuchWindow", message: "A request to switch to a different window could not be satisfied because the window could not be found."},
    "24": {id: "InvalidCookieDomain", message: "An illegal attempt was made to set a cookie under a different domain than the current page."},
    "25": {id: "UnableToSetCookie", message: "A request to set a cookie's value could not be satisfied."},
    "26": {id: "UnexpectedAlertOpen", message: "A modal dialog was open, blocking this operation"},
    "27": {id: "NoAlertOpenError", message: "An attempt was made to operate on a modal dialog when one was not open."},
    "28": {id: "ScriptTimeout", message: "A script did not complete before its timeout expired."},
    "29": {id: "InvalidElementCoordinates", message: "The coordinates provided to an interactions operation are invalid."},
    "30": {id: "IMENotAvailable", message: "IME was not available." },
    "31": {id: "IMEEngineActivationFailed", message: "An IME engine could not be started."},
    "32": {id: "InvalidSelector", message: "Argument was an invalid selector (e.g. XPath/CSS)."}
};

module.exports = {
    colors: colors,
    errorCodes: errorCodes
};