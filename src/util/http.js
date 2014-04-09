var helper= require("./helper")

var biset= helper.biset,
  bisetAll= helper.bisetAll

//// CODES
module.exports.methods= {};
["GET","POST","PUT","DELETE","CONNECT","HEAD","OPTIONS","TRACE", // http http://www.ietf.org/rfc/rfc2616
"NOTIFY","M-SEARCH", // SSDP tools.ietf.org/html/draft-cai-ssdp-v1
"PROPFIND","PROPPATCH","MKCOL","COPY","MOVE","LOCK","UNLOCK", // webdav http://www.ietf.org/rfc/rfc2518
"VERSION-CONTROL","REPORT","CHECKOUT","CHECKIN","UNCHECKOUT","MKWORKSPACE","UPDATE","LABEL","MERGE","BASELINE-CONTROL","MKACTIVITY", // webdav versioning http://www.ietf.org/rfc/rfc3253
"ORDERPATCH",  // webdav ordered-collection http://www.ietf.org/rfc/rfc3648
"ACL", // webdav acl http://www.ietf.org/rfc/rfc3744
"PATCH", // patch http://tools.ietf.org/html/rfc5789
"SEARCH"] // search http://tools.ietf.org/html/rfc5323
	.forEach(biset,module.exports.methods)

module.exports.httpStatus= bisetAll({100: "Continue",
	101: "Switching Protocols",
	102: "Processing",
	200: "OK",
	201: "Created",
	202: "Accepted",
	203: "Non-Authoritative Information",
	204: "No Content",
	205: "Reset Content",
	206: "Partial Content",
	207: "Multi-Status",
	208: "Already Reported",
	226: "IM Used",
	300: "Multiple Choices",
	301: "Moved Permanently",
	302: "Found",
	303: "See Other",
	304:	"Not Modified",
	305: "Use Proxy",
	306: "Switch Proxy",
	307: "Temporary Redirect",
	308: "Permanent Redirect",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Requierd",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Requested Entity Too Large",
	414: "Request-URI Too Long",
	415: "Unsupported Media Type",
	416: "Request Range Not Satisfiable",
	417: "Expectation Failed",
	418: "I'm a teapot",
	419: "Authentication Timeout",
	420: "Enhance Your Calm",
	422: "Unprocessable Entity",
	423: "Locked",
	424: "Failed Dependency/Method Failure",
	425: "Unordered Collection",
	426: "Upgrade Required",
	428: "Precondition Requierd",
	429: "Too Many Requests",
	431: "Request Header Fields Too Large",
	440: "Login Timeout",
	444: "No Response",
	449: "Retry With",
	450: "Blocked By Parental Controls",
	451: "Unavailable For Legal Reasons",
	494: "Request Too Large",
	495: "Cert Error",
	496: "No Cert",
	499: "Client Closed Request",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates",
	507: "Insufficient Storage",
	508: "Loop Detected",
	509: "Bandwidth Limit Exceeded",
	510: "Not Extended",
	511: "Network Authentication Required",
	520: "Origin Error",
	522: "Connection Timeout"
})

var err = module.exports.err= []
err[1]= "IndexError"
err[3]= "HierarchyRequestError"
err[4]= "WrongDocumentError"
err[5]= "InvalidCharacterError"
err[7]= "NoModificationAllowedError"
err[8]= "NotFoundError"
err[9]= "NotSupportedError"
err[11]= "InvalidStateError"
err[12]= "SyntaxError"
err[13]= "InvalidModificationError"
err[14]= "NamespaceError"
err[15]= "InvalidAccessError"
err[18]= "SecurityError"
err[19]= "NetworkError"
err[20]= "AbortError"
err[21]= "URLMismatchError"
err[22]= "QuotaExceededError"
err[23]= "TimeoutError"
err[24]= "InvalidNodeTypeError"
err[25]= "DataCloneError"
err[2049]= "EncodingError"
err[2050]= "NoDataError"
err[2051]= "NoPipeError"
err[2052]= "WebSucksError"
bisetAll(err)
