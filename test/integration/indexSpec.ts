import { expect } from 'chai';
import Factory, { DefaultAdapter } from '../../src/index.ts';
import '../test-helper/dummyFactories.ts';

class ObjectAdapter extends DefaultAdapter {
  build(Model: any, props: Record<string, any>) {
    const model = new Model();
    this.set(props, model, Model);
    return model;
  }
  async save(model: any, Model: any) {
    return model;
  }
  async destroy(model: any, Model: any) {
    return model;
  }
  get(model: any, attr: string, Model?: any) {
    return model[attr];
  }
  set(props: Record<string, any>, model: any, Model?: any) {
    return Object.assign(model, props);
  }
}

describe('indexIntegration', function () {
  Factory.setAdapter(new ObjectAdapter());
  beforeEach(function () {
    Factory.cleanUp();
  });

  describe('PhoneNumber factory', function () {
    it('can get attrs', async function () {
      const attrs = await Factory.attrs('PhoneNumber');
      expect(attrs).to.be.eql({
        type: 'mobile',
        number: '1234567890'
      });
    });

    it('can override attrs', async function () {
      const attrs = await Factory.attrs('PhoneNumber', { number: '0987654321' });
      expect(attrs).to.be.eql({
        type: 'mobile',
        number: '0987654321'
      });
    });

    it('can override attrs with generators as well', async function () {
      const attrs = await Factory.attrs('PhoneNumber', {
        alternate: Factory.assocAttrs('PhoneNumber')
      });
      expect(attrs.alternate).to.be.eql({
        type: 'mobile',
        number: '1234567890'
      });
    });

    it('can get multiple attrs', async function () {
      const attrs = await Factory.attrsMany('PhoneNumber', 3, {
        number: Factory.seq('PhoneNumber.override', (n) => `123-${n}`)
      });
      expect(attrs).to.be.an('array');
      expect(attrs).to.have.lengthOf(3);
    });

    it('can use chance generator', async function () {
      const attrs = await Factory.attrs('User');
      expect(attrs.bio).to.exist;
    });
  });

  describe('sequences', function () {
    it('generates sequences correctly', async function () {
      const objSeq1: any = await Factory.build('ObjSeq');
      const objSeq2: any = await Factory.build('ObjSeq');

      const funcSeq1: any = await Factory.build('FuncSeq');
      const funcSeq2: any = await Factory.build('FuncSeq');

      expect(objSeq1.s1).to.be.equal(1);
      expect(objSeq1.s2).to.be.equal(1);
      expect(objSeq1.s3).to.be.equal(1);
      expect(funcSeq1.s1).to.be.equal(1);

      expect(objSeq2.s1).to.be.equal(2);
      expect(objSeq2.s2).to.be.equal(2);
      expect(objSeq2.s3).to.be.equal(2);
      expect(funcSeq2.s1).to.be.equal(2);
    });
  });
});
