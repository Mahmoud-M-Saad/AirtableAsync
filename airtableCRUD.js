const Airtable = require("airtable")
const { AirtableAPIKey } = require("../../config")
const base = new Airtable({ apiKey: AirtableAPIKey}).base("appy2wb0mLlSBqFjj")
const salesBase = new Airtable({ apiKey: AirtableAPIKey}).base("app7Nxw3i91d9etWC")

const async = require("async")

const devMode = false
const ctx = 'assign-completed-by'
/** Sales Base */
const fetchSalesRecords = (tableName, viewName, fields, filter) => {
	return new Promise((resolve, reject) => {
		salesBase(tableName)
			.select({
				view: viewName,
				fields: fields,
				filterByFormula: filter,
			})
			.all()
			.then((records) => {
				resolve(records.map((rec) => rec._rawJson))
			})
			.catch((err) => {
				console.log(`[${ctx}]`+err.message)
				reject(err)
			})
	})
}

const deleteSalesRecords = (table, recordIds) => {
	return new Promise((resolve, reject) => {
		let promises = splitArray(recordIds).map((batch) => {
			return (done) => {
				deleteAirtableRecords("sales", table, batch).then((createRes) => {
					console.log(`[${ctx}]`+"SALES Record Deleted")
					console.log(`[${ctx}]`+createRes)
					done(null)
				})
			}
		})
		async.waterfall(promises, () => {
			console.log(`[${ctx}]`+"---Records Deleted.---")
			console.log(`[${ctx}]`+"")
			resolve()
		})
	})
}

/** Employee Base */

const fetchRecords = (tableName, viewName, fields, filter) => {
	return new Promise((resolve, reject) => {
		base(tableName)
			.select({
				view: viewName,
				fields: fields,
				filterByFormula: filter,
			})
			.all()
			.then((records) => {
				resolve(records.map((rec) => rec._rawJson))
			})
			.catch((err) => {
				console.log(`[${ctx}]`+"ERR: fetchRecords")
				console.log(`[${ctx}]`+err.message)
				reject(err)
			})
	})
}

const deleteRecords = (table, recordIds) => {
	return new Promise((resolve, reject) => {
		let promises = splitArray(recordIds).map((batch) => {
			return (done) => {
				deleteAirtableRecords("employee", table, batch)
					.then((createRes) => {
						console.log(`[${ctx}]`+"Record Deleted")
						console.log(`[${ctx}]`+createRes)
						done(null)
					})
					.catch((err) => {
						console.log(`[${ctx}]`+"ERR: deleteAirtableRecords")
						console.log(`[${ctx}]`+err.message)
						reject(err)
					})
			}
		})
		async.waterfall(promises, () => {
			console.log(`[${ctx}]`+"---Records Deleted.---")
			console.log(`[${ctx}]`+"")
			resolve()
		})
	})
}

const createRecords = (table, records) => {
	return new Promise((resolve, reject) => {
		let promises = splitArray(records).map((batch) => {
			return (done) => {
				createAirtableRecord("employee", table, batch)
					.then((createRes) => {
						console.log(`[${ctx}]`+"Record Created")
						console.log(`[${ctx}]`+createRes)
						done(null)
					})
					.catch((err) => {
						console.log(`[${ctx}]`+"ERR: createAirtableRecord")
						console.log(`[${ctx}]`+err.message)
						reject(err)
					})
			}
		})
		async.waterfall(promises, () => {
			console.log(`[${ctx}]`+"---Records Created.---")
			console.log(`[${ctx}]`+"")
			resolve()
		})
	})
}

const updateRecords = (table, records) => {
	return new Promise((resolve, reject) => {
		let promises = splitArray(records).map((batch, index) => {
			console.log(`[${ctx}]`+`Updating Batch: ${index}`)
			return (done) => {
				updateAirtableRecord("employee", table, batch)
					.then((updateRes) => {
						console.log(`[${ctx}]`+"     Records Updated: " + updateRes.map((x) => x.id));
						done(null);
					})
					.catch((err) => {
						console.log(`[${ctx}]`+"     ***ERR: Failed to Update Records: ");
						console.log(`[${ctx}]`+err.message);
						done(null);
					});
			};
		});
		async.waterfall(promises, () => {
			console.log(`[${ctx}]`+"---Records updated.---");
			console.log(`[${ctx}]`+"");
			resolve();
		});
	});
};

