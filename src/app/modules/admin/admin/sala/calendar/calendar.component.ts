import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { SalaService } from '../sala.service';
import thLocale from '@fullcalendar/core/locales/th';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {


    itemId: string;
    events: any = [];
    isLoading: boolean = false;
    calendarOptions: CalendarOptions = {
        locale: thLocale,
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        eventClick: this.onEvent.bind(this),

    };



    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _Service: SalaService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) { }

    ngOnInit(): void {

        this.itemId = this._activatedRoute.snapshot.paramMap.get('id');
        this.getPlane(this.itemId);
        this.calendarOptions

    }

    getPlane(data) {
        this._Service.getCalendar(data).subscribe((res) => {
            this.events = [];
            console.log(res.data.rents)
            for (let i = 0; i <= res.data.rents.length - 1; i++) {
                let sendData = {
                    title: res.data.rents[i]['name'] + ' ,' + res.data.rents[i]['tel'] + ' : ' + res.data.rents[i]['remark'],
                    start: res.data.rents[i]['fdate'],
                    end: res.data.rents[i]['edate'],
                    groupId: res.data.rents[i]['id'],
                };
                this.events.push(sendData);
            }
            this.calendarOptions = {
                eventClick: this.onEvent.bind(this),
                events: this.events,
            }
            this._changeDetectorRef.markForCheck();

        });
    }

    onEvent(arg: any) {
        this._router.navigate(['/sala/edit-reserve-sala/' + arg.event._def.groupId]);
    }


}
