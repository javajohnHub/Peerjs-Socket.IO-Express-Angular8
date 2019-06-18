import { Component } from '@angular/core';
import {SocketService} from '../../shared/socket.service';
import * as Peer from "peerjs_fork_firefox40";
@Component({
  selector: 'app-ping',
  template: `
  <input [(ngModel)]="name"/>
  <button type="button" (click)="sendName()">Send Name</button><br/>
  <div *ngIf="messages.length > 0">
    <ul>
    <li *ngFor="let msg of messages">{{msg.from}} {{msg.msg}}</li>
    </ul>
  </div>

  <input type="text" [(ngModel)]="room"/>
  <input type="number" [(ngModel)]="limit"/>
  <button type="button" (click)="sendRoom()">Create room</button><br/>
  People: {{peopleCount}} {{people | json}}<br/>
  Rooms: {{roomCount}}<br/>
  <div *ngFor="let room of rms">
    <button type="button" (click)="joinRoom(room.id)" >Join {{room.name}}</button>
    <button type="button" (click)="leaveRoom(room.id)" >leave {{room.name}}</button>
  </div>
  <button type="button" (click)="removeRoom()">Remove room</button>
  `
})
export class PingComponent {
  socket: any;
  peer;
  people;
  color;
  person;
  messages = [];
  message;
  name;
  device;
  peopleCount;
  roomCount;
  rooms;
  room;
  limit = 2;
  rms;
  peeps;
  constructor() {
    this.socket = SocketService.getInstance();
    this.peer = new Peer({
      host: "sharecode.online",
      port: "9000",
      path: "/",
      secure: true,
      debug: 3
    });
    this.peer.on("open", () => {
      this.socket.emit('peerId', this.peer.id);
    });

    this.socket.on('update-people', (people) => {
      this.people = people.people;
      this.peopleCount = people.peopleCount;
      this.person = people[this.socket.socket.id];
      this.peeps = Object.values(this.people);
    });

    this.socket.on('update-rooms', (rooms) => {
      this.rooms = rooms.rooms;
      this.roomCount = rooms.roomCount;
      this.rms = Object.values(this.rooms);
    });

    this.socket.on("exists", proposedName => {
      this.name = proposedName.proposedName;
      alert('name exists try ' + this.name)
    });

    this.socket.on("admin chat", msg => {
      this.messages.push(msg);
    });


  }
  sendName(){
    this.device = "desktop";
    if (
      navigator.userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i
      )
    ) {
      this.device = "mobile";
    }
    this.socket.emit('send name', {name: this.name, device: this.device})
  }

  sendRoom(){
    this.socket.emit('create room', {name: this.room, limit: this.limit})
  }

  removeRoom(){
    this.socket.emit('remove room')
  }

  joinRoom(id){
    this.socket.emit('join room', id)
  }

  leaveRoom(id){
    this.socket.emit('leave room', id)
  }
}