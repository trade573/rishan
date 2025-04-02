// DOM Elements
const liveValueElement = document.getElementById('liveValue');
const statusTickerElement = document.getElementById('statusTicker');
const stockGraphCanvas = document.getElementById('stockGraph');
const withdrawBtn = document.getElementById('withdrawBtn');

// Initial Stock Value
let stockValue = 75000; // Starting value of ₹7,500

// Initialize Graph
const ctx = stockGraphCanvas.getContext('2d');
let stockGraph = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({ length: 60 }, (_, i) => i + 1),  // 60 time points
        datasets: [{
            label: 'Stock Price (₹)',
            data: JSON.parse(localStorage.getItem('graphData')) || Array(60).fill(stockValue),  // Retrieve from localStorage
            backgroundColor: 'rgba(0, 255, 0, 0.3)', 
            borderColor: 'rgba(0, 255, 0, 1)',  
            borderWidth: 1,
            fill: true,
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                title: { display: true, text: 'Time (minutes)' },
            },
            y: {
                title: { display: true, text: 'Stock Price (₹)' },
                ticks: { beginAtZero: false },
            },
        },
        animation: { duration: 0 },
    }
});

// Function to check and update stock value based on time
function updateStockValue() {
    const currentDate = new Date();
    
    // Set the stock value at specific dates/times
    if (currentDate >= new Date('2025-04-02T00:00:00') && currentDate < new Date('2025-04-03T00:00:00')) {
        stockValue = 80000;
    } else if (currentDate >= new Date('2025-04-03T00:00:00') && currentDate < new Date('2025-04-04T00:00:00')) {
        stockValue = 95000;
    } else if (currentDate >= new Date('2025-04-04T00:00:00') && currentDate < new Date('2025-04-05T00:00:00')) {
        stockValue = 100000;
    } else if (currentDate >= new Date('2025-04-05T00:00:00') && currentDate < new Date('2025-04-06T00:00:00')) {
        stockValue = 0;
    }

    if (stockValue === 0) {
    return;  // Stop further execution and prevent fluctuation
}

    // Apply random fluctuation to the stock value (±5%)
    const fluctuation = (Math.random() * 0.1 - 0.05);  // ±5% fluctuation
    stockValue += stockValue * fluctuation;

    if (stockValue < 0) stockValue = 0;  // Prevent negative values

    // Update Live Stock Value
    liveValueElement.textContent = `₹${stockValue.toLocaleString('en-IN')}`;

    // Update Graph
    updateGraph(stockValue);
}

// Function to update graph with new data
function updateGraph(newValue) {
    stockGraph.data.datasets[0].data.push(newValue);
    stockGraph.data.datasets[0].data.shift();  // Remove the oldest value
    stockGraph.update();

    // Store updated graph data in localStorage
    localStorage.setItem('graphData', JSON.stringify(stockGraph.data.datasets[0].data));
}

// Update stock value every second
setInterval(updateStockValue, 1000);

// Update status ticker randomly
function updateStatusTicker() {
    const fluctuation = (Math.random() * 200 - 100);  // Random fluctuation
    if (fluctuation > 0) {
        statusTickerElement.textContent = "Stock is rising!";
        statusTickerElement.style.color = "#66ff66";  // Green
    } else if (fluctuation < 0) {
        statusTickerElement.textContent = "Stock is falling!";
        statusTickerElement.style.color = "#ff6666";  // Red
    } else {
        statusTickerElement.textContent = "Stock is steady.";
        statusTickerElement.style.color = "#ffcc00";  // Yellow
    }
}

// Withdraw Button Action
withdrawBtn.addEventListener('click', () => {
    const confirmWithdrawal = confirm("Are you sure you want to withdraw? The stock will be up for upcoming days.");

    if (confirmWithdrawal) {
        const serverDown = Math.random() > 0.5; // Simulate server down with 50% probability
        if (serverDown) {
            alert("Server is down. Please try again later.");
        } else {
            alert("Your withdrawal is being processed.");
        }
    } else {
        alert("Good luck with your investments!");
    }
});

// Update ticker and data every second
setInterval(updateStatusTicker, 1000);
