function showNotifications() {
    console.log("showNotifications called");
    $.ajax({
        url: '/Notifications/GetNotifications',
        type: 'GET',
        cache: false, // Add this line to prevent caching
        success: function(data) {
            console.log("Data received:", data);
            $('#notificationsContainer').html(data);
            $('#notificationsContainer').toggle();

            // After showing notifications, mark them as seen
            markNotificationsAsSeen();
        }
    });
}

// Function to mark notifications as seen
function markNotificationsAsSeen() {
    $.ajax({
        url: '/Notifications/MarkNotificationsAsSeen',
        type: 'POST',
        success: function() {
            console.log('Notifications marked as seen.');
        },
        error: function() {
            console.error('Failed to mark notifications as seen.');
        }
    });
}



// Function to check for notifications and update the green dot
function checkForNotifications() {
    $.ajax({
        // This should point to an endpoint that only returns unread notifications
        url: '/Notifications/GetNotifications',
        type: 'GET',
        success: function(data) {
            // Check if the response contains any unread notifications
            var hasUnreadNotifications = !$(data).find('.notification-item.empty').length;
            updateNotificationDot(hasUnreadNotifications);
        }
    });
}


// Function to update the notification dot based on notification presence
function updateNotificationDot(hasNotifications) {
    // Get both vertical and horizontal notification elements
    var navNotificationsVertical = document.getElementById('navNotificationsVertical');
    var navNotificationsHorizontal = document.getElementById('navNotificationsHorizontal');

    // Decide which element to update based on the window width
    var navNotificationsToUpdate = window.innerWidth <= 767 ? navNotificationsHorizontal : navNotificationsVertical;

    // Update the class on the appropriate element
    if (hasNotifications && navNotificationsToUpdate) {
        navNotificationsToUpdate.classList.add('has-notifications');
    } else if (navNotificationsToUpdate) {
        navNotificationsToUpdate.classList.remove('has-notifications');
    }
}


// Add event listeners to the notification area container
function setupNotificationInteraction() {
    var notificationsList = document.getElementById('notificationsContainer');
    if (notificationsList) {
        notificationsList.addEventListener('mouseenter', function() {
            // Remove the notification dot when hovering over the notification area
            var navNotificationsToUpdate = document.querySelector('.has-notifications');
            if (navNotificationsToUpdate) {
                navNotificationsToUpdate.classList.remove('has-notifications');
                // Call the server-side endpoint to mark notifications as seen
                markNotificationsAsSeen();
            }
        }, true);
    }
}


// Function to toggle notification container visibility
function toggleNotifications() {
    var notificationsContainer = document.getElementById('notificationsContainer');
    if (notificationsContainer) {
        if (notificationsContainer.style.display === 'none' || notificationsContainer.style.display === '') {
            notificationsContainer.style.display = 'block';
        } else {
            notificationsContainer.style.display = 'none';
        }
    }
}

// Run the check when the script loads
checkForNotifications();
setupNotificationInteraction();

// Function to toggle notification container visibility
function toggleNotifications() {
    var notificationsContainer = document.getElementById('notificationsContainer');
    if (notificationsContainer) {
        // Toggle the display state
        notificationsContainer.style.display = (notificationsContainer.style.display === 'none' || notificationsContainer.style.display === '') ? 'block' : 'none';
    }
}

// Event listener for the bell icon
document.addEventListener('DOMContentLoaded', function () {
    var bellIcon = document.getElementById('bellIcon');
    var notificationsContainer = document.getElementById('notificationsContainer');

    if (bellIcon) {
        bellIcon.addEventListener('click', function (event) {
            event.stopPropagation(); // Stop the event from bubbling up
            toggleNotifications();
        });
    }

    // Event listener for clicking anywhere on the window
    window.addEventListener('click', function () {
        if (notificationsContainer && notificationsContainer.style.display !== 'none') {
            notificationsContainer.style.display = 'none';
        }
    });
});
