// iss_promised.js
const needle = require('needle');

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  return needle('get','https://api.ipify.org?format=json')
  .then((response) => {
    const body = response.body; // retrieve the body value from the response object
    const ip = body.ip; // retrieve the ip from the body object
    return ip;
  });
};

// Get cordinates
const fetchCoordsByIP = function(ip) {
  return needle('get',`http://ipwho.is/${ip}`)
  .then((response) => {
    const body = response.body; //retrieve body from response
    const latitude = body.latitude; // retrieve latitude from body
    const longitude = body.longitude; // retrieve longitude from body
    return {latitude, longitude};
  });
};

// Get ISS flyover times
const fetchISSFlyOverTimes = function(coords) {
  const latitude = coords.latitude
  const longitude = coords.longitude;
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return needle('get', url)
  .then((response) => {
    const body = response.body;
    const passtimes = body.response; // changed the name from response to passtimes for clarification
    return passtimes;
  });
};

// Next ISS flyover times
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((passtimes) => {
      return passtimes;
    });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };