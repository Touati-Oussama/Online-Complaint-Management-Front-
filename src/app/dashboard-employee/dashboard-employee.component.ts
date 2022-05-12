import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { CompalintService } from 'src/app/services/compalint.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.css']
})
export class DashboardEmployeeComponent implements OnInit {


  data = new FormGroup(
    {
      date1: new FormControl('',Validators.required),
      date2: new FormControl('',Validators.required),
    }
  )

  chartPie: Chart;
  labesPie = ["Total","Cloturé","En Cours"];
  dataPie = [];
  public details;
  constructor(private complaintService:CompalintService,private authService:AuthService,private datepipe:DatePipe) { 
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

  test(date){
    let s = this.datepipe.transform(date,'yyyy-MM-dd HH:mm');
    console.log(s);
  }
  ngOnInit(): void {
    this.complaintService.details(this.authService.loggedUser).subscribe(res =>{
      this.details = res;
    })
    this.initChart();
  }

  initChart(){
    this.complaintService.details(this.authService.loggedUser).subscribe(res=>{
      this.dataPie= [res.total,res.cloture,res.encours];
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
              "yellow"
            ],
            borderColor: "transparent"
          }]
        },
        options: {
        }
      });
    })
  }

  rechercher(){
    this.dataPie = [];
    this.chartPie.destroy();
    let date1 = this.datepipe.transform(this.data.value['date1'],'yyyy-MM-dd HH:mm');
    let date2 = this.datepipe.transform(this.data.value['date2'],'yyyy-MM-dd HH:mm');
    this.complaintService.detailsByDates(this.authService.loggedUser,date1,date2).subscribe(res=>{
      this.details = res;
      this.dataPie= [res.total,res.cloture,res.encours];
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
              "yellow"
            ],
            borderColor: "transparent"
          }]
        },
        options: {
        }
      });
    })
  }

  cancel(){
    this.data.reset();
    this.initChart();
  }
  
}
