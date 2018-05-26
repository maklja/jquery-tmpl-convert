const createReport = templates => {
	const report = templates
		// create error messages for output report
		.map(curTmpl => {
			if (curTmpl.errors.length > 0) {
				let errorMsg = curTmpl.path;
				curTmpl.errors.forEach(curErr => {
					errorMsg += `\n\t ${curErr.code} - ${curErr.type}: ${
						curErr.message
					} - line number ${curErr.lineNumber}`;
				});

				return errorMsg;
			}

			return null;
		})
		// remove all messaged that doesn't have any message type
		.filter(curMsg => curMsg != null)
		// merge all messages into one file
		.join('\n'.repeat(2));

	return report;
};

const REPORT_FILE_NAME = 'report.txt';

module.exports = { createReport, defaultReportName: REPORT_FILE_NAME };
