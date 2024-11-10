import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {
  memberId: string = '';
  member: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.memberId = this.route.snapshot.paramMap.get('id')!;
    this.getMember(this.memberId);
  }

  getMember(id: string) {
    this.http.get<any>(`https://data-member-backend.vercel.app/members/${id}`)
      .subscribe(data => {
        this.member = data;
      });
  }

  updateMember() {
    this.http.put(`https://data-member-backend.vercel.app/members/${this.memberId}`, this.member)
      .subscribe(() => {
        console.log('Member updated successfully');
        // Lakukan tindakan setelah mengupdate member, jika diperlukan
        alert('Data member berhasil diubah!');
        this.router.navigate(['/']);
      }, error => {
        console.log('Failed to update member', error);
      });
  }
}
