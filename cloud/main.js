
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('hello2', function(req, res) {
  res.success('Hello, there! This is coding4fun ;)');
});

Parse.Cloud.define('hello3', function(req, res) {
  res.success('Hello, there! This is coding4fun ;)');
});


Parse.Cloud.define("getDriversRating", function(request, response) {
  var query = new Parse.Query("Driver");
  //query.equalTo("movie", request.params.movie);
  query.find({
    success: function(results) {
      var r = "";
      for (var i = 0; i < results.length; ++i) {
        r += results[i].id + " has " + results[i].get("rating") + "  ...  ";
      }
      response.success(r);
    },
    error: function(error) {
      response.error("Error: " + error.code + " " + error.message);
    }
  });
});


Parse.Cloud.define("getSuitableDrivers", function(request, response) {
  var drivers = [];
  var query = new Parse.Query("Ride");
  query.equalTo("travel_end_time", "");
  query.include("driver_obj");
  query.find({
    success: function(results) {
	  var r = "";
      for (var i = 0; i < results.length; ++i) {
        var driver = results[i].get("driver_obj");
		drivers.push(driver);
		var phoneNumber = driver.get("phone_number");
		r += phoneNumber + " , ";
      }
	  r += " , there are " + drivers.length + " drivers";
      response.success(r);
    },
    error: function(error) {
      response.error("Error: " + error.code + " " + error.message);
    }
  });
});


/*Parse.Cloud.beforeSave("Request", function(request, response) {
  //query = new Parse.Query("dummy");
  var GameScore = Parse.Object.extend("dummy");
  var query = new Parse.Query(GameScore);
  query.get("TDvVkRXEEB", {
    success: function(dummy) {
      dummy.increment("before");
      dummy.save();
	  response.success();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
	  response.error("Got an error " + error.code + " : " + error.message);
    }
  });
});*/

/*Parse.Cloud.afterSave("Request", function(request) {
  
    var Dummy = Parse.Object.extend("Dummy");
    var dummy = new Dummy();
    dummy.save({after:2}).then(function(object) {
      //alert("yay! it worked");
    });
  
  //var query = new Parse.Query("dummy");
  /*query.set("after",2);
  query.save(null, {
	  success: function(query){
		  
	  },
	  error: function(query,error){
		  
	  }
  });*/
  //var GameScore = Parse.Object.extend("dummy");
  //var query = new Parse.Query(GameScore);
  /*query.equalTo("objectId", "TDvVkRXEEB");
  query.first({
    success: function(dummy) {
      dummy.increment("after");
      dummy.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });*/
  //console.error("no error.. just testing something :p");
//});

Parse.Cloud.define("busDriverCurrentLocationUpdated", function(request, response) {
	var RideTable = Parse.Object.extend("Ride"); //You can put this at the top of your cloud code file so you don't have to do it in every function
    var rideObject = new RideTable(); 
    var rideObjectId = request.params.ride_obj_id;
	rideObject.id = rideObjectId;
	rideObject.fetch().then(
		function(rideObject){
			//var ride = request.params.ride_obj; >> error in android: java.lang.IllegalArgumentException: ParseObjects not allowed here
			var newLat = request.params.newLat;
			var newLng = request.params.newLng;
			var newBearing = request.params.newBearing;
			ride.set("current_lat",newLat);
			ride.set("current_lng",newLng);
			ride.save(null, {
				success: function(ride){
					console.log("Driver location updated successfully :)");
				},
				error: function(ride, error){
					console.log("Failed updating driver location! :( " + error.message);
				}
			});
			//send push notification to all active users to update bus location on their map
			Parse.Push.send({
				channels: ["active"],
				data:{
					lat: newLat,
					lng: newLng,
					bearing: newBearing
				}
			}, {
				success: function(){
					console.log("pushed successfully :)");
				},
				error: function(){
					console.log("push Failed! :(");
				}
			});
			var r = newLat + "," + newLng;
			console.log(r);
			response.success(r);
		},
		function(error){
			console.log(error);
			response.error(error);
		}
	);
});

Parse.Cloud.define("busDriverCurrentLocationUpdated2", function(request, response) {	
	var rideObjectId = request.params.ride_obj_id;
	var newLat = request.params.newLat;
	var newLng = request.params.newLng;
	var newBearing = request.params.newBearing;

	var query = new Parse.Query("Ride");
	query.equalTo("objectId",rideObjectId);
	query.find({useMasterKey: true,
    success: function(results) {
		var ride = results[0];
		ride.set("current_lat",newLat);
		ride.set("current_lng",newLng);
		ride.save(null, {useMasterKey: true,
			success: function(ride){
				console.log("Driver location updated successfully :)");
			},
			error: function(ride, error){
				console.log("Failed updating driver location! :( " + error.message);
			}
		});
		//send push notification to all active users to update bus location on their map
		Parse.Push.send({
			channels: ["active"],
			data:{
				ride_id: rideObjectId,
				lat: newLat,
				lng: newLng,
				bearing: newBearing,
				alert: "HandRider push notification test...",
				title: "HandRider!"
			}
		}, {
      useMasterKey: true
    })
    .then(function() {
      response.success("Push Sent!");
    }, function(error) {
      response.error("Error while trying to send push " + error.message);
    });
		var r = newLat + "," + newLng;
		console.log(r);
		response.success(r);
		response.success(r);
    },
    error: function(error) {
      response.error("Error: " + error.code + " " + error.message);
    }
  });
});


