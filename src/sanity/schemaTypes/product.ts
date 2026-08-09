import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',

  fields: [
    defineField({
      name: 'itemNumber',
      title: 'Item Number / SKU',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price ($USD)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Thumbnail or main display image.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'extraImages',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) =>
        Rule.max(4).error('You can upload up to 4 additional images.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'conditionNotes',
      title: 'Condition Notes / Open-Box Details',
      type: 'text',
      description: 'Explain any missing parts, opened packaging, or cosmetic details for returned items.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
      price: 'price',
      itemNumber: 'itemNumber',
    },
    prepare({ title, media, price, itemNumber }) {
      return {
        title: title ? `${title} (${itemNumber})` : 'Untitled',
        subtitle: price !== undefined ? `$${price}` : 'No price set',
        media,
      };
    },
  },
});