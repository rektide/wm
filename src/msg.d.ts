interface Dictionary {
	[index: string]: any;
}

interface Message {
	messageType: number;
}

interface MessageWithTrailingArgs extends Message {
	arguments: any[];
	argumentsKw: Dictionary
}

// 1
interface Hello extends Message {
	realm: string;
	details: Dictionary;
}


interface Welcome extends Message {
	session: any;
	details: Dictionary;
}

interface Abort extends Message {
	details: Dictionary;
	reason: any;
}

interface Challenge extends Message {
	challenge: string;
	extra: Dictionary;
}

interface Authenticate extends Message {
	signature: string;
	extra: Dictionary;
}

interface Goodbye extends Message {
	details: Dictionary;
	reason: string;
}

interface Heartbeat extends Message {
	incomingSeq: number;
	outgoingSeq: number;
	//discard?: string;
}

interface WampError extends MessageWithTrailingArgs {
	requestType: number;
	requestId: number;
	details: Dictionary;
	error: string;
}

//16
interface Publish extends MessageWithTrailingArgs {
	request: number;
	options: Dictionary;
	topic: string;
}

interface Published extends Message {
	publishId: number;
	publication: number;
}

// 32
interface Subscribe extends Message {
	request: number;
	options: Dictionary;
	topic: string;
}

interface Subscribed extends Message {
	subscribeId: number;
	subscription: number;
}

interface Unsubscribe extends Message {
	request: number;
	subscriptionId: number;
}

interface Unsubscribed extends Message {
	unsubscribeId: number;
}

interface WampEvent extends MessageWithTrailingArgs {
	subscriptionId: number;
	publicationId: number;
	details: Dictionary;
}

// 48
interface Call extends MessageWithTrailingArgs {
	request: number;
	options: Dictionary;
	procedure: string;
}

interface Cancel extends Message {
	callId: number;
	options: Dictionary;
}

interface Result extends MessageWithTrailingArgs {
	callId: number;
	details: Dictionary;
}

// 64
interface Register extends Message {
	request: number;
	options: Dictionary;
	procedure: string;
}

interface Registered extends Message {
	request: number;
	registration: number;
}

interface Unregister extends Message {
	request: number;
	registrationId: number;
}

interface Unregistered extends Message {
	unregisterId: number;
}

interface Invocation extends MessageWithTrailingArgs {
	request: number;
	registrationId: number;
	details: Dictionary;
}

interface Interrupt extends Message {
	invocationId: number;
	options: Dictionary;
}

interface Yield extends MessageWithTrailingArgs {
	invocationId: number;
	options: Dictionary;
}
