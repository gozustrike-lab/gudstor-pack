// @ts-nocheck
import { defineField, defineType } from 'sanity';

export const titleField = () =>
  defineField({
    name: 'title',
    title: 'Título',
    type: 'string',
    validation: (Rule) => Rule.required(),
  });

export const slugField = (prefix?: string) =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: {
      source: 'title',
      maxLength: 96,
    },
    validation: (Rule) => Rule.required(),
  });

export const imageField = () =>
  defineField({
    name: 'image',
    title: 'Imagen',
    type: 'image',
    options: { hotspot: true },
  });

export const descriptionField = () =>
  defineField({
    name: 'description',
    title: 'Descripción',
    type: 'text',
    rows: 4,
  });

export const orderField = () =>
  defineField({
    name: 'order',
    title: 'Orden',
    type: 'number',
    initialValue: 0,
  });

export const featuredField = () =>
  defineField({
    name: 'featured',
    title: 'Destacado',
    type: 'boolean',
    initialValue: false,
  });

export const statusField = () =>
  defineField({
    name: 'status',
    title: 'Estado',
    type: 'string',
    options: {
      list: [
        { title: 'Publicado', value: 'published' },
        { title: 'Borrador', value: 'draft' },
      ],
      layout: 'radio',
    },
    initialValue: 'published',
  });