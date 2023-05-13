import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { SalaService } from '../sala.service';
import thLocale from '@fullcalendar/core/locales/th';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
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


    };



    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _Service: SalaService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) { }

    ngOnInit(): void {


    }





}
