import { expect } from 'chai';
import { format as dateFormat } from 'date-fns';
import { TemplateParser } from '../src/libs/template-parser';

describe('Template parser', () => {
  describe('Helper: concat', () => {
    it('should concat two strings', () => {
      const parseResult = TemplateParser("{{concat 'test' 'test'}}", {} as any);
      expect(parseResult).to.be.equal('testtest');
    });

    it('should concat two strings and repeat index', () => {
      const parseResult = TemplateParser(
        "{{#repeat 1 comma=false}}{{concat 'test' @index 'test'}}{{/repeat}}",
        {} as any
      );
      expect(parseResult).to.be.equal('test0test');
    });

    it('should concat two strings and the result of a helper', () => {
      const parseResult = TemplateParser(
        "{{#repeat 1 comma=false}}{{concat 'test' (body 'id') 'test'}}{{/repeat}}",
        { bodyJSON: { id: '123' } } as any
      );
      expect(parseResult).to.be.equal('test123test');
    });

    it('should concat two strings and number', () => {
      const parseResult = TemplateParser(
        "{{concat 'test' 123 'test'}}",
        {} as any
      );
      expect(parseResult).to.be.equal('test123test');
    });

    it('should concat object path to retrieve body array items', () => {
      const parseResult = TemplateParser(
        "{{#repeat 2 comma=false}}item_{{body (concat 'a.' @index '.item')}}{{/repeat}}",
        { bodyJSON: { a: [{ item: 10 }, { item: 20 }] } } as any
      );
      expect(parseResult).to.be.equal('item_10item_20');
    });
  });

  describe('Helper: setVar', () => {
    it('should set a variable to a string', () => {
      const parseResult = TemplateParser(
        "{{setVar 'testvar' 'testvalue'}}{{testvar}}",
        {} as any
      );
      expect(parseResult).to.be.equal('testvalue');
    });

    it('should set a variable to a number', () => {
      const parseResult = TemplateParser(
        "{{setVar 'testvar' 123}}{{testvar}}",
        {} as any
      );
      expect(parseResult).to.be.equal('123');
    });

    it('should set a variable value to body helper result', () => {
      const parseResult = TemplateParser(
        "{{setVar 'testvar' (body 'uuid')}}{{testvar}}",
        {
          bodyJSON: { uuid: '0d35618e-5e85-4c09-864d-6d63973271c8' }
        } as any
      );
      expect(parseResult).to.be.equal('0d35618e-5e85-4c09-864d-6d63973271c8');
    });

    it('should set a variable value to oneOf helper result', () => {
      const parseResult = TemplateParser(
        "{{setVar 'testvar' (oneOf (array 'item1'))}}{{testvar}}",
        {} as any
      );
      expect(parseResult).to.be.equal('item1');
    });

    it('should set a variable and use it in another helper', () => {
      const parseResult = TemplateParser(
        "{{setVar 'testvar' 5}}{{#repeat testvar comma=false}}test{{/repeat}}",
        {} as any
      );
      expect(parseResult).to.be.equal('testtesttesttesttest');
    });

    it('should set a variable to empty value if none provided', () => {
      const parseResult = TemplateParser(
        "{{setVar 'testvar'}}{{testvar}}",
        {} as any
      );
      expect(parseResult).to.be.equal('');
    });

    it('should not set a variable if no name provided', () => {
      const parseResult = TemplateParser("{{setVar ''}}{{testvar}}", {} as any);
      expect(parseResult).to.be.equal('');
    });
  });

  describe('Helper: dateTimeShift', () => {
    it('Should not throw an error when passed with invalid parameters.', () => {
      const parseResult = TemplateParser('{{dateTimeShift 1}}', {} as any);

      // When invalid parameters are passed, the default should just be to return the current date with no shift.
      const date = new Date();
      const dateString = dateFormat(date, "yyyy-MM-dd'T'HH:mm");
      expect(parseResult).to.match(new RegExp(dateString + '.*'));
    });

    it('Should return a date shifted the specified amount of days from now.', () => {
      const parseResult = TemplateParser('{{dateTimeShift days=2}}', {} as any);

      const date = new Date();
      date.setDate(date.getDate() + 2);
      // As our reference date here may differ slightly from the one interally used in the helper, it's more reliable to just compare the date/time with the seconds (and lower) excluded.
      const dateString = dateFormat(date, "yyyy-MM-dd'T'HH:mm");
      expect(parseResult).to.match(new RegExp(dateString + '.*'));
    });

    it('Should return a date shifted by the requested amount from a specified start date.', () => {
      const parseResult = TemplateParser(
        "{{dateTimeShift date='2021-02-01' days=2 months=4}}",
        {} as any
      );

      expect(parseResult).to.match(/2021-06-03.*/);
    });

    it('Should return a date shifted by the requested amount from the specified start date in the specified format.', () => {
      const parseResult = TemplateParser(
        "{{dateTimeShift date='2021-02-01' format='yyyy-MM-dd' days=2 months=4}}",
        {} as any
      );

      expect(parseResult).to.equals('2021-06-03');
    });

    it('Should return a date time shifted by the requested amount from the specified start date in the specified format.', () => {
      const parseResult = TemplateParser(
        "{{dateTimeShift date='2021-02-01T10:45:00' format=\"yyyy-MM-dd'T'HH:mm:ss\" days=8 months=3 hours=1 minutes=2 seconds=3}}",
        {} as any
      );

      expect(parseResult).to.equals('2021-05-09T11:47:03');
    });
  });

  describe('Helper: someOf', () => {
    it('should return one element', () => {
      const parseResult = TemplateParser(
        "{{someOf (array 'value1' 'value2' 'value3' 'value4' 'value5' 'value6') 1 1}}",
        {} as any
      );

      const count = (parseResult.match(/value/g) || []).length;
      expect(count).to.equal(1);
    });

    it('should return 1 to 3 elements', () => {
      const parseResult = TemplateParser(
        "{{someOf (array 'value1' 'value2' 'value3' 'value4' 'value5' 'value6') 1 3}}",
        {} as any
      );

      const countItems = (parseResult.match(/value/g) || []).length;
      expect(countItems).is.least(1);
      expect(countItems).is.most(3);

      const countSeparators = (parseResult.match(/,/g) || []).length;
      expect(countSeparators).is.least(0);
      expect(countSeparators).is.most(2);
    });

    it('should return 1 to 3 elements as array', () => {
      const parseResult = TemplateParser(
        "{{someOf (array 'value1' 'value2' 'value3' 'value4' 'value5' 'value6') 1 3 true}}",
        {} as any
      );
      expect(parseResult.match(/^\[.*\]$/)?.length).to.equal(1);
      const countItems = (parseResult.match(/value/g) || []).length;
      expect(countItems).is.least(1);
      expect(countItems).is.most(3);

      const countSeparators = (parseResult.match(/,/g) || []).length;
      expect(countSeparators).is.least(0);
      expect(countSeparators).is.most(2);
    });
  });
});
