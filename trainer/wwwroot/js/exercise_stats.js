var token = $('input[name="__RequestVerificationToken"]').val();

$(document).ready(function () {
    if ($('#myChart').length > 0) {
        var dataPoints1 = {};
        var label1 = "";
        var dataPoints2 = {};
        var label2 = "";
    
        // ctx and config are global variables for the chart
        var ctx = document.getElementById('myChart').getContext('2d');
        var config = {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: label1,
                        data: dataPoints1,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: true,
                        showLine: true,
                        borderWidth: 1
                    },
                    {
                        label: label2,
                        data: dataPoints2,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: true,
                        showLine: true,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true, // Makes the chart responsive
                maintainAspectRatio: true, // Makes the chart maintain aspect ratio
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        ticks: {
                            autoSkip: true, // This helps prevent overlapping of labels
                            maxTicksLimit: 20 // Limit the number of ticks on the x-axis
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    
        // When the page loads, create the chart
        var myChart = new Chart(ctx, config);
    }
    

    // When the muscle group filter is changed remove the exercises that don't belong to the selected muscle group
    $('#muscleGroupFilterStats').change(function() {
        var selectedMuscleGroup = $(this).val();

        $('.exerciseFilterStats option').each(function() {
            if (selectedMuscleGroup === 'Show From All Muscle Groups' || $(this).data('muscle-group') === selectedMuscleGroup) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        // Reset the exercise filter dropdown to 'None' when the muscle group changes
        $('.exerciseFilterStats').val('None');
        // The chart is cleared whenever the muscle group filter is changed
        dataPoints1 = {};
        label1 = "";
        dataPoints2 = {};
        label2 = "";
        updateGraph();
    });
    
    // When the exercise filter is changed
    $('.exerciseFilterStats').change(function () {
        var exerciseId = $(this).val();
        // Get the exercise name from the selected option
        var exerciseName = $(this).find(':selected').text();
        
        // Find out if it is the first or second dropdown menu that is being changed
        var firstFilter;
        if ($(this).data('nr') === 1) {
            firstFilter = true;
        }
        else {
            firstFilter = false;
        }

        // Update the label to the exercise name
        if (firstFilter) {
            label1 = exerciseName;
        }
        else {
            label2 = exerciseName;
        }
        
        // If the exercise filter is set to 'None', then clear the chart
        if (exerciseId === 'None') {
            if (firstFilter) {
                dataPoints1 = {};
            }
            else {
                dataPoints2 = {};
            }
            updateGraph();
            return;
        }
        
        // make int out of exerciseId
        exerciseId = parseInt(exerciseId);
        getStats(exerciseId, firstFilter);
    });
    
    function getStats(exerciseId, firstFilter) {
        $.ajax({
            url: '/ExerciseStats/GetExerciseStats',
            type: 'POST',
            data: { exerciseId: exerciseId },
            headers: { 'RequestVerificationToken': token },
            success: function (response) {
                if (response.success) {
                    var loggedExercises = response.data;

                    // Makes the dates and one rep maxes into arrays
                    if (firstFilter) {
                        dataPoints1 = loggedExercises.map(exercise => ({
                            x: new Date(exercise.date),
                            y: exercise.oneRepMax
                        }));
                    }
                    else {
                        dataPoints2 = loggedExercises.map(exercise => ({
                            x: new Date(exercise.date),
                            y: exercise.oneRepMax
                        }));
                    }
                    
                    // Create the chart
                    updateGraph();
                }
                else {
                    // Display error message
                    alert(response.message);
                }
                
            }
        });
    }

    function updateGraph() {
        // Check if chart already exists, then destroy it if it does
        myChart.clear();

        // Update the chart with the new data
        myChart.data.datasets[0].data = dataPoints1;
        myChart.data.datasets[1].data = dataPoints2;
        myChart.data.datasets[0].label = label1;
        myChart.data.datasets[1].label = label2;
        myChart.update();
    }

    // Needed to make the scatter chart is the data in the correct format
    function prepareDataPoints(dates, values) {
        return dates.map((date, index) => {
            return { x: date, y: values[index] };
        });
    }

});