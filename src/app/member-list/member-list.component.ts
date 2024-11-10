import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members?: any[];

  constructor(private http: HttpClient, private router: Router, private location: Location, private authService: AuthService) { }

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    this.http.get<any[]>('https://data-member-backend.vercel.app/')
      .subscribe(data => {
        this.members = data;
      });
  }

  formatTanggal(tanggal: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const tanggalObj = new Date(tanggal);
    return tanggalObj.toLocaleDateString('id-ID', options);
  }

  editMember(id: string) {
    this.router.navigate(['/edit-member', id]);
  }

  deleteMember(id: string) {
    // Mengambil data member berdasarkan ID sebelum menghapus
    const memberIndex = this.members?.findIndex(member => member._id === id);
    if (memberIndex === undefined || memberIndex === -1) {
      console.log('Member not found');
      return;
    }

    this.http.delete(`https://drab-tan-rattlesnake-vest.cyclic.app/members/${id}`)
      .subscribe(() => {
        console.log('Member deleted successfully');
        if (this.members && memberIndex !== undefined) {
          this.members.splice(memberIndex, 1);
          // Lakukan tindakan setelah menghapus member, jika diperlukan
          const memberName = this.members[memberIndex]?.nama;
          alert(`Berhasil menghapus member ${memberName}`);
        }
      }, error => {
        console.log('Failed to delete member', error);
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
