module.exports= {
	karma: {
		options: {
			preprocessors: {
				"**/*.html": ["html2js"]
		}},
		test: {
			files: ["example/build/*.html"]
		}
	}
}
