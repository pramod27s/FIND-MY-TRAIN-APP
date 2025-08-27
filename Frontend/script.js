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
function displaySearchResults(trains, fromStation, toStation) {
    const trainResults = document.getElementById('train-results');

    if (!trains || trains.length === 0) {
        trainResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No trains found</h3>
                <p>No trains available from ${fromStation} to ${toStation}</p>
                <div class="suggestions">
                    <p>Try:</p>
                    <ul>
                        <li>Checking station names for typos</li>
                        <li>Using different station names or codes</li>
                        <li>Searching for a different date</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }

    // Sort trains by departure time
    const sortedTrains = trains.sort((a, b) => {
        const timeA = convertTimeToMinutes(a.departureTime || a.departure);
        const timeB = convertTimeToMinutes(b.departureTime || b.departure);
        return timeA - timeB;
    });

    trainResults.innerHTML = `
        <div class="results-header">
            <h3>${sortedTrains.length} train(s) found from ${fromStation} to ${toStation}</h3>
        </div>
        <div class="trains-list">
            ${sortedTrains.map(train => createOptimizedTrainCard(train)).join('')}
        </div>
    `;
}

function createOptimizedTrainCard(train) {
    // Handle different property names from TrainSchedule vs Train entity
    const trainName = train.trainName || train.train?.trainName || `Train ${train.trainNumber || train.train?.trainNumber || 'Unknown'}`;
    const trainNumber = train.trainNumber || train.train?.trainNumber || train.id || 'N/A';
    const departureTime = train.departureTime || train.departure || 'N/A';
    const arrivalTime = train.arrivalTime || train.arrival || 'N/A';

    // Calculate duration if not provided
    let duration = train.duration;
    if (!duration && departureTime !== 'N/A' && arrivalTime !== 'N/A') {
        duration = calculateDuration(departureTime, arrivalTime);
    } else if (!duration) {
        duration = 'N/A';
    }

    // Handle fare with currency formatting
    const fare = train.fare ? `₹${train.fare}` : 'Contact for price';

    // Handle train type
    const trainType = train.type || train.train?.type || 'Express';

    return `
        <div class="train-card enhanced">
            <div class="train-header">
                <div class="train-info">
                    <div class="train-name">${trainName}</div>
                    <div class="train-number">#${trainNumber}</div>
                </div>
                <div class="train-type-badge ${trainType.toLowerCase()}">
                    ${trainType.toUpperCase()}
                </div>
            </div>

            <div class="journey-details">
                <div class="time-section">
                    <div class="departure">
                     <div class="station">${train.sourceStation || train.fromStation || 'Departure:'}</div>
                        <div class="time">${departureTime}</div>
                       
                    </div>
                    <div class="journey-line">
                        <div class="duration">${duration}</div>
                        <div class="travel-line">
                            <div class="line"></div>
                            <i class="fas fa-train"></i>
                        </div>
                    </div>
                    <div class="arrival">
                     <div class="station">${train.destinationStation || train.toStation || 'Arrival:'}</div>
                        <div class="time">${arrivalTime}</div>
                       
                    </div>
                </div>
            </div>

            <div class="train-footer">
                <div class="fare-section">
                    <div class="fare">${fare}</div>
                    <div class="availability">${train.availability || train.seats || 'Available'}</div>
                </div>
                <button class="book-btn" onclick="bookTrain('${trainNumber}', '${trainName}')">
                    <i class="fas fa-ticket-alt"></i> Book Now
                </button>
            </div>
        </div>
    `;
}

// Utility function to calculate duration between two times
function calculateDuration(departureTime, arrivalTime) {
    try {
        const depMinutes = convertTimeToMinutes(departureTime);
        const arrMinutes = convertTimeToMinutes(arrivalTime);

        let durationMinutes = arrMinutes - depMinutes;

        // Handle next day arrival
        if (durationMinutes < 0) {
            durationMinutes += 24 * 60;
        }

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    } catch (error) {
        console.error('Error calculating duration:', error);
        return 'N/A';
    }
}

// Utility function to convert time string to minutes
function convertTimeToMinutes(timeStr) {
    if (!timeStr || timeStr === 'N/A') return 0;

    try {
        // Handle different time formats
        let cleanTime = timeStr.toString().trim();

        // Handle 24-hour format (HH:MM)
        if (cleanTime.match(/^\d{1,2}:\d{2}$/)) {
            const [hours, minutes] = cleanTime.split(':').map(Number);
            return hours * 60 + minutes;
        }

        // Handle 12-hour format (HH:MM AM/PM)
        if (cleanTime.match(/^\d{1,2}:\d{2}\s*(AM|PM)$/i)) {
            const [time, period] = cleanTime.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let totalMinutes = hours * 60 + minutes;

            if (period.toUpperCase() === 'PM' && hours !== 12) {
                totalMinutes += 12 * 60;
            } else if (period.toUpperCase() === 'AM' && hours === 12) {
                totalMinutes -= 12 * 60;
            }

            return totalMinutes;
        }

        // If format is unrecognized, return 0
        return 0;
    } catch (error) {
        console.error('Error parsing time:', timeStr, error);
        return 0;
    }
}

// Enhanced book train function
function bookTrain(trainNumber, trainName) {
    const fromStation = document.getElementById('from-station').value;
    const toStation = document.getElementById('to-station').value;
    const travelDate = document.getElementById('travel-date').value;

    showMessage(
        `Booking initiated for ${trainName} (${trainNumber}) from ${fromStation} to ${toStation} on ${travelDate}`,
        'success'
    );

    // Here you could redirect to a booking page or open a modal
    console.log('Booking details:', {
        trainNumber,
        trainName,
        fromStation,
        toStation,
        travelDate
    });
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
