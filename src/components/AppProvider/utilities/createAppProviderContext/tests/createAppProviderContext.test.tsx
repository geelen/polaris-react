import React from 'react';
import * as appBridge from '@shopify/app-bridge';
import createAppProviderContext, {
  setClientInterfaceHook,
} from '../createAppProviderContext';
import StickyManager from '../../StickyManager';

jest.mock('../../../../../utilities/unstyled-link', () => ({
  Link: jest.fn(),
  __esModule: true,
}));

describe('createAppProviderContext()', () => {
  const createAppSpy: jest.SpyInstance<any> = jest.spyOn(appBridge, 'default');

  const Link: jest.Mock<{}> = require.requireMock(
    '../../../../../utilities/unstyled-link',
  ).Link;

  afterEach(() => {
    createAppSpy.mockReset();
    Link.mockReset();
  });

  it('returns the right context without properties', () => {
    createAppSpy.mockImplementationOnce((args) => args);
    const context = createAppProviderContext();

    expect(context).toMatchObject({
      link: expect.any(Link),
      stickyManager: expect.any(StickyManager),
      appBridge: undefined,
    });
  });

  it('returns the right context with properties', () => {
    createAppSpy.mockImplementationOnce((args) => ({
      ...args,
      dispatch: () => {},
      localOrigin: '',
      featuresAvailable: () => {},
      getState: () => {},
      subscribe: () => {},
      error: () => {},
    }));

    const CustomLinkComponent = () => {
      return <a href="test">Custom Link Component</a>;
    };
    const stickyManager = new StickyManager();
    const apiKey = '4p1k3y';
    const context = createAppProviderContext({
      linkComponent: CustomLinkComponent,
      stickyManager,
      apiKey,
    });

    expect(context).toMatchObject({
      link: expect.any(Link),
      stickyManager: expect.any(StickyManager),
      appBridge: {
        apiKey,
        forceRedirect: undefined,
        shopOrigin: undefined,
        dispatch: expect.any(Function),
        localOrigin: '',
        featuresAvailable: expect.any(Function),
        getState: expect.any(Function),
        subscribe: expect.any(Function),
        error: expect.any(Function),
      },
    });

    expect(Link).toHaveBeenCalledWith(CustomLinkComponent);
  });

  it('adds an app bridge hook to set clientInterface data', () => {
    const set = jest.fn();
    createAppSpy.mockImplementationOnce((args) => {
      return {...args, hooks: {set}};
    });

    const apiKey = '4p1k3y';
    createAppProviderContext({apiKey});

    expect(set).toHaveBeenCalledWith(
      appBridge.LifecycleHook.DispatchAction,
      setClientInterfaceHook,
    );
  });

  it('setClientInterfaceHook augments app bridge actions with clientInterface property', () => {
    const next = jest.fn((args) => args);
    const baseAction = {type: 'actionType'};

    expect(setClientInterfaceHook.call({}, next)(baseAction)).toStrictEqual({
      type: 'actionType',
      clientInterface: {
        name: '@shopify/polaris',
        version: '{{POLARIS_VERSION}}',
      },
    });
  });
});
