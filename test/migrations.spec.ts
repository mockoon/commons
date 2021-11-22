import { expect } from 'chai';
import { Environment, Migrations } from '../src';

describe('Migrations', () => {
  describe('migration n. 19', () => {
    it('should build a default tlsOptions object and remove the old https property', () => {
      const migrationFunction = Migrations.find(
        (migration) => migration.id === 19
      )?.migrationFunction;

      if (!migrationFunction) {
        throw new Error('Cannot find migration function');
      }

      const environment: Partial<Environment> & { https: boolean } = {
        https: true
      };

      migrationFunction(environment as any);

      expect(environment.https).to.be.undefined;
      expect(environment.tlsOptions).to.deep.equal({
        enabled: true,
        type: 'CERT',
        pfxPath: '',
        certPath: '',
        keyPath: '',
        caPath: '',
        passphrase: ''
      });
    });
  });
});