// const updateRecords = (table, records) => {
// 	return new Promise((resolve, reject) => {
// 		let promises = splitArray(records).map((batch) => {
// 			return (done) => {
// 				updateAirtableRecord("employee", table, batch)
// 					.then(() => {
// 						console.log(`[${ctx}]`+"Records Updated: " + batch.map((x) => x.id))
// 						done(null)
// 					})
// 					.catch((err) => {
// 						console.log(`[${ctx}]`+"ERR: updateRecords")
// 						console.log(`[${ctx}]`+err.message)
// 						reject(err)
// 					})
// 			}
// 		})
// 		async.waterfall(promises, () => {
// 			console.log(`[${ctx}]`+"---Records updated.---")
// 			console.log(`[${ctx}]`+"")
// 			resolve()
// 		})
// 	})
// }

const createAirtableRecord = (baseName, tableName, data) => {
	return new Promise((resolve, reject) => {
		let targetBase = baseName == "employee" ? base : salesBase
		console.log(`[${ctx}]`+"Target Base")
		console.log(`[${ctx}]`+targetBase)
		console.log(`[${ctx}]`+"targetBase(" + tableName + ").create(" + data + ").then(resolve).catch(reject)")
		if (devMode) {
			console.log(`[${ctx}]`+"DEV MODE: createAirtableRecord")
			resolve("fake res")
		} else targetBase(tableName).create(data).then(resolve).catch(reject)
	})
}

const updateAirtableRecord = (baseName, tableName, data) => {
	return new Promise((resolve, reject) => {
		let targetBase = baseName == "employee" ? base : salesBase
		// console.log(`[${ctx}]`+"Target Base")
		// console.log(`[${ctx}]`+targetBase)
		// console.log(`[${ctx}]`+"targetBase(" + tableName + ").update(" + data + ").then(resolve).catch(reject)")
		if (devMode) {
			console.log(`[${ctx}]`+"DEV MODE: updateAirtableRecord")
			resolve("fake res")
		} else targetBase(tableName).update(data).then(resolve).catch(reject)
	})
}

const deleteAirtableRecords = (baseName, tableName, data) => {
	return new Promise((resolve, reject) => {
		let targetBase = baseName == "employee" ? base : salesBase
		console.log(`[${ctx}]`+"Target Base")
		console.log(`[${ctx}]`+targetBase)
		console.log(`[${ctx}]`+"targetBase(" + tableName + ").destroy(" + data + ").then(resolve).catch(reject)")
		if (devMode) {
			console.log(`[${ctx}]`+"DEV MODE: deleteAirtableRecords")
			resolve("fake res")
		} else targetBase(tableName).destroy(data).then(resolve).catch(reject)
	})
}

const splitArray = (dataArr) => {
	var n = 10
	var result = new Array(Math.ceil(dataArr.length / n)).fill(0).map(function () {
		return dataArr.splice(0, n)
	})
	return result
}

const fetchHolidays = (day) => {
	return new Promise(function (resolve, rejects) {
		getHolidays()
			.then(function (holidays) {
				let isHoliday = false
				for (let i = 0; i < holidays.length; i++) {
					let now = new Date()
					if (day) now = new Date(day)
					let currentDateStr = airtableDateFormat(now)
					let cts = new Date(currentDateStr).getTime()
					let sts = new Date(holidays[i]).getTime()
					if (cts == sts) {
						console.log(`[${ctx}]`+"**Today is a holiday.")
						isHoliday = true
					}
				}
				resolve({ today: isHoliday, all: holidays })
			})
			.catch(rejects)
	})
}

const getHolidays = () => {
	return new Promise(function (resolve, rejects) {
		var holidays = []
		base("Recurring Tasks Calendar") // get Holidays first
			.select({
				view: "Grid view",
				fields: ["Date", "Type"],
			})
			.all()
			.then((calendar) => {
				for (let i = 0; i < calendar.length; i++) {
					try {
						const calendarRow = calendar[i].fields
						if (calendarRow.Type == "Holiday") holidays.push(calendarRow.Date)
					} catch (error) {
						console.log(`[${ctx}]`+"getHolidays ERR: " + err.message)
					}
				}
				resolve(holidays)
			})
			.catch(rejects)
	})
}
const airtableDateFormat = (dateob) => {
	let currentYear = dateob.getFullYear()
	let currentMonth = dateob.getMonth() + 1
	if (currentMonth < 10) currentMonth = "0" + currentMonth

	let currentDate = dateob.getDate()
	if (currentDate < 10) currentDate = "0" + currentDate

	return `${currentYear}-${currentMonth}-${currentDate}`
}

exports.fetchRecords = fetchRecords
exports.createRecords = createRecords
exports.updateRecords = updateRecords
exports.deleteRecords = deleteRecords
exports.airtableDateFormat = airtableDateFormat
exports.fetchHolidays = fetchHolidays
exports.fetchSalesRecords = fetchSalesRecords
exports.deleteSalesRecords = deleteSalesRecords
