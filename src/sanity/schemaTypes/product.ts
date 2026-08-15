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
      title: 'Selling Price ($USD) - Tu precio',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original / Retail Price ($USD)',
      type: 'number',
      description: 'El precio original de tienda (para mostrar descuento y comparar)',
      validation: (Rule) => Rule.min(0),
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
      originalPrice: 'originalPrice',
      itemNumber: 'itemNumber',
    },
    prepare({ title, media, price, originalPrice, itemNumber }) {
      const priceDisplay = price !== undefined ? `$${price}` : 'No price';
      const originalDisplay = originalPrice ? ` (Retail: $${originalPrice})` : '';
      return {
        title: title ? `${title} (${itemNumber})` : 'Untitled',
        subtitle: `${priceDisplay}${originalDisplay}`,
        media,
      };
    },
  },
});