function Tab(props) {
  function showTab(e) {
    $(e.target).tab("show");
  }

  var href = "#" + encodeURIComponent(props.tagName); // this is tightly coupled with ActivityList
  return (
    <li className="nav-item">
      <a onClick={showTab} className={"nav-link" + (props.activeActivity == props.tagName ? " active" : "")} href={href}>{props.tagName}</a>
    </li>
  );
}

function ActivityInfoDialog(props) {
  function setMinus60() { $("#tMinusHours").val("1"); $("#tMinusMinutes").val("0"); }
  function setMinus45() { $("#tMinusHours").val("0"); $("#tMinusMinutes").val("45"); }
  function setMinus30() { $("#tMinusHours").val("0"); $("#tMinusMinutes").val("30"); }
  function setMinus15() { $("#tMinusHours").val("0"); $("#tMinusMinutes").val("15"); }

  function trackActivity() {
    var hours = $("#tMinusHours").val();
    var minutes = $("#tMinusMinutes").val();
    
    hours = hours.replaceAll(" ", "") == "" ? "0" : hours;
    minutes = minutes.replaceAll(" ", "") == "" ? "0" : minutes;

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    hours *= 1000 * 60 * 60;
    minutes *= 1000 * 60;
    var milliseconds = hours + minutes;

    props.onTrackActivity(milliseconds);
  }

  return (
      <div id="trackActivityDialog" className="modal" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Track Activity - {props.curActivity == null ? "" : props.curActivity.name}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>T -</label>
                <input type="text" className="form-control" id="tMinusHours" placeholder="0" /> hours
                <input type="text" className="form-control" id="tMinusMinutes" placeholder="0" /> minutes
              </div>
              <div className="form-group quick-t">
                <button type="button" class="btn btn-info" onClick={setMinus60}>T-1 hour</button>
                <button type="button" class="btn btn-warning" onClick={setMinus45}>T-45 min</button>
                <button type="button" class="btn btn-danger" onClick={setMinus30}>T-30 min</button>
                <button type="button" class="btn btn-success" onClick={setMinus15}>T-15 min</button>                
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={trackActivity}>Save changes</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
  );
}

function Activity(props) {
  function openActivityInfoDialog() {
    props.showTrackActivityDialog(props.activity);
  }

  return (
      <button type="button" className="activity btn btn-primary" onClick={openActivityInfoDialog}>{props.activity.name}</button>
  );
}

function ActivityList(props) {
  var id = encodeURIComponent(props.groupedActivity[0].tag); // this is tightly coupled with Tab
  return (
    <div className={"tab-pane fade" + (props.activeActivity == props.groupedActivity[0].tag ? " active show" : "")} id={id} role="tabpanel">
      { props.groupedActivity.map((activity, i) => <Activity key={i} activity={activity} showTrackActivityDialog={props.showTrackActivityDialog} />) }
    </div>
  );
}

