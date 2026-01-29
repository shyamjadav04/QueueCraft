function callNext() {
  fetch("http://127.0.0.1:5000/queue/call-next", {
    method: "POST"
  })
  .then(res => res.json())
  .then(d => {
    alert("Now Serving: " + d.serving + " at Counter " + d.counter);
    loadDashboard();
  });
}

function completeToken() {
  const token = prompt("Enter token to complete:");
  fetch("http://127.0.0.1:5000/queue/complete", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({token})
  })
  .then(res => res.json())
  .then(d => {
    alert("Completed: " + d.completed);
    loadDashboard();
  });
}

function loadDashboard() {
  fetch("http://127.0.0.1:5000/dashboard")
    .then(res => res.json())
    .then(d => {
      const serving = d.serving.length > 0 
        ? `${d.serving[0].token_no} (Counter ${d.serving[0].counter_no})`
        : "None";
      document.getElementById("serving").innerText = serving;
      document.getElementById("queueCount").innerText = d.waiting;
    });

  fetch("http://127.0.0.1:5000/queue")
    .then(res => res.json())
    .then(rows => {
      const tbody = document.getElementById("queueTable");
      tbody.innerHTML = "";
      rows.forEach(r => {
        tbody.innerHTML += `<tr>
          <td>${r.token_no}</td>
          <td>${r.service_type}</td>
          <td>${priorityLabel(r.priority)}</td>
        </tr>`;
      });
    });
}

function priorityLabel(p) {
  return p === 1 ? "Emergency" : p === 2 ? "Senior" : "Normal";
}

setInterval(loadDashboard, 1500);
loadDashboard();
