document.addEventListener("DOMContentLoaded", function () {
    setupChart();
});

function startSimulation() {
    let referenceString = document.getElementById("referenceString").value.split(',').map(Number);
    let algorithm = document.getElementById("algorithm").value;
    
    if (referenceString.length === 0) {
        alert("Enter a valid reference string.");
        return;
    }

    fetch("http://localhost:5000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceString, algorithm })
    })
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(error => console.error("Error:", error));
}

function updateUI(data) {
    let memoryFrames = document.getElementById("memoryFrames");
    memoryFrames.innerHTML = "";

    data.frames.forEach(page => {
        let div = document.createElement("div");
        div.classList.add("frame");
        div.textContent = page;
        if (data.pageFaults.includes(page)) {
            div.classList.add("fault");
        }
        memoryFrames.appendChild(div);
    });

    document.getElementById("pageFaults").textContent = data.pageFaultCount;
    document.getElementById("hitRatio").textContent = `${data.hitRatio}%`;
    updateChart(data.pageFaultCount);
}
