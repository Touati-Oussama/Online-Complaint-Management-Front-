import { UserService } from './../services/users.service';
import { AuthService } from './../services/auth.service';
import { CompalintService } from 'src/app/services/compalint.service';
import { Component, OnInit } from '@angular/core';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
} from 'chart.js';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-customer-admin',
  templateUrl: './dashboard-customer-admin.component.html',
  styleUrls: ['./dashboard-customer-admin.component.css']
})
export class DashboardCustomerAdminComponent implements OnInit {

  chartPie: Chart;
  labesPie = ["Total","Cloturé","En Cours","Nouvelles"];
  dataPie = [];
  public data;
  
  Filterdata = new FormGroup(
    {
      date1: new FormControl('',Validators.required),
      date2: new FormControl('',Validators.required),
    }
  )
  constructor(private complaintService:CompalintService,private datepipe:DatePipe,private authService:AuthService,private userService:UserService) { 
    Chart.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      SubTitle
    );
  }

  ngOnInit(): void {
    this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe(res=>{
      this.complaintService.detailsParEtatAndSociete(res.societe).subscribe(res=>{
        this.data = res;
      })
    })
    this.initChart();

  }


  initChart(){
    this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe(res=>{
      this.complaintService.detailsParEtatAndSociete(res.societe).subscribe(res=>{
        this.data = res;
        this.dataPie= [res.total,res.cloture,res.encours,res.nouv];
        this.chartPie = new Chart("chartjs-pie", {
          type: "bar",
          data: {
            labels: this.labesPie,
            datasets: [{
              label: "statistiques",
              data: this.dataPie,
              backgroundColor: [
                "blue",
                "green",
                "yellow",
                "red"
              ],
              borderColor: "transparent"
            }]
          },
          options: {
          }
        });
      })
      })
  }

  rechercher(){
    this.dataPie = [];
    this.chartPie.destroy();
    let date1 = this.datepipe.transform(this.Filterdata.value['date1'],'yyyy-MM-dd HH:mm');
    let date2 = this.datepipe.transform(this.Filterdata.value['date2'],'yyyy-MM-dd HH:mm');
    console.log(date1);
    console.log(date2);
    this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe(res=>{
      this.complaintService.detailsParEtatAndSocieteAndDates(res.societe,date1,date2).subscribe(res=>{
        this.data = res;
        this.dataPie= [res.total,res.cloture,res.encours,res.nouv];
        this.chartPie = new Chart("chartjs-pie", {
          type: "bar",
          data: {
            labels: this.labesPie,
            datasets: [{
              label: "statistiques",
              data: this.dataPie,
              backgroundColor: [
                "blue",
                "green",
                "yellow",
                "red"
              ],
              borderColor: "transparent"
            }]
          },
          options: {
          }
        });
        })
    })
  }
  cancel(){
    this.Filterdata.reset();
    this.initChart();
  }
  
}
