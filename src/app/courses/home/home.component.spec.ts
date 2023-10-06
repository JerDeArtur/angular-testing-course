import {waitForAsync, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




fdescribe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(c => c.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(c => c.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{provide: CoursesService, useValue: spy}]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    })

  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs')
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs')
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab'));
    expect(tabs.length).toBe(2, 'Should display 2 tabs')
  });


  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab'));
    click(tabs[1]);
    fixture.detectChanges();
    flush();

    const titles = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'));
    expect(titles).toBeTruthy('No courses displayed');
    expect(titles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  it("should display advanced courses when tab clicked - async", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab'));
    click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const titles = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'));
      expect(titles).toBeTruthy('No courses displayed');
      expect(titles[0].nativeElement.textContent).toContain('Angular Security Course');
    });
  }));
});


