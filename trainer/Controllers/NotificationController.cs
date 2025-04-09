using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using trainer.Data;
using trainer.Models;
using trainer.ViewModels;

namespace trainer.Controllers;
[Authorize (Policy = "NotBanned")]
public class NotificationsController : Controller
{

    private ApplicationDbContext _db;
    private UserManager<ApplicationUser> _um;
    public NotificationsController(ApplicationDbContext db, UserManager<ApplicationUser> um)
    {
        _db = db;
        _um = um;
    }
    
    public IActionResult Index()
    {
        return View();
    }
    
    public async Task<IActionResult> GetNotifications()
    {
        var user = await _um.GetUserAsync(User);
    
        // Get friend requests
        var requests = _db.Friends
            .Where(f => f.HasFriendId == user.Id && !f.Accepted)
            .Select(f => _db.Users.FirstOrDefault(a => a.Id == f.UserId))
            .ToList();
    
        // Get shared workouts
        var sharedWorkouts = await _db.SharedWorkouts
            .Where(sw => sw.ReceivingUserId == user.Id)
            .Include(sw => sw.PendingWorkout)
            .ThenInclude(w => w.WorkoutHasExercises)
            .ThenInclude(whe => whe.Exercise)
            .Include(sw => sw.PendingWorkout)
            .ThenInclude(w => w.ApplicationUser)
            .ToListAsync();
    
        // Get shared routines
        var sharedRoutines = await _db.SharedRoutines
            .Where(sr => sr.ReceivingUserId == user.Id)
            .Include(sr => sr.PendingRoutine)
            .ThenInclude(r => r.ApplicationUser)
            .ToListAsync();

        var vm = new NotificationViewModel()
        {
            Requests = requests,
            SharedWorkouts = sharedWorkouts,
            SharedRoutines = sharedRoutines
        };
    
        return PartialView("_Notifications", vm); // Return a partial view
    }
    
    public async Task<IActionResult> MarkNotificationsAsSeen()
    {
        var user = await _um.GetUserAsync(User);

        // test
        var unreadFriendRequests = _db.Friends
            .Where(f => f.HasFriendId == user.Id && !f.IsRead)
            .ToList();

        foreach(var request in unreadFriendRequests)
        {
            
            request.IsRead = false;
        }

        _db.SaveChanges();

        return Ok();
    }
    
}