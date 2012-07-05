/**
 保存当前截图，并在日志中输出图片地址

 用法：this.saveScreenshot();

 */
exports.command = function( callback )
{
	var self = this;
	self.screenshot(
		function(result)
		{
			if (result.status == 0)
			{
				self.saveScreenshotToFile( result.value );
				if (typeof callback === "function")
				{
					callback(result);
				}
			}
			else
			{
				if (typeof callback === "function")
				{
					callback(result);
				}
			}
		}
	);
};

