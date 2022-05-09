import { Etat } from './../model/Etat';
import { filter } from 'rxjs';
import { CompalintService } from 'src/app/services/compalint.service';

import { Router, ActivatedRoute } from '@angular/router';
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  data;
  chartPie: Chart;
  chartBar: Chart;
  labesPie = [];
  dataPie = [];
  labelBar = [];
  dataBar = [];
  dataBarNouveaux = [];
  dataBarEnCours = [];
  dataBarCloture = [];
  dataFilter = new FormGroup(
    {
      date1: new FormControl('',Validators.required),
      date2: new FormControl('',Validators.required),
    }
  )
  filter = 'Projet';
  constructor( private complaintService:CompalintService,private datepipe:DatePipe) {
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
    this.complaintService.detailsParEtat().subscribe(res=>{
      this.data = res;
    })
   this.loadChart(this.filter);
   this.loadBar(this.filter);

  }


  onChange(event){
    this.filter = event;
    this.loadChart(this.filter);
    this.loadBar(this.filter);
  }

  loadBar(filter){
    this.labelBar = [];
    this.dataBar = [];
    this.dataBarNouveaux = [];
    this.dataBarEnCours = [];
    this.dataBarCloture = [];
    try {
      this.chartBar.destroy();
    } catch (error) {
      
    }
      
    if (filter == 'Projet'){
      this.complaintService.detailsParProjet().subscribe((res:any[])=>{
        res.forEach(r=>{
          this.labelBar.push(r.projet);
          this.dataBar.push(r.nbReclamation);
        })
      })
      this.complaintService.detailsParProjetAndStatus(Etat.EN_ATTENTE).subscribe((res:any[])=>{
        res.forEach(r=>{
          this.dataBarNouveaux.push(r.nbReclamation)
        })
        this.complaintService.detailsParProjetAndStatus(Etat.EN_COURS).subscribe((res:any[])=>{
          res.forEach(r=>{
            this.dataBarEnCours.push(r.nbReclamation);
          })
          this.complaintService.detailsParProjetAndStatus(Etat.ClOTURE).subscribe((res:any[])=>{
            res.forEach(r=>{
              this.dataBarCloture.push(r.nbReclamation);
            })
            this.chartBar =	new Chart("chartjs-bar", {
              type: "bar",
              data: {
                labels: this.labelBar,
                datasets: [
                  {
                  label: "Total",
                  backgroundColor: "blue",
                  borderColor: "blue",
                  hoverBackgroundColor: "blue",
                  hoverBorderColor: "blue",
                  data: this.dataBar,
                  barPercentage: .75,
                  categoryPercentage: .5,
                },
                {
                  label: "Nouvelles",
                  backgroundColor: "red",
                  borderColor: "red",
                  hoverBackgroundColor: "red",
                  hoverBorderColor: "red",
                  data: this.dataBarNouveaux,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                {
                  label: "En Cours",
                  backgroundColor: "yellow",
                  borderColor: "yellow",
                  hoverBackgroundColor: "yellow",
                  hoverBorderColor: "yellow",
                  data: this.dataBarEnCours,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                
                 {
                  label: "Cloturé",
                  backgroundColor: "green",
                  borderColor: "#dee2e6",
                  hoverBackgroundColor: "#dee2e6",
                  hoverBorderColor: "#dee2e6",
                  data: this.dataBarCloture,
                  barPercentage: .75,
                  categoryPercentage: .5
                }
              ]
              },
              options: {
                scales: {          
                  y: {
         
                    stacked: false,
                    ticks: {
                      stepSize: 20
                    }
                  },
                  x: {
                    stacked: false,
                  }
                }
              }
            });
          })
        })
  
      })
    }

    if (filter == 'Type'){
    this.complaintService.detailsParType().subscribe((res:any[])=>{
      res.forEach(r=>{
        this.labelBar.push(r.type);
        this.dataBar.push(r.nbReclamation);
      })
      this.complaintService.detailsParTypeAndStatus(Etat.EN_ATTENTE).subscribe((res:any[])=>{
        res.forEach(attente=>{
          this.dataBarNouveaux.push(attente.nbReclamation)
        })
        this.complaintService.detailsParTypeAndStatus(Etat.EN_COURS).subscribe((res:any[])=>{
          res.forEach(encours=>{
            this.dataBarEnCours.push(encours.nbReclamation);
          })
          this.complaintService.detailsParTypeAndStatus(Etat.ClOTURE).subscribe((res:any[])=>{
            res.forEach(cloture=>{
              this.dataBarCloture.push(cloture.nbReclamation);
            })
            this.chartBar =	new Chart("chartjs-bar", {
              type: "bar",
              data: {
                labels: this.labelBar,
                datasets: [
                  {
                  label: "Total",
                  backgroundColor: "blue",
                  borderColor: "blue",
                  hoverBackgroundColor: "blue",
                  hoverBorderColor: "blue",
                  data: this.dataBar,
                  barPercentage: .75,
                  categoryPercentage: .5,
                },
                {
                  label: "Nouvelles",
                  backgroundColor: "red",
                  borderColor: "red",
                  hoverBackgroundColor: "red",
                  hoverBorderColor: "red",
                  data: this.dataBarNouveaux,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                {
                  label: "En Cours",
                  backgroundColor: "yellow",
                  borderColor: "yellow",
                  hoverBackgroundColor: "yellow",
                  hoverBorderColor: "yellow",
                  data: this.dataBarEnCours,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                
                 {
                  label: "Cloturé",
                  backgroundColor: "green",
                  borderColor: "#dee2e6",
                  hoverBackgroundColor: "#dee2e6",
                  hoverBorderColor: "#dee2e6",
                  data: this.dataBarCloture,
                  barPercentage: .75,
                  categoryPercentage: .5
                }
              ]
              },
              options: {
                scales: {          
                  y: {
         
                    stacked: false,
                    ticks: {
                      stepSize: 20
                    }
                  },
                  x: {
                    stacked: false,
                  }
                }
              }
            });
          })
        })
  
      })
      })
    }


    if (filter == 'Developpeur'){
      this.complaintService.detailsParPersonnel().subscribe((res:any[])=>{
        res.forEach(r=>{
          this.labelBar.push(r.username);
          this.dataBar.push(r.nbReclamation);
        })
      })
      this.complaintService.detailsParPersonnelAndStatus(Etat.EN_ATTENTE).subscribe((res:any[])=>{
        res.forEach(r=>{
          this.dataBarNouveaux.push(r.nbReclamation)
        })
        this.complaintService.detailsParPersonnelAndStatus(Etat.EN_COURS).subscribe((res:any[])=>{
          res.forEach(r=>{
            this.dataBarEnCours.push(r.nbReclamation);
          })
          this.complaintService.detailsParPersonnelAndStatus(Etat.ClOTURE).subscribe((res:any[])=>{
            res.forEach(r=>{
              this.dataBarCloture.push(r.nbReclamation);
            })
            this.chartBar =	new Chart("chartjs-bar", {
              type: "bar",
              data: {
                labels: this.labelBar,
                datasets: [
                  {
                  label: "Total",
                  backgroundColor: "blue",
                  borderColor: "blue",
                  hoverBackgroundColor: "blue",
                  hoverBorderColor: "blue",
                  data: this.dataBar,
                  barPercentage: .75,
                  categoryPercentage: .5,
                },
                {
                  label: "Nouvelles",
                  backgroundColor: "red",
                  borderColor: "red",
                  hoverBackgroundColor: "red",
                  hoverBorderColor: "red",
                  data: this.dataBarNouveaux,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                {
                  label: "En Cours",
                  backgroundColor: "yellow",
                  borderColor: "yellow",
                  hoverBackgroundColor: "yellow",
                  hoverBorderColor: "yellow",
                  data: this.dataBarEnCours,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                
                 {
                  label: "Cloturé",
                  backgroundColor: "green",
                  borderColor: "#dee2e6",
                  hoverBackgroundColor: "#dee2e6",
                  hoverBorderColor: "#dee2e6",
                  data: this.dataBarCloture,
                  barPercentage: .75,
                  categoryPercentage: .5
                }
              ]
              },
              options: {
                scales: {          
                  y: {
         
                    stacked: false,
                    ticks: {
                      stepSize: 20
                    }
                  },
                  x: {
                    stacked: false,
                  }
                }
              }
            });
          })
        })
  
      })
    }
  }
  loadChart(filter){
    try {
      this.chartPie.destroy();
    } catch (error) {
      
    }
    this.labesPie = [];
    this.dataPie = [];
    if (filter == 'Projet')
    this.complaintService.detailsParProjet().subscribe((res:any[]) =>{
      res.forEach(r => {
        this.labesPie.push(r.projet);
        this.dataPie.push(r.nbReclamation);
        
      });
      this.chartPie = new Chart("chartjs-pie", {
        type: "pie",
        data: {
          labels: this.labesPie,
          datasets: [{
            data: this.dataPie,
            backgroundColor: [
              "red",
              "yellow",
              "green",
              "blue",
              "pink",
            ],
            borderColor: "transparent"
          }]
        },
        options: {
        }
      });
    })
    if (filter == 'Type')
    this.complaintService.detailsParType().subscribe((res:any[]) =>{
      res.forEach(r => {
        this.labesPie.push(r.type);
        this.dataPie.push(r.nbReclamation);
        
      });      
      this.chartPie = new Chart("chartjs-pie", {
        type: "pie",
        data: {
          labels: this.labesPie,
          datasets: [{
            data: this.dataPie,
            backgroundColor: [
              "red",
              "yellow",
              "green",
              "blue",
              "pink",
            ],
            borderColor: "transparent"
          }]
        },
        options: {
        }
      });
    })
    if (filter == 'Developpeur')
    this.complaintService.detailsParPersonnel().subscribe((res:any[]) =>{
      res.forEach(r => {
        this.labesPie.push(r.username);
        this.dataPie.push(r.nbReclamation);
        
      });      
      
      this.chartPie = new Chart("chartjs-pie", {
        type: "pie",
        data: {
          labels: this.labesPie,
          datasets: [{
            data: this.dataPie,
            backgroundColor: [
              "blue",
              "red",
              "green",
              "yellow",
              "pink",
            ],
            borderColor: "transparent"
          }]
        },
        options: {
        }
      });
    })
  }
  


  loadBarFilter(filter,date1,date2){
    this.labelBar = [];
    this.dataBar = [];
    this.dataBarNouveaux = [];
    this.dataBarEnCours = [];
    this.dataBarCloture = [];
    this.chartBar.destroy();
      
    if (filter == 'Projet'){
      this.complaintService.detailsParProjetEtDate(date1,date2).subscribe((res:any[])=>{
        res.forEach(r=>{
          this.labelBar.push(r.projet);
          this.dataBar.push(r.nbReclamation);
        })
      })
      this.complaintService.detailsParProjetAndStatusAndDate(Etat.EN_ATTENTE,date1,date2).subscribe((res:any[])=>{
        console.log(res);
        res.forEach(r=>{
          this.dataBarNouveaux.push(r.nbReclamation)
        })
        this.complaintService.detailsParProjetAndStatusAndDate(Etat.EN_COURS,date1,date2).subscribe((res:any[])=>{
          res.forEach(r=>{
            this.dataBarEnCours.push(r.nbReclamation);
          })
          this.complaintService.detailsParProjetAndStatusAndDate(Etat.ClOTURE,date1,date2).subscribe((res:any[])=>{
            res.forEach(r=>{
              this.dataBarCloture.push(r.nbReclamation);
            })
            this.chartBar =	new Chart("chartjs-bar", {
              type: "bar",
              data: {
                labels: this.labelBar,
                datasets: [
                  {
                  label: "Total",
                  backgroundColor: "blue",
                  borderColor: "blue",
                  hoverBackgroundColor: "blue",
                  hoverBorderColor: "blue",
                  data: this.dataBar,
                  barPercentage: .75,
                  categoryPercentage: .5,
                },
                {
                  label: "Nouvelles",
                  backgroundColor: "red",
                  borderColor: "red",
                  hoverBackgroundColor: "red",
                  hoverBorderColor: "red",
                  data: this.dataBarNouveaux,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                {
                  label: "En Cours",
                  backgroundColor: "yellow",
                  borderColor: "yellow",
                  hoverBackgroundColor: "yellow",
                  hoverBorderColor: "yellow",
                  data: this.dataBarEnCours,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                
                 {
                  label: "Cloturé",
                  backgroundColor: "green",
                  borderColor: "#dee2e6",
                  hoverBackgroundColor: "#dee2e6",
                  hoverBorderColor: "#dee2e6",
                  data: this.dataBarCloture,
                  barPercentage: .75,
                  categoryPercentage: .5
                }
              ]
              },
              options: {
                scales: {          
                  y: {
         
                    stacked: false,
                    ticks: {
                      stepSize: 20
                    }
                  },
                  x: {
                    stacked: false,
                  }
                }
              }
            });
          })
        })
  
      })
    }

    if (filter == 'Type'){
    this.complaintService.detailsParTypeEtDate(date1,date2).subscribe((res:any[])=>{
      res.forEach(r=>{
        this.labelBar.push(r.type);
        this.dataBar.push(r.nbReclamation);
      })
      this.complaintService.detailsParTypeAndStatusAndDate(Etat.EN_ATTENTE,date1,date2).subscribe((res:any[])=>{
        res.forEach(attente=>{
          this.dataBarNouveaux.push(attente.nbReclamation)
        })
        this.complaintService.detailsParTypeAndStatusAndDate(Etat.EN_COURS,date1,date2).subscribe((res:any[])=>{
          res.forEach(encours=>{
            this.dataBarEnCours.push(encours.nbReclamation);
          })
          this.complaintService.detailsParTypeAndStatusAndDate(Etat.ClOTURE,date1,date2).subscribe((res:any[])=>{
            res.forEach(cloture=>{
              this.dataBarCloture.push(cloture.nbReclamation);
            })
            this.chartBar =	new Chart("chartjs-bar", {
              type: "bar",
              data: {
                labels: this.labelBar,
                datasets: [
                  {
                  label: "Total",
                  backgroundColor: "blue",
                  borderColor: "blue",
                  hoverBackgroundColor: "blue",
                  hoverBorderColor: "blue",
                  data: this.dataBar,
                  barPercentage: .75,
                  categoryPercentage: .5,
                },
                {
                  label: "Nouvelles",
                  backgroundColor: "red",
                  borderColor: "red",
                  hoverBackgroundColor: "red",
                  hoverBorderColor: "red",
                  data: this.dataBarNouveaux,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                {
                  label: "En Cours",
                  backgroundColor: "yellow",
                  borderColor: "yellow",
                  hoverBackgroundColor: "yellow",
                  hoverBorderColor: "yellow",
                  data: this.dataBarEnCours,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                
                 {
                  label: "Cloturé",
                  backgroundColor: "green",
                  borderColor: "#dee2e6",
                  hoverBackgroundColor: "#dee2e6",
                  hoverBorderColor: "#dee2e6",
                  data: this.dataBarCloture,
                  barPercentage: .75,
                  categoryPercentage: .5
                }
              ]
              },
              options: {
                scales: {          
                  y: {
         
                    stacked: false,
                    ticks: {
                      stepSize: 20
                    }
                  },
                  x: {
                    stacked: false,
                  }
                }
              }
            });
          })
        })
  
      })
      })
    }


    if (filter == 'Developpeur'){
      this.complaintService.detailsParPersonnelEtDate(date1,date2).subscribe((res:any[])=>{
        res.forEach(r=>{
          this.labelBar.push(r.username);
          this.dataBar.push(r.nbReclamation);
        })
      })
      this.complaintService.detailsParPersonnelAndStatusAndDate(Etat.EN_ATTENTE,date1,date2).subscribe((res:any[])=>{
        res.forEach(r=>{
          this.dataBarNouveaux.push(r.nbReclamation)
        })
        this.complaintService.detailsParPersonnelAndStatusAndDate(Etat.EN_COURS,date1,date2).subscribe((res:any[])=>{
          res.forEach(r=>{
            this.dataBarEnCours.push(r.nbReclamation);
          })
          this.complaintService.detailsParPersonnelAndStatusAndDate(Etat.ClOTURE,date1,date2).subscribe((res:any[])=>{
            res.forEach(r=>{
              this.dataBarCloture.push(r.nbReclamation);
            })
            this.chartBar =	new Chart("chartjs-bar", {
              type: "bar",
              data: {
                labels: this.labelBar,
                datasets: [
                  {
                  label: "Total",
                  backgroundColor: "blue",
                  borderColor: "blue",
                  hoverBackgroundColor: "blue",
                  hoverBorderColor: "blue",
                  data: this.dataBar,
                  barPercentage: .75,
                  categoryPercentage: .5,
                },
                {
                  label: "Nouvelles",
                  backgroundColor: "red",
                  borderColor: "red",
                  hoverBackgroundColor: "red",
                  hoverBorderColor: "red",
                  data: this.dataBarNouveaux,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                {
                  label: "En Cours",
                  backgroundColor: "yellow",
                  borderColor: "yellow",
                  hoverBackgroundColor: "yellow",
                  hoverBorderColor: "yellow",
                  data: this.dataBarEnCours,
                  barPercentage: .75,
                  categoryPercentage: .5
                },
                
                 {
                  label: "Cloturé",
                  backgroundColor: "green",
                  borderColor: "#dee2e6",
                  hoverBackgroundColor: "#dee2e6",
                  hoverBorderColor: "#dee2e6",
                  data: this.dataBarCloture,
                  barPercentage: .75,
                  categoryPercentage: .5
                }
              ]
              },
              options: {
                scales: {          
                  y: {
         
                    stacked: false,
                    ticks: {
                      stepSize: 20
                    }
                  },
                  x: {
                    stacked: false,
                  }
                }
              }
            });
          })
        })
  
      })
    }
  }
  
  loadChartFilter(filter,date1,date2){
    this.chartPie.destroy();
    this.labesPie = [];
    this.dataPie = [];
    if (filter == 'Projet')
    this.complaintService.detailsParProjetEtDate(date1,date2).subscribe((res:any[]) =>{
      console.log(res);
      res.forEach(r => {
        this.labesPie.push(r.projet);
        this.dataPie.push(r.nbReclamation);
        
      });
      this.chartPie = new Chart("chartjs-pie", {
        type: "pie",
        data: {
          labels: this.labesPie,
          datasets: [{
            data: this.dataPie,
            backgroundColor: [
              "red",
              "yellow",
              "green",
              "blue",
              "pink",
            ],
            borderColor: "transparent"
          }]
        },
        options: {
        }
      });
    })
    if (filter == 'Type')
    this.complaintService.detailsParTypeEtDate(date1,date2).subscribe((res:any[]) =>{
      res.forEach(r => {
        this.labesPie.push(r.type);
        this.dataPie.push(r.nbReclamation);
        
      });      
      this.chartPie = new Chart("chartjs-pie", {
        type: "pie",
        data: {
          labels: this.labesPie,
          datasets: [{
            data: this.dataPie,
            backgroundColor: [
              "red",
              "yellow",
              "green",
              "blue",
              "pink",
            ],
            borderColor: "transparent"
          }]
        },
        options: {
        }
      });
    })
    if (filter == 'Developpeur')
    this.complaintService.detailsParPersonnelEtDate(date1,date2).subscribe((res:any[]) =>{
      res.forEach(r => {
        this.labesPie.push(r.username);
        this.dataPie.push(r.nbReclamation);
        
      });      
      
      this.chartPie = new Chart("chartjs-pie", {
        type: "pie",
        data: {
          labels: this.labesPie,
          datasets: [{
            data: this.dataPie,
            backgroundColor: [
              "blue",
              "red",
              "green",
              "yellow",
              "pink",
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
    let date1 = this.datepipe.transform(this.dataFilter.value['date1'],'yyyy-MM-dd HH:mm');
    let date2 = this.datepipe.transform(this.dataFilter.value['date2'],'yyyy-MM-dd HH:mm');
    this.loadBarFilter(this.filter,date1,date2);
    this.loadChartFilter(this.filter,date1,date2);
  }

  cancel(){
    this.dataFilter.reset();
    this.labelBar = [];
    this.dataBar = [];
    this.dataBarNouveaux = [];
    this.dataBarEnCours = [];
    this.dataBarCloture = [];
    this.chartBar.destroy();
    this.loadBar(this.filter);
    this.loadChart(this.filter);

  }
}
