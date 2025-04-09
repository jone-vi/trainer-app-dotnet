using trainer.Models;

namespace trainer.ViewModels;

public class NotificationViewModel
{
    public List<ApplicationUser> Requests { get; set; }
    public List<SharedWorkout> SharedWorkouts { get; set; }
    public List<SharedRoutine> SharedRoutines { get; set; }
    

}
