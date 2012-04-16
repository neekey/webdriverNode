exports.command = function(cssSelector, cssProperty, expected, message, next )
{
	var self = this;
	self.getCssProperty(cssSelector, cssProperty,
		function(result)
		{
			self.showTest(result === expected, result, expected, message);
            next();
		}
	);
	
};