Parse.Cloud.define("testHTTPrequest", function(request, response) {
	Parse.Cloud.httpRequest({
		url: 'https://maps.googleapis.com/maps/api/directions/json?sensor=false&origin=33.87177737417301,35.49630884081125&destination=33.67607214239718,35.46580508351326'
	},{useMasterKey: true}).then(function(httpResponse) {
		// success
		//console.log(httpResponse.text);
		//response.success(httpResponse.text);
		var r = JSON.parse(httpResponse.text);
		var encodedPolyLine = r.routes[0].overview_polyline.points;
		console.log(encodedPolyLine);
		response.success(encodedPolyLine);
	},function(httpResponse) {
		// error
		console.error('Request failed with response code ' + httpResponse.status);
		response.error('Request failed with response code ' + httpResponse.status);
	});
});


Parse.Cloud.define("busDriverCurrentLocationUpdated3", function(request, response) {
	var rideObjectId = request.params.ride_obj_id;
	var newLat = request.params.newLat;
	var newLng = request.params.newLng;
	var newBearing = request.params.newBearing;

	console.log("start query");
	var query = new Parse.Query("Ride");
	query.equalTo("objectId",rideObjectId);
	query.include("destination_university_obj");
	query.find({
		useMasterKey: true,
		success: function(results) {
			console.log("done query");
			var ride = results[0];
			var destUni = ride.get("destination_university_obj");
			console.log("destUni location : " + destUni.get("location").latitude + "," + destUni.get("location").longitude);
			
			Parse.Cloud.httpRequest({
				url: 'https://maps.googleapis.com/maps/api/directions/json?sensor=false&origin='+newLat+','+newLng+'&destination='+destUni.get("location").latitude+','+destUni.get("location").longitude
			},{useMasterKey: true}).then(function(httpResponse) {
				// success
				var r = JSON.parse(httpResponse.text);
				var encodedPolyLine = r.routes[0].overview_polyline.points;
				console.log("destUni location : " + destUni.get("location").latitude + "," + destUni.get("location").longitude + " .. encodedPolyLine : " + encodedPolyLine);
				ride.set("current_lat",newLat);
				ride.set("current_lng",newLng);
				ride.set("current_encoded_path",encodedPolyLine);
				//update driver location
				ride.save(null, {useMasterKey: true,
					success: function(ride){
						console.log("Driver location updated successfully :)");
						//send push notification to all active users to update bus location on their map
						Parse.Push.send({
							channels: ["active"],
							data:{
								ride_id: rideObjectId,
								lat: newLat,
								lng: newLng,
								bearing: newBearing,
								alert: "HandRider push notification test...",
								title: "HandRider!"
							}
						}, {useMasterKey: true}).then(function() {
							console.log("notification pushed");
							response.success("DONE");
						}, function(error) {
							response.error("Error while trying to send push " + error.message);
						});
					},
					error: function(ride, error){
						console.log("Failed updating driver location! :( " + error.message);
						response.error("Error: " + error.code + " " + error.message);
					}
				});
			},function(httpResponse) {
				// error
				console.error('Request failed with response code ' + httpResponse.status);
				response.error('Request failed with response code ' + httpResponse.status);
			});
			},
		error: function(error) {
			response.error("Error: " + error.code + " " + error.message);
		}
	});
});


Parse.Cloud.afterSave("Request", function(request) {
	var ride = request.object.get("ride_obj");
	console.log("ride json: " + ride.toJSON());
	//console.log("request lat: " + request.object.get("startFrom_latitude") + ", request lng: " + request.object.get("startFrom_longitude"));
	var driver = ride.get("driver_obj");
	console.log("driver json: " + driver.toJSON());
	//console.log("driver phone#: " + driver.get("phone_number"));
	//var user = driver.get("user_obj");
	//console.log("user name: " + user.get("fullname"));
	
	// Find device associated with this user
	/*var pushQuery = new Parse.Query(Parse.Installation);
	pushQuery.equalTo('user', user);
	// Send push notification to query
	Parse.Push.send({
		where: pushQuery,
		data:{
			lat: request.object.get("startFrom_latitude"),
			lng: request.object.get("startFrom_longitude"),
			alert: "New Request...",
			title: "HandRider!"
		}
	}, {useMasterKey: true}).then(function() {
		console.log("notification pushed");
	}, function(error) {
		console.log("Error while trying to send push " + error.message);
	});*/
});
