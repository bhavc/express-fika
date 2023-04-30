import winston from "winston";

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const level = () => {
	const env = process.env.NODE_ENV || "development";
	const isDevelopment = env === "development";
	return isDevelopment ? "debug" : "warn";
};

const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

const format = winston.format.combine(
	// Add the message timestamp with the preferred format
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	// Tell Winston that the logs must be colored
	winston.format.colorize({ all: true }),
	// Define the format of the message showing the timestamp, the level and the message
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}`
	)
);

const transports = [
	// Allow the use the console to print the messages
	new winston.transports.Console(),
	// Allow to print all the error level messages inside the error.log file
	new winston.transports.File({
		filename: "logs/error.log",
		level: "error",
	}),
	// Allow to print all the error message inside the all.log file
	// (also the error log that are also printed inside the error.log(
	new winston.transports.File({ filename: "logs/all.log" }),
];

export const logger = winston.createLogger({
	level: level(),
	levels,
	format,
	transports,
});

// const createLogger = () => {
// 	const logger = winston.createLogger({
// 		level: "info",
// 		format: winston.format.json(),
// 		defaultMeta: { service: "user-service" },
// 		transports: [
// 			//
// 			// - Write all logs with importance level of `error` or less to `error.log`
// 			// - Write all logs with importance level of `info` or less to `combined.log`
// 			//
// 			new winston.transports.File({ filename: "error.log", level: "error" }),
// 			new winston.transports.File({ filename: "combined.log" }),
// 		],
// 	});

// 	if (process.env.NODE_ENV !== "production") {
// 		logger.add(
// 			new winston.transports.Console({
// 				format: winston.format.simple(),
// 			})
// 		);
// 	}

// 	return logger;
// };
