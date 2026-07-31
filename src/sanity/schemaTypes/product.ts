import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Product name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Click "Generate" to create a slug'),
    }),
    defineField({
      name: 'sku',
      title: 'SKU Code',
      type: 'string',
      description: 'Unique inventory code (e.g. FRG-TSHIRT-001)',
      validation: (Rule) => Rule.required().error('SKU is required'),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).error('Price must be a positive number'),
    }),
    defineField({
      name: 'images',
      title: 'Product Images (Up to 5)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(5)
          .error('You must upload between 1 and 5 images'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'images.0',
      price: 'price',
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title: title || 'Untitled',
        subtitle: `${subtitle ? `[SKU: ${subtitle}]` : ''} - $${price || 0} USD`,
        media,
      };
    },
  },
});