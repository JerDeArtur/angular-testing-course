import { CalculatorService } from './calculator.service';
import { TestBed } from '@angular/core/testing'
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {

  let calc: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]})
    calc = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    const res = calc.add(2,3);
    expect(res).toBe(5);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  })

  it('should subtract two numbers' , () => {
    const res = calc.subtract(5,3);
    expect(res).toBe(2, 'Unexpected sustraction result');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  })
})
