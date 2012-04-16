exports.command = function( cssSelector, visible, message, next )
{
	var self = this;
	self.isVisible(cssSelector,
		function(result)
		{
			self.showTest(result === visible, result, visible, message);

            next();
		}
	);
	
};

