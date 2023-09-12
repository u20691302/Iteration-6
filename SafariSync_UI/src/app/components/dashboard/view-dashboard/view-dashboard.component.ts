import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/models/stock/stock.model';
import { Ratings } from 'src/app/models/user/ratings.model';
import { RatingSettings } from 'src/app/models/user/ratingsettings.model';
import { User } from 'src/app/models/user/user.model';
import { StockService } from 'src/app/services/stock/stock.service';
import { User1Service } from 'src/app/services/user/User1.service';
import { UserService } from 'src/app/services/user/user.service';
import { Chart } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; // Import ng2-charts
import { ScheduledActivityService } from 'src/app/services/scheduleActivity/schedule-activity.service';
import { ScheduledActivity } from 'src/app/models/scheduledActivity/scheduledActivity.model';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Notification } from 'src/app/models/Notification/Notification.model';


@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.scss']
})
export class ViewDashboardComponent implements OnInit {

  public chart: any;
  barChart: any;

  ngOnInit(): void {
    this.fetchRatingSettings();
    this.GetAllStock();
    this.GetAllUsers();
    this.GetAllScheduledActivities();
    this.readAllNotifications();

    
  }

  totalActivities: number = 0;
  inProgressActivities:number = 0;

  pendingScheduling:number = 0;
  completedActivities:number = 0;
  notifications: Notification[] = [];

  scheduledActivities: ScheduledActivity [] = [];

  constructor(private stockService: StockService, private userService: User1Service, private userTyService: UserService, private scheduledActivityService: ScheduledActivityService, private notificationService: NotificationService) { }

  readAllNotifications(): void {
    this.notificationService.readAllNotifications().subscribe(
      (notifications) => {
        // Assign the fetched notifications to the component's notifications array
        this.notifications = notifications;
        console.log(notifications); // This log should display the data correctly
      },
      (error) => {
        // Handle errors if any
        console.error('Error fetching notifications:', error);
      }
    );
  }
  
  

  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'pie', // This denotes the type of chart
      data: {
        labels: ['Total Activities', 'Activities In Progress'],
        datasets: [
          {
            data: [this.totalActivities, this.inProgressActivities],
            backgroundColor: ['#CD1543', '#001844', 'green', 'yellow', 'orange', 'blue'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });

    // Create the bar graph with labels under each bar
    this.barChart = new Chart('BarChart', {
      type: 'bar',
      data: {
        labels: ['Total Activities', 'Activities In Progress','Activities Not Started'], // These are the labels under each bar
        datasets: [
          {
            data: [this.totalActivities, this.inProgressActivities, this.pendingScheduling],
            backgroundColor: ['#CD1543', '#001844', '#869EC3'],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }


  stocks: Stock[] = [];
  lowStock: { name: string; quantity: number }[] = []; // Initialize the lowStock array
  users: User[] = [];
  maxValue: number = 8; // Customize this based on your data
  ratingSettings: RatingSettings[] = [];
  actualUpper: number = 0;
  actualLower: number = 0;

  updatedRatingSetting: RatingSettings = {
    ratingSettings_ID: 1,
    ratingSettings_Upper: 4,
    ratingSettings_Lower: 2
  };


  GetAllScheduledActivities(): void {
    this.scheduledActivityService.getAllScheduledActivities("").subscribe({
      next: (scheduledActivities) => {
        this.scheduledActivities = scheduledActivities;
  
        // Count the number of completed activities
        const completeddActivities = this.scheduledActivities.filter(
          (activity) => activity.activityStatus?.activity_Status === 'Completed'
        );
         this.completedActivities = completeddActivities.length;
         console.log(`Number of in completed activities: ${this.completedActivities}`);

         // Count the number of inprogress activities
        const inprog = this.scheduledActivities.filter(
          (activity) => activity.activityStatus?.activity_Status === 'In Progress'
        );
         this.inProgressActivities = inprog.length;
        console.log(`Number of in progress activities: ${this.inProgressActivities}`);

        // Count the total number of all activities
         this.totalActivities = scheduledActivities.length;
        console.log(`Number of all activities: ${this.totalActivities}`);

        // Count the notstarted activities
        const notstartact = this.scheduledActivities.filter(
          (activity) => activity.activityStatus?.activity_Status === 'Not Started'
        );
         this.pendingScheduling = notstartact.length;
        console.log(`Number of not started activities: ${this.pendingScheduling}`);
        this.createChart();


      },
      error: (response) => {
        console.log(response);
      }
    });
  }
  

  fetchRatingSettings(): void {
    this.userTyService.readAllRatingSettings().subscribe(
      (data: RatingSettings[]) => {
        this.ratingSettings = data;
        this.updatedRatingSetting = {
          ratingSettings_ID: this.ratingSettings[0].ratingSettings_ID,
          ratingSettings_Upper: this.ratingSettings[0].ratingSettings_Upper,
          ratingSettings_Lower: this.ratingSettings[0].ratingSettings_Lower
        };
        console.log(this.ratingSettings);
        this.actualUpper = this.updatedRatingSetting.ratingSettings_Upper;
        this.actualLower = this.updatedRatingSetting.ratingSettings_Lower;
        console.log("the actual upper is", this.actualUpper);
        console.log("the actual lower is", this.actualLower);
      },
      (error: any) => {
        console.error('Error fetching rating settings:', error);
      }
    );
  }

  GetAllUsers(): void {
    this.userService.getAllUsers("").subscribe({
      next: (users) => {
        // Filter users by roles "User" or "Farm Worker"
        this.users = users.filter(user => {
          return (
            (user.role === "Supervisor" || user.role === "Farm Worker") &&
            user.ratings?.rating !== undefined && // Check if user.ratings.rating is defined
            user.ratings.rating >= this.actualUpper
          );
        });
                console.log(this.users);
      },
      error: (response) => {
        console.log(response);
      }
    });
  }
  

  GetAllStock(): void {
    this.stockService.getAllStocks("").subscribe({
      next: (stock) => {
        this.stocks = stock;
        console.log(this.stocks);
        
        // Clear the lowStock array before populating it
        this.lowStock = [];

        // Loop through stocks and check for low stock items
        this.stocks.forEach((item) => {
          if (item.stock_Quantity_On_Hand < item.stock_Low_Level_Warning) {
            this.lowStock.push({ name: item.stock_Name, quantity: item.stock_Quantity_On_Hand });
          }
        });

        console.log(this.lowStock); // Display low stock items
      },
      error: (response) => {
        console.log(response);
      }
    });
  }


}
