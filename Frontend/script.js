// API Base URL for Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Global variables
let allTrains = [];
let currentFilter = 'all';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    loadAllTrains();
});

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('travel-date').min = today;
    document.getElementById('travel-date').value = today;
}

// Search trains function
function searchTrains(event) {
    event.preventDefault();

    const fromStation = document.getElementById('from-station').value.trim();
    const toStation = document.getElementById('to-station').value.trim();
    const travelDate = document.getElementById('travel-date').value;

    // Basic validation
    if (!fromStation || !toStation) {
        showMessage('Please enter both stations', 'error');
        return;
    }

    if (fromStation.toLowerCase() === toStation.toLowerCase()) {
        showMessage('Source and destination cannot be same', 'error');
        return;
    }

    // Show results section
    const resultsSection = document.getElementById('results');
    const loading = document.getElementById('loading');
    const trainResults = document.getElementById('train-results');

    resultsSection.style.display = 'block';
    loading.style.display = 'block';
    trainResults.innerHTML = '';

    // Simulate search delay
    setTimeout(() => {
        loading.style.display = 'none';
        searchTrainsAPI(fromStation, toStation, travelDate);
    }, 1000);
}

// Search trains via API or show error message
async function searchTrainsAPI(fromStation, toStation, travelDate) {
    try {
        // Try to fetch from API
        const response = await fetch(`${API_BASE_URL}/trains/search?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}`);

        let searchResults = [];
        if (response.ok) {
            searchResults = await response.json();
        } else {
            // Show backend error instead of mock data
            displayBackendError();
            return;
        }

        displaySearchResults(searchResults, fromStation, toStation);

    } catch (error) {
        console.log('Backend not connected for search');
        displayBackendError();
    }
}

// Display backend connection error for search
function displayBackendError() {
    const trainResults = document.getElementById('train-results');
    trainResults.innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Backend Not Connected</h3>
            <p>Unable to connect to the server. Please ensure the Spring Boot application is running on port 8080.</p>
            <button onclick="searchTrains(event)" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
                Retry Search
            </button>
        </div>
    `;
}

// Display search results
function displaySearchResults(trains, fromStation, toStation) {
    const trainResults = document.getElementById('train-results');

    if (trains.length === 0) {
        trainResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No trains found</h3>
                <p>No trains available from ${fromStation} to ${toStation}</p>
            </div>
        `;
        return;
    }

    trainResults.innerHTML = trains.map(train => `
        <div class="train-card">
            <div class="train-header">
                <div class="train-name">${train.trainName}</div>
                <div class="train-number">${train.trainNumber}</div>
            </div>
            <div class="train-details">
                <div class="detail-item">
                    <div class="detail-label">Departure</div>
                    <div class="detail-value">${train.departureTime}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value">${train.duration}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Arrival</div>
                    <div class="detail-value">${train.arrivalTime}</div>
                </div>
            </div>
            <div class="train-footer">
                <div class="fare">${train.fare || 'Contact for price'}</div>
                <button class="book-btn" onclick="bookTrain('${train.trainNumber}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Load all trains
async function loadAllTrains() {
    try {
        const response = await fetch(`${API_BASE_URL}/trains`);
        if (response.ok) {
            allTrains = await response.json();
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.log('Backend not connected');
        allTrains = []; // Empty array instead of mock data
    }

    displayAllTrains();
}

// Display all trains
function displayAllTrains() {
    const trainsContainer = document.getElementById('all-trains');

    // Check if backend is not connected (empty allTrains array)
    if (allTrains.length === 0) {
        trainsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Backend Not Connected</h3>
                <p>Unable to connect to the server. Please ensure the Spring Boot application is running on port 8080.</p>
                <button onclick="loadAllTrains()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
                    Retry Connection
                </button>
            </div>
        `;
        return;
    }

    const filteredTrains = currentFilter === 'all' ? allTrains : allTrains.filter(train => (train.type || 'express') === currentFilter);

    trainsContainer.innerHTML = filteredTrains.map(train => {
        // Set default values for missing properties
        const trainType = train.type || 'express';
        const route = train.route || `${train.trainName} Route`;
        const frequency = train.frequency || 'Daily';

        return `
        <div class="train-card">
            <div class="train-header">
                <div class="train-name">${train.trainName || 'Unknown Train'}</div>
                <div class="train-number">${train.trainNumber || 'N/A'}</div>
            </div>
            <div class="train-info">
                <div><strong>Route:</strong> ${route}</div>
                <div><strong>Frequency:</strong> ${frequency}</div>
                <div>
                    <span class="train-type" style="background: ${trainType === 'express' ? '#3498db' : '#e74c3c'}">
                        ${trainType.toUpperCase()}
                    </span>
                </div>
            </div>
            <button class="book-btn" onclick="selectTrain('${train.trainNumber}', '${route}')" style="width: 100%; margin-top: 1rem;">
                Select Train
            </button>
        </div>
        `;
    }).join('');
}

// Filter trains by type
function filterTrains(type) {
    currentFilter = type;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    displayAllTrains();
}

// Select a train (auto-fill search form)
function selectTrain(trainNumber, route) {
    const routeParts = route.split(' - ');
    if (routeParts.length === 2) {
        document.getElementById('from-station').value = routeParts[0];
        document.getElementById('to-station').value = routeParts[1];
        showMessage(`Selected train ${trainNumber}. Click search to find details.`, 'success');
    }
}

// Book train function
function bookTrain(trainNumber) {
    showMessage(`Booking request submitted for train ${trainNumber}`, 'success');
}

// Show notification message
function showMessage(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; margin-left: auto; cursor: pointer;">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}
