import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, LESSONS, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService]
    })
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  })

  it('should retrieve all courses', () => {

      coursesService.findAllCourses().subscribe(courses => {
        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12, 'Incorrect number of courses');

        const course = courses.find(c => c.id === 12);
        expect(course.titles.description).toBe('Angular Testing Course')
      });

      const testReq = httpTestingController.expectOne('http://localhost:9000/api/courses');
      expect(testReq.request.method).toEqual('GET');
      testReq.flush({
        payload: Object.values(COURSES)
      });
  });

  it('should find a course by id', () => {

    coursesService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy('Course not found');
      expect(course.titles.description).toBe('Angular Testing Course')
    });

    const testReq = httpTestingController.expectOne('/api/courses/12');
    expect(testReq.request.method).toEqual('GET');
    testReq.flush(COURSES[12]);
  });

  it('should save the course data', () => {

    const changes: Partial<Course> = {
      titles: {description: 'Testing Course'}
    };

    coursesService.saveCourse(12, changes).subscribe(course => {
      expect(course.id).toBe(12, 'Wrong course received');
      expect(course).toBeTruthy('Course not found');
      expect(course.titles.description).toEqual('Testing Course');
    });

    const testReq = httpTestingController.expectOne('/api/courses/12');
    expect(testReq.request.method).toEqual('PUT');
    expect(testReq.request.body.titles.description).toEqual(changes.titles.description);

    testReq.flush({
      ...COURSES[12],
      ...changes
    });
  });

  it('should return an error when save course fails', () => {

    const changes: Partial<Course> = {
      titles: {description: 'Testing Course'}
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail('Save course should have filed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const testReq = httpTestingController.expectOne('/api/courses/12');
    expect(testReq.request.method).toEqual('PUT');

    testReq.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', () => {

    coursesService.findLessons(12).subscribe(lessons => {
      expect(lessons).toBeTruthy('No lessons retrieved');
      expect(lessons.length).toBe(3);
    });

    const testReq = httpTestingController.expectOne(req => req.url === '/api/lessons');
    expect(testReq.request.method).toEqual('GET');
    expect(testReq.request.params.get('courseId')).toEqual('12');
    expect(testReq.request.params.get('filter')).toEqual('');
    expect(testReq.request.params.get('sortOrder')).toEqual('asc');
    expect(testReq.request.params.get('pageNumber')).toEqual('0');
    expect(testReq.request.params.get('pageSize')).toEqual('3');

    testReq.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  })
})
