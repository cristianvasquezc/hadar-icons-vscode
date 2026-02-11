export interface IconPack {
  name: string;
  label: string;
  detail: string;
  fileExtensions: Record<string, string>;
}

const angularExtensions = {
  'module.ts': 'angular',
  'module.js': 'angular',
  'component.ts': 'angular-component',
  'component.js': 'angular-component',
  'guard.ts': 'angular-guard',
  'guard.js': 'angular-guard',
  'service.ts': 'angular-service',
  'service.js': 'angular-service',
  'pipe.ts': 'angular-pipe',
  'pipe.js': 'angular-pipe',
  'filter.js': 'angular-pipe',
  'directive.ts': 'angular-directive',
  'directive.js': 'angular-directive',
  'resolver.ts': 'angular-resolver',
  'resolver.js': 'angular-resolver',
};

const ngrxExtensions = {
  'actions.ts': 'ngrx-actions',
  'effects.ts': 'ngrx-effects',
  'reducer.ts': 'ngrx-reducer',
  'selectors.ts': 'ngrx-selectors',
  'state.ts': 'ngrx-state',
  'entity.ts': 'ngrx-entity',
};

const nestExtensions = {
  'module.ts': 'nest-module',
  'controller.ts': 'nest-controller',
  'service.ts': 'nest-service',
  'guard.ts': 'nest-guard',
  'pipe.ts': 'nest-pipe',
  'filter.ts': 'nest-filter',
  'middleware.ts': 'nest-middleware',
  'decorator.ts': 'nest-decorator',
  'gateway.ts': 'nest-gateway',
  'resolver.ts': 'nest-resolver',
};

const reactExtensions = {
  // React specific if any distinct from standard tsx/jsx
};

const reduxExtensions = {
  'action.ts': 'redux-action',
  'actions.ts': 'redux-action',
  'reducer.ts': 'redux-reducer',
  'reducers.ts': 'redux-reducer',
  'selector.ts': 'redux-selector',
  'selectors.ts': 'redux-selector',
  'store.ts': 'redux-store',
};

const vueExtensions = {
  // Vue specific
};

const vuexExtensions = {
  'store.js': 'vuex-store',
  'store.ts': 'vuex-store',
  'modules.js': 'vuex-store',
  'modules.ts': 'vuex-store',
};

export const packs: IconPack[] = [
  {
    name: 'default',
    label: 'Default',
    detail: 'Standard Hadar icons without framework specifics',
    fileExtensions: {},
  },
  {
    name: 'angular',
    label: 'Angular',
    detail: 'Angular icons (components, directives, services, etc.)',
    fileExtensions: { ...angularExtensions },
  },
  {
    name: 'angular_ngrx',
    label: 'Angular + NgRx',
    detail: 'Angular icons with NgRx state management',
    fileExtensions: { ...angularExtensions, ...ngrxExtensions },
  },
  {
    name: 'nestjs',
    label: 'NestJS',
    detail: 'NestJS icons (modules, controllers, services, etc.)',
    fileExtensions: { ...nestExtensions },
  },
  {
    name: 'react',
    label: 'React',
    detail: 'React icons only',
    fileExtensions: { ...reactExtensions },
  },
  {
    name: 'react_redux',
    label: 'React + Redux',
    detail: 'React icons with Redux state management',
    fileExtensions: { ...reactExtensions, ...reduxExtensions },
  },
  {
    name: 'vue',
    label: 'Vue',
    detail: 'Vue icons only',
    fileExtensions: { ...vueExtensions },
  },
  {
    name: 'vue_vuex',
    label: 'Vue + Vuex',
    detail: 'Vue icons with Vuex state management',
    fileExtensions: { ...vueExtensions, ...vuexExtensions },
  },
];
