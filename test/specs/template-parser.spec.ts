import { expect } from 'chai';
import { TemplateParser } from '../../src/libs/template-parser';

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
});