function AddActivityDialog(props) {
  function addActivity() {
    var newActivityName = $("#newActivityName").val();
    var newActivityTag = $("#newActivityTag").val();
    props.onAddActivity({
      name: newActivityName,
      tag: newActivityTag
    });
  }

  return(
    <div id="addActivityDialog" className="modal" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Activity</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="newActivityName">Activity Name</label>
              <input type="text" className="form-control" id="newActivityName" placeholder="1.5 Mile Jog, 4 Hours Programming, 1 Hour Math, etc." />
            </div>
            <div className="form-group">
              <label htmlFor="newActivityTag">Group</label>
              <input type="text" className="form-control" id="newActivityTag" placeholder="Fitness, Work, Learning, etc." />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={addActivity}>Save changes</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getUniqueTags() {
  const activities = await activityStorageManager.getActivities();
  return [...new Set(activities.map(activity => activity.tag))]; // https://stackoverflow.com/a/35092559
}

function ActivityTabs(props) {
  let tags = [...new Set(props.activities.map(activity => activity.tag))];
  let groupedActivities = tags.map(tag => props.activities.filter(activity => activity.tag == tag));
  let activeActivity = tags[0];

  return ( 
    <div>
      <ul className="nav nav-tabs">
        { tags.map((tagName, i) =>  <Tab key={i} activeActivity={activeActivity} tagName={tagName} /> ) }     
      </ul>
      <button id="buttonShowAddActivity" type="button" className="btn btn-primary" onClick={props.showAddActivityDialog}>New Activity Type</button>
      <div className="tab-content">
        { groupedActivities.map((groupedActivity, i) => <ActivityList key={i} activeActivity={activeActivity} groupedActivity={groupedActivity} showTrackActivityDialog={props.showTrackActivityDialog} />) }    
      </div>
    </div>
  );
}



function ActivityListItem(props) {
  function deleteTrackedActivity() {
    var doTheDelete = confirm("Are you sure you want to delete activity type '" + props.activity.name + "' with tag '" + props.activity.tag + "'? This only deletes the type of activity. Activities of this type that have already been logged will not be deleted unless you manually delete them. *However, although they are not deleted they will not show up in the graph.");
    if(doTheDelete) {
      props.onDeleteActivity(props.activity);
    }
  }
  return (
    <li>
      <span>{props.activity.name} | {props.activity.tag}</span>
      <button type="button" className="btn btn-warning delete-activity-button" onClick={deleteTrackedActivity}>Delete 🗑️</button>
    </li>
  );
}

function TrackedActivityListItem(props) {
  function deleteTrackedActivity() {
    var doTheDelete = confirm("Are you sure you want to delete activity " + props.trackedActivity.name + " at " + (new Date(props.trackedActivity.activityTime)).toString() + "?");
    if(doTheDelete) {
      props.onDeleteTrackedActivity(props.trackedActivity);
    }
  }
  return (
    <li>
      <span>{(new Date(props.trackedActivity.activityTime)).toString()}: {props.trackedActivity.name}</span>
      <button type="button" className="btn btn-danger delete-tracked-activity-button" onClick={deleteTrackedActivity}>Delete 🗑️</button>
    </li>
  );
}

function TrackedActivityList(props) {
  React.useEffect(() => {
    // Only create/update chart if we have data or need to initialize
    if (props.trackedActivities.length > 0 || !window.chart) {
      chartManager.createOrUpdateChart();
    }
  }, [props.trackedActivities]); // Only update when tracked activities change

  async function copyActivityLogToClipboard() {
    var activitiesLog = await activityStorageManager.toString();
    var trackedActivitiesLog = await trackedActivityStorageManager.toString();
    var activityLog = activitiesLog + "\n\n\n" + trackedActivitiesLog;
    navigator.clipboard.writeText(activityLog);
  }

  return (
    <div className="accordion" id="accordionExample">
      <div className="card">
        <div className="card-header" id="headingOne">
          <h2 className="mb-0">
            <button id="showChartButton" className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Chart
            </button>
          </h2>
        </div>

        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
          <div className="card-body">
           <div id="myChart"></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header" id="headingTwo">
          <h2 className="mb-0">
            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Log and Delete
            </button>
          </h2>
        </div>
        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
          <div className="card-body text-log">
            <ul>
              { props.trackedActivities.map((trackedActivity, i) => <TrackedActivityListItem key={i} onDeleteTrackedActivity={props.onDeleteTrackedActivity} trackedActivity={trackedActivity} />) }    
            </ul> 
            <hr></hr>
            <ul>
              { props.activities.map((activity, i) => <ActivityListItem key={i} onDeleteActivity={props.onDeleteActivity} activity={activity} />) }    
            </ul>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header" id="headingThree">
          <h2 className="mb-0">
            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              Miscellaneous
            </button>
          </h2>
        </div>
        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
          <div className="card-body">
            <button type="button" className="btn btn-info delete-tracked-activity-button" onClick={copyActivityLogToClipboard}>Copy Activity Log To Clipboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}

var chartManager = (function() {
  var tagColors = [ // https://coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
    "#001219",
    "#9B2226",
    "#0A9396",
    "#BB3E03",
    "#E9D8A6",
    "#EE9B00",
    "#94D2BD",
    "#CA6702",
    "#005F73",
    "#AE2012" // after this many colors it's whatever random color canvasjs uses
  ]; //color: tagIndex < tagColors.length ? tagColors[tagIndex] : undefined

  function getTimezoneOffsetInMilliseconds() {
    return (new Date().getTimezoneOffset()) * 1000 * 60;
  }

  async function getSeries() {
    var trackedActivities = await trackedActivityStorageManager.getTrackedActivities();
    var oneDayMilliseconds = 1000 * 60 * 60 * 24;
    var yesterday = Date.now() - oneDayMilliseconds;
    trackedActivities = trackedActivities.filter(a => a.activityTime > yesterday);
    var gmt = getTimezoneOffsetInMilliseconds();
    var uniqueTags = await getUniqueTags();
    var series = [];
  
    for(var i = 0; i < uniqueTags.length; i++) {
      var seriesTag = uniqueTags[i];
      var seriesItem = {
        name: seriesTag,
        data: []
      }
      series.push(seriesItem);
      for(var i2 = 0; i2 < trackedActivities.length; i2++) {
        var trackedActivity = trackedActivities[i2];
        if(trackedActivity.tag == seriesTag) {
          seriesItem.data.push([
            new Date(trackedActivity.activityTime - gmt),
            i + 1,
            trackedActivity.name
          ]);
        }
      }
    }
    return series;
  }


  var lastSeries = null;
  async function getChartOptions() {
    var uniqueTags = await getUniqueTags();
    lastSeries = await getSeries();
    var options = {
      series: lastSeries,
      chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        type: 'xy'
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      max: uniqueTags.length
    },
    tooltip: {
      x: {
        formatter: function(value) {
          var gmt = getTimezoneOffsetInMilliseconds();
          var minutesSinceTrackedActivity = parseMillisecondsIntoReadableTime(Date.now() - value - gmt);
          return (new Date(value + gmt)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " | " + minutesSinceTrackedActivity + " ago";
        }
      },
      y: {
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          return lastSeries[seriesIndex].data[dataPointIndex][2];
        }
      }
    }
    };
    return options;
  }

  function parseMillisecondsIntoReadableTime(milliseconds){ // https://stackoverflow.com/a/33909506
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    var zeroHour = h == 0 || h == "0" || h == "00"; // idk what it is and i dont care
    var result = zeroHour ? "" : h + ' hours ';
    result += m + " minutes";
    return result;
  }

  var isCreatingChart = false;
  
  async function createChart() {
    // Guard against double creation - check both chart existence and creation flag
    if (window.chart || isCreatingChart) {
      return;
    }
    
    isCreatingChart = true; // Set flag immediately to prevent race conditions
    
    try {
      var options = await getChartOptions();
      window.chart = new ApexCharts(document.querySelector("#myChart"), options);
      chart.render();
    } finally {
      isCreatingChart = false; // Reset flag when done
    }
  }

   async function updateChart() {
     var options = await getChartOptions();
     chart.updateOptions(options, true);
   }

   async function createOrUpdateChart() {
     if(window.chart == undefined) {
       await createChart();
     }
     else {
       await updateChart();
     }
   }

   return {
     createOrUpdateChart: createOrUpdateChart
   }
})();



function SessionInfo(props) {
  const [sessionInputValue, setSessionInputValue] = React.useState('');
  const [currentSessionId, setCurrentSessionId] = React.useState(sessionManager.getSessionId());

  function loadSession() {
    if (sessionInputValue.trim()) {
      sessionManager.loadSession(sessionInputValue.trim());
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      loadSession();
    }
  }

  React.useEffect(() => {
    sessionManager.updateSessionDisplay = () => {
      setCurrentSessionId(sessionManager.getSessionId());
    };
  }, []);

  return (
    <div id="sessionInfo" style={{ marginBottom: '1em', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '5px' }}>
      <div className="row">
        <div className="col-md-6">
          <strong>Your Session ID:</strong> <span id="sessionDisplay" style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{currentSessionId || 'Demo Session'}</span>
          <br />
          <small className="text-muted">Email this ID to yourself to access your data on other devices</small>
        </div>
        <div className="col-md-6">
          <div className="input-group input-group-sm">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Paste session ID to load different session" 
              value={sessionInputValue}
              onChange={(e) => setSessionInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={loadSession}>Load</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SAT(props) {
  const [activities, setActivities] = React.useState([]);
  const [curActivity, setCurActivity] = React.useState(null);
  const [trackedActivities, setTrackedActivities] = React.useState([]);

  // Load activities and tracked activities on component mount
  React.useEffect(() => {
    async function loadData() {
      sessionManager.updateSessionDisplay();
      const activitiesData = await activityStorageManager.getActivities();
      setActivities(activitiesData);
      
      const trackedData = await trackedActivityStorageManager.getTrackedActivities();
      setTrackedActivities(trackedData);
    }
    loadData();
  }, []);

  function showAddActivityDialog() {
    $("#newActivityName").val("");
    $("#newActivityTag").val("");
    $('#addActivityDialog').modal('show');
  }

  async function addActivity(result) {
    $('#addActivityDialog').modal('hide');
    var isValid = result.name.replaceAll(" ", "") !== "" && result.tag.replaceAll(" ", "") !== "";
    if(isValid) {
      await activityStorageManager.addActivity(result);
      setActivities(await activityStorageManager.getActivities());
    }
  }

  function showTrackActivityDialog(activity) {
    setCurActivity(activity);
    $("#tMinusHours").val("");
    $("#tMinusMinutes").val("");
    $("#trackActivityDialog").modal('show');
  }

  async function trackActivity(tMinusMilliseconds) {
    var trackedActivity = JSON.parse(JSON.stringify(curActivity));
    trackedActivity.logTime = Date.now();
    trackedActivity.activityTime = Date.now() - tMinusMilliseconds;
    await trackedActivityStorageManager.addTrackedActivity(trackedActivity);
    setTrackedActivities(await trackedActivityStorageManager.getTrackedActivities());
    $("#trackActivityDialog").modal('hide');
  }

  async function deleteTrackedActivity(trackedActivity) {
    await trackedActivityStorageManager.deleteTrackedActivity(trackedActivity);
    setTrackedActivities(await trackedActivityStorageManager.getTrackedActivities());
  }

  async function deleteActivity(activity) {
    await activityStorageManager.deleteActivity(activity);
    setActivities(await activityStorageManager.getActivities());
  }
  
  return (
    <div>
      <SessionInfo />
      <div className="card" id="activityTabs">
        <ActivityTabs activities={activities} showAddActivityDialog={showAddActivityDialog} showTrackActivityDialog={showTrackActivityDialog} />
        <AddActivityDialog onAddActivity={addActivity} />
        <ActivityInfoDialog curActivity={curActivity} onTrackActivity={trackActivity} />
        <TrackedActivityList activities={activities} trackedActivities={trackedActivities} onDeleteActivity={deleteActivity} onDeleteTrackedActivity={deleteTrackedActivity} />
      </div>
    </div>
  );
}

ReactDOM.render(<SAT />, document.getElementById('root'));