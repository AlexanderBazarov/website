import { createElement, type ComponentType, type ReactElement } from 'react';

export interface FieldMap {}

export type FieldType = Extract<keyof FieldMap, string>;

export interface FieldCommon {
  id?: string;

  span?: 1 | 2 | 'full';

  hidden?: boolean;
}

export type FieldOf<K extends FieldType> = { type: K } & FieldMap[K] & FieldCommon;

export type Field = { [K in FieldType]: FieldOf<K> }[FieldType];

export type FieldComponent<K extends FieldType> = ComponentType<FieldOf<K>>;

const registry = new Map<string, ComponentType<any>>();

export function registerField<K extends FieldType>(type: K, component: FieldComponent<K>): void {
  registry.set(type, component);
}

export function registerFields(entries: Partial<{ [K in FieldType]: FieldComponent<K> }>): void {
  for (const [type, component] of Object.entries(entries)) {
    if (component) registry.set(type, component as ComponentType<any>);
  }
}

export function getFieldComponent(type: string): ComponentType<any> | undefined {
  return registry.get(type);
}

export function registeredFieldTypes(): string[] {
  return [...registry.keys()].sort();
}

export function field<K extends FieldType>(value: FieldOf<K>): Field {
  return value as Field;
}

function MissingField({ type }: { type: string }) {
  return createElement(
    'div',
    { style: { color: 'var(--red)' } },
    `!! нет рендерера для поля "${type}"`,
  );
}

export function renderField(item: Field, key?: string | number): ReactElement {
  if (item.hidden) return createElement('span', { key, hidden: true });
  const Component = getFieldComponent(item.type) ?? MissingField;
  return createElement(Component, { key: item.id ?? key, ...item });
}

export function renderFields(items: readonly Field[] | undefined): ReactElement[] {
  return (items ?? []).map((item, index) => renderField(item, item.id ?? index));
}
