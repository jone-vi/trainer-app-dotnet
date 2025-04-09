using System.Dynamic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using trainer.Data;
using trainer.Models;
using System;


namespace trainer.Controllers;

[Authorize(Policy = "NotBanned")]
public class ExerciseStatsController : Controller
{
    private ApplicationDbContext _db;
    private UserManager<ApplicationUser> _um;
    private RoleManager<IdentityRole> _rm;

    /*Injects the dependencies*/
    public ExerciseStatsController(ApplicationDbContext db, UserManager<ApplicationUser> um,
        RoleManager<IdentityRole> rm)
    {
        _db = db;
        _um = um;
        _rm = rm;
    }

    // GET
    public async Task<IActionResult> Index()
    {
        // Gets the current user
        var currentUser = await _um.GetUserAsync(User);
        if (currentUser == null)
        {
            return RedirectToAction("LandingPage", "Landing"); // Or handle as needed
        }

        // Gets the logged workouts that contains the current user's id
        var userLoggedWorkouts = await _db.LoggedWorkouts
            .Where(lw => lw.UserId == currentUser.Id)
            .ToListAsync();

        var loggedWorkoutHasExercises = new List<LoggedWorkoutHasExercise>();
        
        // Extract all LoggedWorkoutHasExercises that are associated with the user's logged workouts
        foreach (var loggedWorkout in userLoggedWorkouts)
        {
            var lwhes = await _db.LoggedWorkoutHasExercises
                .Where(lwhe => lwhe.LoggedWorkoutId == loggedWorkout.Id)
                .ToListAsync();
            
            loggedWorkoutHasExercises.AddRange(lwhes);
        }
        
        // Extract unique exercise IDs
        var loggedExerciseIds = loggedWorkoutHasExercises
            .Select(lwhe => lwhe.ExerciseId)
            .Distinct()
            .ToList();

        // Get exercises that are not in the 'Cardio' muscle group and have been logged by the user
        var exercises = await _db.Exercises
            .Where(e => loggedExerciseIds.Contains(e.Id) && e.MuscleGroup != "Cardio")
            .ToListAsync();
        
        return View(exercises);
    }
    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> GetExerciseStats(int exerciseId)
    {
        // Gets the exercise that matches the exercise id
        var exercise = await _db.Exercises.FindAsync(exerciseId);
        
        // Checks if the exercise is null
        if (exercise == null)
        {
            return Json(new { success = false, message = "Exercise not found" });
        }
        
        // Write to console the exercise name for debugging
        Console.WriteLine(exercise.Name);
        
        // Gets the current user
        var currentUser = await _um.GetUserAsync(User);
        if (currentUser == null)
        {
            return Json(new { success = false, message = "User not found" });
        }
        
        // Creates list to store the relevant information to graph the exercises
        var loggedExerciseViewModels = new List<LoggedExerciseViewModel>();
        
        // Gets the logged exercises that contains the specified exercises:
        var loggedChosenExercise = await _db.LoggedWorkoutHasExercises.Where(lwhe => lwhe.ExerciseId == exercise.Id).ToListAsync();
        
        // Collect all LoggedWorkoutIds
        var loggedWorkoutIds = loggedChosenExercise.Select(log => log.LoggedWorkoutId).Distinct().ToList();

        // Fetch all LoggedWorkouts in a single query
        var loggedWorkouts = await _db.LoggedWorkouts
            .Where(lw => loggedWorkoutIds.Contains(lw.Id))
            .ToListAsync();

        // Create a dictionary for quick lookup
        var loggedWorkoutsDictionary = loggedWorkouts.ToDictionary(lw => lw.Id);
        
        foreach (var log in loggedChosenExercise)
        {
            // Use the dictionary to find the logged workout. If this is not found, continue to the next iteration
            if (!loggedWorkoutsDictionary.TryGetValue(log.LoggedWorkoutId, out var loggedW))
            {
                continue;
            }
            
            // Checks if the logged workout is the current user's
            if (loggedW.UserId != currentUser.Id)
            {
                return Json(new { success = false, message = "A logged workout which is not yours were tried accessing" });
            }
        
            // Calculates 1RM with Epley Formula
            var weight = log.Weight ?? 0;
            var reps = log.Reps ?? 1;
            var oneRepMax = (int) Math.Round(weight * (1 + reps / 30.0));
        
            var loggedExerciseViewModel = new LoggedExerciseViewModel();
            {
                loggedExerciseViewModel.OneRepMax = oneRepMax;
                loggedExerciseViewModel.Date = loggedW.Date;
            };
            loggedExerciseViewModels.Add(loggedExerciseViewModel);
            
        }
        
        // Sorting by Date in ascending order
        loggedExerciseViewModels = loggedExerciseViewModels.OrderBy(levm => levm.Date).ToList();
        
        return Json(new { success = true, data = loggedExerciseViewModels });
    }
}