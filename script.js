fetch("/api/race-results")
  .then(res => res.json())
  .catch(err => {
    console.log("Offline mode: using cached data");
  });
