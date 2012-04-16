exports.command = function(expected, message, next )
{
	var self = this;

	self.title(
		function(result)
		{
			self.showTest(result.value === expected, result.value, expected, message);
            next();
		}
	);
	
};

