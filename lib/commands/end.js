/**
 删除当前session，内部方法，一般不会用到
 */
exports.command = function(callback)
{
	this.session("delete",
		function(result)
		{
			if (typeof callback === "function")
			{
                var allLogs = this.getAllLogs();
                var results = this.getTestResult();

				callback( allLogs, results );
			}
		}
	);
};

