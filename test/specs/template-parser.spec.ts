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
});
