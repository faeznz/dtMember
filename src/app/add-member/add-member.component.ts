import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  member: any = {};

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  addMember() {
    this.http.post('https://ill-ruby-jay-kit.cyclic.app/members', this.member)
      .subscribe(() => {
        console.log('Member added successfully');
        // Lakukan tindakan setelah menambahkan member, seperti mengosongkan input
        alert('Data member berhasil ditambahkan!');
        this.router.navigate(['/']);
        this.member = {};
      }, error => {
        console.log('Failed to add member', error);
        alert('Isikan data secara lengkap!');
      });
  }
}
