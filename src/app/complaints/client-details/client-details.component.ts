import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { CompalintService } from 'src/app/services/compalint.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  id;
  data;
  companyName;
  
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public complaint: any,
    private imageService:ImageService,
    private complaintService:CompalintService
    )
     { 
      this.id = complaint.complaintId;
      this.companyName = complaint.companyName;
      
     }

  ngOnInit(): void {
    this.complaintService.getClientByRecid(this.id).toPromise().then((res:any)=>{
      this.data = res;
      this.imageService.getImage(this.data.username).subscribe((res)=>{
        console.log(res);
        if (res != null)
        {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.data;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      })
    })
  }

}
