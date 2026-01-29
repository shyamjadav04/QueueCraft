function loadDashboard() {
  fetch("http://127.0.0.1:5000/dashboard")
    .then(res => res.json())
    .then(d => {
      const servingText = d.serving.length > 0
        ? `${d.serving[0].token_no} (Counter ${d.serving[0].counter_no})`
        : "None";

      document.getElementById("nowServing").innerText = servingText;
      document.getElementById("inQueue").innerText = d.waiting;
      document.getElementById("avgWait").innerText = d.avg_wait + "m";
      document.getElementById("served").innerText = d.served;
      document.getElementById("longest").innerText = d.longest + "m";
    });
}

function loadQueue() {
  fetch("http://127.0.0.1:5000/queue")
    .then(res => res.json())
    .then(rows => {
      const tbody = document.getElementById("queueTable");
      tbody.innerHTML = "";
      rows.forEach(r => {
        tbody.innerHTML += `
          <tr>
            <td>${r.token_no}</td>
            <td>${r.service_type}</td>
            <td>Waiting</td>
            <td>${priorityLabel(r.priority)}</td>
          </tr>
        `;
      });
    });
}

function priorityLabel(p) {
  return p === 1 ? "Emergency" : p === 2 ? "Senior" : "Normal";
}

setInterval(() => {
  loadDashboard();
  loadQueue();
}, 2000);

loadDashboard();
loadQueue();
