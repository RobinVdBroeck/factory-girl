import { expectTypeOf } from 'expect-type';
import { describe, it } from 'mocha';
import Factory from '../../src/index.ts';
import type { FactoryRegistry } from '../../src/FactoryGirl.ts';

// ---------------------------------------------------------------------------
// Local model/attrs types used only in this file
// ---------------------------------------------------------------------------

interface TypedUserAttrs {
  name: string;
  age: number;
}

class TypedUserModel {
  name!: string;
  age!: number;
}

interface TypedPostAttrs {
  title: string;
}

class TypedPostModel {
  title!: string;
}

// ---------------------------------------------------------------------------
// Registry augmentation
// ---------------------------------------------------------------------------

declare module '../../src/FactoryGirl.ts' {
  interface FactoryRegistry {
    TypedUser: { attrs: TypedUserAttrs; model: TypedUserModel };
    TypedPost: { attrs: TypedPostAttrs; model: TypedPostModel };
  }
}

// Ensure the augmentation compiled (FactoryRegistry is used at the type level)
type _RegistryCheck = FactoryRegistry;

// ---------------------------------------------------------------------------
// Type assertions
// ---------------------------------------------------------------------------

describe('FactoryGirl type-level tests', () => {
  describe('build', () => {
    it('returns Promise<ModelFor<Name>> for a registered name', () => {
      expectTypeOf(Factory.build('TypedUser')).toEqualTypeOf<Promise<TypedUserModel>>();
    });

    it('returns Promise<any> for an unregistered name', () => {
      expectTypeOf(Factory.build('UnknownFactory')).toEqualTypeOf<Promise<any>>();
    });
  });

  describe('create', () => {
    it('returns Promise<ModelFor<Name>> for a registered name', () => {
      expectTypeOf(Factory.create('TypedUser')).toEqualTypeOf<Promise<TypedUserModel>>();
    });

    it('returns Promise<any> for an unregistered name', () => {
      expectTypeOf(Factory.create('UnknownFactory')).toEqualTypeOf<Promise<any>>();
    });
  });

  describe('attrs', () => {
    it('returns Promise<AttrsFor<Name>> for a registered name', () => {
      expectTypeOf(Factory.attrs('TypedUser')).toEqualTypeOf<Promise<TypedUserAttrs>>();
    });

    it('returns Promise<Record<string,any>> for an unregistered name', () => {
      expectTypeOf(Factory.attrs('UnknownFactory')).toEqualTypeOf<Promise<Record<string, any>>>();
    });
  });

  describe('buildMany', () => {
    it('returns Promise<ModelFor<Name>[]> for a registered name', () => {
      expectTypeOf(Factory.buildMany('TypedUser', 3)).toEqualTypeOf<Promise<TypedUserModel[]>>();
    });

    it('returns Promise<any[]> for an unregistered name', () => {
      expectTypeOf(Factory.buildMany('UnknownFactory', 3)).toEqualTypeOf<Promise<any[]>>();
    });
  });

  describe('createMany', () => {
    it('returns Promise<ModelFor<Name>[]> for a registered name', () => {
      expectTypeOf(Factory.createMany('TypedUser', 3)).toEqualTypeOf<Promise<TypedUserModel[]>>();
    });

    it('returns Promise<any[]> for an unregistered name', () => {
      expectTypeOf(Factory.createMany('UnknownFactory', 3)).toEqualTypeOf<Promise<any[]>>();
    });
  });

  describe('attrsMany', () => {
    // attrsMany is synchronous (not async), so calling it would throw at runtime.
    // Use ReturnType to assert purely at the type level without invoking the function.
    it('returns Promise<AttrsFor<Name>[]> for a registered name', () => {
      type Result = ReturnType<typeof Factory.attrsMany<'TypedUser'>>;
      expectTypeOf<Result>().toEqualTypeOf<Promise<TypedUserAttrs[]>>();
    });

    it('returns Promise<Record<string,any>[]> for an unregistered name', () => {
      type Result = ReturnType<typeof Factory.attrsMany<'UnknownFactory'>>;
      expectTypeOf<Result>().toEqualTypeOf<Promise<Record<string, any>[]>>();
    });
  });

  describe('assoc', () => {
    it('returns () => Promise<ModelFor<Name>> for a registered name', () => {
      expectTypeOf(Factory.assoc('TypedUser')).toEqualTypeOf<() => Promise<TypedUserModel>>();
    });

    it('returns () => Promise<any> for an unregistered name', () => {
      expectTypeOf(Factory.assoc('UnknownFactory')).toEqualTypeOf<() => Promise<any>>();
    });
  });

  describe('assocMany', () => {
    it('returns () => Promise<ModelFor<Name>[]> for a registered name', () => {
      expectTypeOf(Factory.assocMany('TypedUser', 3)).toEqualTypeOf<
        () => Promise<TypedUserModel[]>
      >();
    });
  });

  describe('assocAttrs', () => {
    it('returns () => Promise<AttrsFor<Name>> for a registered name', () => {
      expectTypeOf(Factory.assocAttrs('TypedUser')).toEqualTypeOf<
        () => Promise<TypedUserAttrs>
      >();
    });

    it('returns () => Promise<Record<string,any>> for an unregistered name', () => {
      expectTypeOf(Factory.assocAttrs('UnknownFactory')).toEqualTypeOf<
        () => Promise<Record<string, any>>
      >();
    });
  });

  describe('assocAttrsMany', () => {
    it('returns () => Promise<AttrsFor<Name>[]> for a registered name', () => {
      expectTypeOf(Factory.assocAttrsMany('TypedUser', 3)).toEqualTypeOf<
        () => Promise<TypedUserAttrs[]>
      >();
    });
  });

  describe('define (negative test)', () => {
    it('rejects wrong attr types for a registered name', () => {
      // @ts-expect-error — `age` must be number, not string
      Factory.define('TypedUser', TypedUserModel, { name: 'Alice', age: 'not-a-number' });
    });
  });
});
